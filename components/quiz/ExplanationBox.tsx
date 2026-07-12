import type { AiAnalysis } from "@/lib/types";

export default function ExplanationBox({
  explanation,
  isCorrect,
  aiAnalysis,
  selected,
  displayAnswer,
}: {
  explanation: string | null;
  isCorrect: boolean | null;
  aiAnalysis?: AiAnalysis | null;
  selected?: number | null;
  /** 셔플된 화면 기준 정답 보기 번호 (1~4) */
  displayAnswer?: number;
}) {
  const wrongPick =
    isCorrect === false && selected != null
      ? aiAnalysis?.misconception_map?.[String(selected)]
      : undefined;

  return (
    <div className="animate-fade-in space-y-3">
      <div className="rounded-card border border-primary-pale bg-primary-pale/30 p-4">
        {isCorrect !== null && (
          <p
            className={`mb-1 font-bold ${
              isCorrect ? "text-beauty-success" : "text-beauty-danger"
            }`}
          >
            {isCorrect ? "✓ 정답입니다!" : "✗ 오답입니다"}
          </p>
        )}
        {displayAnswer != null && (
          <p className="mb-2 text-sm text-beauty-neutral">
            정답 보기: <span className="font-bold text-primary">{displayAnswer}번</span>
          </p>
        )}
        <p className="text-sm font-semibold text-primary">해설</p>
        <p className="mt-1 text-sm leading-relaxed text-beauty-neutral">
          {explanation || "해설이 등록되지 않은 문제입니다."}
        </p>
      </div>

      {wrongPick && (
        <div className="rounded-card border border-beauty-danger/30 bg-[#FFF5F5] p-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-beauty-danger">
            <span>🔍</span> AI 오답분석
          </p>

          {wrongPick.concept_gap && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-beauty-gray">무엇을 놓쳤나요?</p>
              <p className="mt-0.5 text-sm leading-relaxed text-beauty-neutral">
                {wrongPick.concept_gap}
              </p>
            </div>
          )}

          {wrongPick.correct_concept && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-beauty-gray">올바른 개념</p>
              <p className="mt-0.5 text-sm leading-relaxed text-beauty-neutral">
                {wrongPick.correct_concept}
              </p>
            </div>
          )}

          {wrongPick.remediation_tip && (
            <div className="rounded-btn bg-white/70 px-3 py-2">
              <p className="text-xs font-semibold text-primary">💡 학습 조언</p>
              <p className="mt-0.5 text-sm leading-relaxed text-beauty-neutral">
                {wrongPick.remediation_tip}
              </p>
            </div>
          )}
        </div>
      )}

      {aiAnalysis?.study_reference && (
        <p className="px-1 text-xs text-beauty-gray">
          📚 복습 영역: {aiAnalysis.study_reference}
        </p>
      )}
    </div>
  );
}
