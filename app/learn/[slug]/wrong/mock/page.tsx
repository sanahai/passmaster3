import { redirect } from "next/navigation";
import Link from "next/link";
import { requireEnrollment, getOrCreateProgress } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions, ROUND_SEED } from "@/lib/quiz";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";

const MOCK_SOURCES = ["mock1", "mock2", "mock3", "mock4", "mock5", "mock6"];

export default async function WrongMockPage({
  params,
}: {
  params: { slug: string };
}) {
  const { session, course, isAdmin } = await requireEnrollment(params.slug);
  const progress = await getOrCreateProgress(session.userId, course.id);
  if (!isAdmin && progress.mockDone < 6) redirect(`/learn/${params.slug}`);

  const notes = await prisma.wrongNote.findMany({
    where: {
      userId: session.userId,
      source: { in: MOCK_SOURCES },
      isResolved: false,
      question: { courseId: course.id },
    },
    select: { questionId: true },
  });
  const ids = Array.from(new Set(notes.map((nNote) => nNote.questionId)));

  if (ids.length === 0) {
    // 복습할 오답이 없으면 즉시 전체 학습 완료 처리
    await prisma.learningProgress.update({
      where: { userId_courseId: { userId: session.userId, courseId: course.id } },
      data: { wrongMockDone: true },
    });
    return (
      <QuizShell exitHref={`/learn/${params.slug}`}>
        <div className="card mx-auto max-w-md text-center">
          <div className="mb-3 text-5xl">🏆</div>
          <h1 className="mb-2 text-xl font-bold text-beauty-neutral">모든 학습을 완료했습니다!</h1>
          <p className="mb-6 text-beauty-gray">복습할 오답이 없습니다. 합격을 진심으로 축하드려요!</p>
          <Link href={`/dashboard`} className="btn-primary">대시보드로 이동</Link>
        </div>
      </QuizShell>
    );
  }

  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    orderBy: [{ subject: "asc" }, { id: "asc" }],
  });
  const quiz = buildQuizQuestions(questions, ROUND_SEED.wrong_mock);

  return (
    <QuizShell exitHref={`/learn/${params.slug}`}>
      <QuizRunner
        questions={quiz}
        sessionType="wrong_mock"
        courseSlug={course.slug}
        timerSeconds={40}
        revealMode={false}
        resultPath={`/learn/${params.slug}/wrong/mock/result`}
        title="🏁 최종 오답복습 ②"
      />
    </QuizShell>
  );
}
