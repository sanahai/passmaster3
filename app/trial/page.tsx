import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { buildQuizQuestions } from "@/lib/quiz";
import QuizShell from "@/components/QuizShell";
import QuizRunner from "@/components/quiz/QuizRunner";
import TrialConsentGate from "@/components/consent/TrialConsentGate";

export default async function TrialPage() {
  const session = await requireSession("/trial");

  // 이 유저가 무료체험 동의 기록이 있는지 서버에서 조회
  const consent = await prisma.userConsent.findFirst({
    where: { userId: session.userId, consentMode: "trial" },
  });

  const questions = await prisma.question.findMany({
    where: { isFree: true, isActive: true },
    take: 100,
    orderBy: { id: "asc" },
  });

  const quiz = buildQuizQuestions(questions, 0);

  return (
    <QuizShell exitHref="/dashboard">
      <TrialConsentGate needsConsent={!consent}>
        <QuizRunner
          questions={quiz}
          sessionType="trial"
          courseSlug=""
          timerSeconds={null}
          revealMode={false}
          resultPath="/trial/result"
          title="🎁 무료체험"
          callComplete={false}
        />
      </TrialConsentGate>
    </QuizShell>
  );
}
