import { redirect, notFound } from "next/navigation";
import { requireEnrollment, getOrCreateProgress } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions, ROUND_SEED } from "@/lib/quiz";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";
import type { SessionType } from "@/lib/types";

const ROUND_CONFIG: Record<
  number,
  { timer: number | null; reveal: boolean; title: string; session: SessionType }
> = {
  1: { timer: null, reveal: true, title: "📖 1회차 반복학습 (읽기·이해)", session: "round1" },
  2: { timer: 50, reveal: false, title: "⏱️ 2회차 반복학습 (50초)", session: "round2" },
  3: { timer: 40, reveal: false, title: "🔥 3회차 반복학습 (40초)", session: "round3" },
};

export default async function RoundPage({
  params,
}: {
  params: { slug: string; n: string };
}) {
  const n = Number(params.n);
  const config = ROUND_CONFIG[n];
  if (!config) notFound();

  const { session, course, isAdmin } = await requireEnrollment(params.slug);
  const progress = await getOrCreateProgress(session.userId, course.id);

  // 잠금 해제 검증 (관리자는 선행학습 없이 접근 가능)
  if (!isAdmin) {
    if (n === 2 && !progress.round1Done) redirect(`/learn/${params.slug}`);
    if (n === 3 && !progress.round2Done) redirect(`/learn/${params.slug}`);
  }

  const questions = await prisma.question.findMany({
    where: { courseId: course.id, isActive: true },
    orderBy: [{ subject: "asc" }, { id: "asc" }],
  });

  const seed = ROUND_SEED[config.session] ?? n;
  const quiz = buildQuizQuestions(questions, seed);

  return (
    <QuizShell exitHref={`/learn/${params.slug}`}>
      <QuizRunner
        questions={quiz}
        sessionType={config.session}
        courseSlug={course.slug}
        timerSeconds={config.timer}
        revealMode={config.reveal}
        resultPath={`/learn/${params.slug}/round/${n}/result`}
        title={config.title}
      />
    </QuizShell>
  );
}
