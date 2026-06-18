import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    questionId,
    sessionType,
    selected,
    isCorrect,
    timeSpent,
    shuffledOrder,
    mockNumber,
  } = body as {
    questionId: number;
    sessionType: string;
    selected: number | null;
    isCorrect: boolean;
    timeSpent?: number;
    shuffledOrder?: string;
    mockNumber?: number;
  };

  await prisma.userAnswer.create({
    data: {
      userId: session.userId,
      questionId,
      sessionType,
      selected: selected ?? null,
      isCorrect,
      timeSpent: timeSpent ?? null,
      shuffledOrder: shuffledOrder ?? null,
      sessionId: mockNumber ?? null,
    },
  });

  await prisma.user.update({
    where: { id: session.userId },
    data: { lastActiveAt: new Date() },
  });

  // 오답 노트 기록 (2·3회차, 모의고사)
  let wrongSource: string | null = null;
  if (sessionType === "round2") wrongSource = "round2";
  else if (sessionType === "round3") wrongSource = "round3";
  else if (sessionType === "mock" && mockNumber) wrongSource = `mock${mockNumber}`;

  if (wrongSource && !isCorrect) {
    await prisma.wrongNote.upsert({
      where: {
        userId_questionId_source: {
          userId: session.userId,
          questionId,
          source: wrongSource,
        },
      },
      create: {
        userId: session.userId,
        questionId,
        source: wrongSource,
        wrongCount: 1,
        lastWrongAt: new Date(),
        isResolved: false,
      },
      update: {
        wrongCount: { increment: 1 },
        lastWrongAt: new Date(),
        isResolved: false,
      },
    });
  }

  // 오답복습에서 정답 → 해결 처리
  if (isCorrect && (sessionType === "wrong_round" || sessionType === "wrong_mock")) {
    const sources =
      sessionType === "wrong_round"
        ? ["round2", "round3"]
        : ["mock1", "mock2", "mock3", "mock4", "mock5", "mock6"];
    await prisma.wrongNote.updateMany({
      where: { userId: session.userId, questionId, source: { in: sources } },
      data: { isResolved: true },
    });
  }

  return NextResponse.json({ ok: true });
}
