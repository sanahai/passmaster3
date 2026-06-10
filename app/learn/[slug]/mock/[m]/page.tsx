import { redirect, notFound } from "next/navigation";
import { requireEnrollment, getOrCreateProgress } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions } from "@/lib/quiz";
import { generateMockQuestionIds } from "@/lib/mock-generator";
import { MOCK_CONFIG } from "@/lib/courses";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";

export default async function MockPage({
  params,
}: {
  params: { slug: string; m: string };
}) {
  const m = Number(params.m);
  const mockConfig = MOCK_CONFIG[m];
  if (!mockConfig) notFound();

  const { session, course, isAdmin } = await requireEnrollment(params.slug);
  const progress = await getOrCreateProgress(session.userId, course.id);

  // 잠금 해제: 1회차는 오답복습① 완료 후, 이후는 직전 회차 완료 후
  // (관리자는 선행학습 없이 접근 가능)
  if (!isAdmin) {
    if (m === 1 && !progress.wrongRoundDone) redirect(`/learn/${params.slug}`);
    if (m > 1 && progress.mockDone < m - 1) redirect(`/learn/${params.slug}`);
  }

  // 진행 중인(미완료) 모의고사 세션 재사용 또는 신규 생성
  let mockSession = await prisma.mockSession.findFirst({
    where: { userId: session.userId, courseId: course.id, mockNumber: m, completedAt: null },
    orderBy: { id: "desc" },
  });

  let questionIds: number[] = [];
  if (mockSession?.questionIds) {
    questionIds = JSON.parse(mockSession.questionIds);
  } else {
    questionIds = await generateMockQuestionIds(course.id, course.slug, m);
    mockSession = await prisma.mockSession.create({
      data: {
        userId: session.userId,
        courseId: course.id,
        mockNumber: m,
        difficulty: mockConfig.difficulty,
        totalQ: questionIds.length,
        questionIds: JSON.stringify(questionIds),
        startedAt: new Date(),
      },
    });
  }

  const dbQuestions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });
  // 생성된 순서대로 정렬
  const orderMap = new Map(questionIds.map((id, i) => [id, i]));
  dbQuestions.sort((a, b) => (orderMap.get(a.id)! - orderMap.get(b.id)!));

  const quiz = buildQuizQuestions(dbQuestions, 10 + m);

  return (
    <QuizShell exitHref={`/learn/${params.slug}`}>
      <QuizRunner
        questions={quiz}
        sessionType="mock"
        courseSlug={course.slug}
        timerSeconds={40}
        revealMode={false}
        resultPath={`/learn/${params.slug}/mock/${m}/result`}
        title={`📝 모의고사 ${m}회 (${mockConfig.name})`}
        mockNumber={m}
      />
    </QuizShell>
  );
}
