import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// 학습 진행 위치 저장 (이어하기용) — 5문제마다 호출
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { courseSlug, lastQIndex, lastRound, lastMock, curStepKey, curStepPct } =
    await req.json();

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return NextResponse.json({ error: "course not found" }, { status: 404 });

  await prisma.learningProgress.upsert({
    where: { userId_courseId: { userId: session.userId, courseId: course.id } },
    create: {
      userId: session.userId,
      courseId: course.id,
      lastQIndex: lastQIndex ?? 0,
      lastRound: lastRound ?? 0,
      lastMock: lastMock ?? 0,
      curStepKey: typeof curStepKey === "string" ? curStepKey : "",
      curStepPct: typeof curStepPct === "number" ? curStepPct : 0,
    },
    update: {
      lastQIndex: lastQIndex ?? undefined,
      lastRound: lastRound ?? undefined,
      lastMock: lastMock ?? undefined,
      curStepKey: typeof curStepKey === "string" ? curStepKey : undefined,
      curStepPct: typeof curStepPct === "number" ? curStepPct : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
