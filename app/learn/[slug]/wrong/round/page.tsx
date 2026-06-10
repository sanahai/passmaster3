import { redirect } from "next/navigation";
import Link from "next/link";
import { requireEnrollment, getOrCreateProgress } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions, ROUND_SEED } from "@/lib/quiz";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";

export default async function WrongRoundPage({
  params,
}: {
  params: { slug: string };
}) {
  const { session, course, isAdmin } = await requireEnrollment(params.slug);
  const progress = await getOrCreateProgress(session.userId, course.id);
  if (!isAdmin && !progress.round3Done) redirect(`/learn/${params.slug}`);

  const notes = await prisma.wrongNote.findMany({
    where: {
      userId: session.userId,
      source: { in: ["round2", "round3"] },
      isResolved: false,
      question: { courseId: course.id },
    },
    select: { questionId: true },
  });
  const ids = Array.from(new Set(notes.map((nNote) => nNote.questionId)));

  if (ids.length === 0) {
    return (
      <QuizShell exitHref={`/learn/${params.slug}`}>
        <div className="card mx-auto max-w-md text-center">
          <div className="mb-3 text-5xl">🎉</div>
          <h1 className="mb-2 text-xl font-bold text-beauty-neutral">복습할 오답이 없습니다!</h1>
          <p className="mb-6 text-beauty-gray">2·3회차에서 틀린 문제가 없습니다. 바로 모의고사로 진행하세요.</p>
          <Link href={`/learn/${params.slug}/mock/1`} className="btn-primary">모의고사 1회 응시</Link>
        </div>
      </QuizShell>
    );
  }

  const questions = await prisma.question.findMany({
    where: { id: { in: ids } },
    orderBy: [{ subject: "asc" }, { id: "asc" }],
  });
  const quiz = buildQuizQuestions(questions, ROUND_SEED.wrong_round);

  return (
    <QuizShell exitHref={`/learn/${params.slug}`}>
      <QuizRunner
        questions={quiz}
        sessionType="wrong_round"
        courseSlug={course.slug}
        timerSeconds={40}
        revealMode={false}
        resultPath={`/learn/${params.slug}/wrong/round/result`}
        title="🔁 최종 오답복습 ①"
      />
    </QuizShell>
  );
}
