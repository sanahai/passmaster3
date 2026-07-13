import QuizShell from "@/components/QuizShell";
import ResultView from "@/components/quiz/ResultView";
import { requireTrialSession } from "@/lib/trial-access";

export default async function TrialResultPage() {
  await requireTrialSession("/trial");
  return (
    <QuizShell exitHref="/dashboard">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-beauty-neutral">
          무료체험 결과
        </h1>
        <ResultView homeHref="/enroll" ctaEnroll />
      </div>
    </QuizShell>
  );
}
