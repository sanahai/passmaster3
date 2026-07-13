import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions } from "@/lib/quiz";
import { hasCompletedTrial } from "@/lib/trial";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";
import TrialConsentGate from "@/components/consent/TrialConsentGate";

export const dynamic = "force-dynamic";

export default async function TrialCoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await requireSession(`/trial/${params.slug}`);

  const course = await prisma.course.findUnique({ where: { slug: params.slug } });
  if (!course) redirect("/trial");

  if (await hasCompletedTrial(session.userId, course.id)) {
    return (
      <QuizShell exitHref="/trial">
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mb-3 text-4xl">✅</div>
          <h1 className="mb-2 text-xl font-bold text-beauty-neutral">
            이미 무료체험을 완료한 과정입니다
          </h1>
          <p className="mb-6 text-beauty-gray">
            {course.name} 무료체험은 과정당 1회만 이용할 수 있습니다. 정식 수강을 신청해 주세요.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/enroll" className="btn-primary">
              수강신청하기
            </Link>
            <Link href="/trial" className="btn-outline">
              다른 과정 체험
            </Link>
          </div>
        </div>
      </QuizShell>
    );
  }

  // 무료체험 동의 기록 확인 (과정별로 동의 여부를 확인)
  const consent = await prisma.userConsent.findFirst({
    where: { userId: session.userId, consentMode: "trial", examCategory: course.slug },
  });

  const questions = await prisma.question.findMany({
    where: { courseId: course.id, isFree: true, isActive: true },
    take: 100,
    orderBy: { id: "asc" },
  });

  if (questions.length === 0) {
    return (
      <QuizShell exitHref="/trial">
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mb-3 text-4xl">🚧</div>
          <h1 className="mb-2 text-xl font-bold text-beauty-neutral">
            {course.name} 무료체험 준비 중
          </h1>
          <p className="mb-6 text-beauty-gray">아직 이 과정의 무료 체험 문제가 없습니다.</p>
          <Link href="/trial" className="btn-primary">다른 과정 선택</Link>
        </div>
      </QuizShell>
    );
  }

  const quiz = buildQuizQuestions(questions, 0);

  return (
    <QuizShell exitHref="/trial">
      <TrialConsentGate needsConsent={!consent} examCategory={course.slug}>
        <QuizRunner
          questions={quiz}
          sessionType="trial"
          courseSlug={course.slug}
          timerSeconds={null}
          revealMode={false}
          resultPath="/trial/result"
          title={`🎁 무료체험 · ${course.name}`}
          callComplete
        />
      </TrialConsentGate>
    </QuizShell>
  );
}
