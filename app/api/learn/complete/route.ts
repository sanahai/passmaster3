import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// 단계 완료 처리 → LearningProgress 갱신 (다음 단계 잠금 해제)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { courseSlug, sessionType, mockNumber, score } = await req.json();

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return NextResponse.json({ error: "course not found" }, { status: 404 });

  const update: Record<string, unknown> = {};
  switch (sessionType) {
    case "round1":
      update.round1Done = true;
      update.lastRound = 1;
      break;
    case "round2":
      update.round2Done = true;
      update.lastRound = 2;
      break;
    case "round3":
      update.round3Done = true;
      update.lastRound = 3;
      break;
    case "wrong_round":
      update.wrongRoundDone = true;
      break;
    case "mock":
      if (mockNumber) {
        const prog = await prisma.learningProgress.findUnique({
          where: { userId_courseId: { userId: session.userId, courseId: course.id } },
        });
        update.mockDone = Math.max(prog?.mockDone ?? 0, mockNumber);
        update.lastMock = mockNumber;

        // 모의고사 세션 점수 기록
        await prisma.mockSession.updateMany({
          where: {
            userId: session.userId,
            courseId: course.id,
            mockNumber,
            completedAt: null,
          },
          data: {
            completedAt: new Date(),
            score: typeof score === "number" ? score : null,
          },
        });
      }
      break;
    case "wrong_mock":
      update.wrongMockDone = true;
      break;
  }
  update.lastQIndex = 0;
  // 단계 완료 → 진행 중 단계 표시 초기화 (다음 단계 시작 전까지 0%)
  update.curStepKey = "";
  update.curStepPct = 0;

  await prisma.learningProgress.upsert({
    where: { userId_courseId: { userId: session.userId, courseId: course.id } },
    create: { userId: session.userId, courseId: course.id, ...update },
    update,
  });

  return NextResponse.json({ ok: true });
}
