// 오답분석(misconception_map)의 단일 오답 항목 타입
type Misconception = {
  concept_gap?: string;
  correct_concept?: string;
  remediation_tip?: string;
  remediation_topic?: string;
};

// 문제의 ai_analysis 전체 타입
export type AiAnalysis = {
  key_concept?: string;
  study_reference?: string;
  learning_objective?: string;
  misconception_map?: Record<string, Misconception>;
};

export default function ExplanationBox({
  explanation,
  isCorrect,
  aiAnalysis,
  selected, // 사용자가 고른 보기 번호(originalIndex, 1~4). 미응답 시 null.
}: {
  explanation: string | null;
  isCorrect: boolean | null;
  aiAnalysis?: AiAnalysis | null;
  selected?: number | null;
}) {
  // 사용자가 틀렸을 때, 고른 오답에 대한 맞춤 분석을 꺼낸다.
  const wrongPick =
    isCorrect === false && selected != null
      ? aiAnalysis?.misconception_map?.[String(selected)]
      : undefined;

  return (
    <div className="animate-fade-in space-y-3">
      {/* 정답/오답 배지 + 전체 해설 */}
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
        <p className="text-sm font-semibold text-primary">해설</p>
        <p className="mt-1 text-sm leading-relaxed text-beauty-neutral">
          {explanation || "해설이 등록되지 않은 문제입니다."}
        </p>
      </div>

      {/* ★ AI 오답분석 — 틀린 경우에만, 고른 오답에 대한 맞춤 분석 */}
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

      {/* 복습 영역 안내(있으면) — 정답/오답 무관하게 표시 */}
      {aiAnalysis?.study_reference && (
        <p className="px-1 text-xs text-beauty-gray">
          📚 복습 영역: {aiAnalysis.study_reference}
        </p>
      )}
    </div>
  );
}
