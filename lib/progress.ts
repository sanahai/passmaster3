export type ProgressLike = {
  round1Done: boolean;
  round2Done: boolean;
  round3Done: boolean;
  wrongRoundDone: boolean;
  mockDone: number;
  wrongMockDone: boolean;
} | null;

export type StepKey =
  | "round1"
  | "round2"
  | "round3"
  | "wrong_round"
  | "mock1"
  | "mock2"
  | "mock3"
  | "mock4"
  | "mock5"
  | "mock6"
  | "wrong_mock";

export type StepState = "done" | "current" | "locked";

export type Step = {
  key: StepKey;
  label: string;
  desc: string;
  icon: string;
  href: string;
  state: StepState;
};

// 전체 11단계 진행 상태 계산 + 잠금 해제 로직
// isAdmin=true 이면 선행학습 완료 여부와 무관하게 모든 단계 접근 가능(검토용).
export function computeSteps(slug: string, p: ProgressLike, isAdmin = false): Step[] {
  const round1 = !!p?.round1Done;
  const round2 = !!p?.round2Done;
  const round3 = !!p?.round3Done;
  const wrongRound = !!p?.wrongRoundDone;
  const mockDone = p?.mockDone ?? 0;
  const wrongMock = !!p?.wrongMockDone;

  const base = `/learn/${slug}`;
  const raw: Omit<Step, "state">[] = [
    { key: "round1", label: "1회차 반복학습", desc: "읽기·이해 모드 (타이머 없음)", icon: "📖", href: `${base}/round/1` },
    { key: "round2", label: "2회차 반복학습", desc: "타이머 50초 · 즉시 피드백", icon: "⏱️", href: `${base}/round/2` },
    { key: "round3", label: "3회차 반복학습", desc: "타이머 40초 · 실전 압박", icon: "🔥", href: `${base}/round/3` },
    { key: "wrong_round", label: "최종 오답복습 ①", desc: "2·3회차 오답 집중 복습", icon: "🔁", href: `${base}/wrong/round` },
    { key: "mock1", label: "모의고사 1회 (쉬움)", desc: "심리적 부담 최소화", icon: "📝", href: `${base}/mock/1` },
    { key: "mock2", label: "모의고사 2회 (보통)", desc: "표준 난이도", icon: "📝", href: `${base}/mock/2` },
    { key: "mock3", label: "모의고사 3회 (어려움)", desc: "고난이도 집중", icon: "📝", href: `${base}/mock/3` },
    { key: "mock4", label: "모의고사 4회 (실전1)", desc: "실전 비율 적용", icon: "📝", href: `${base}/mock/4` },
    { key: "mock5", label: "모의고사 5회 (실전2)", desc: "실전 비율 적용", icon: "📝", href: `${base}/mock/5` },
    { key: "mock6", label: "모의고사 6회 (실전3)", desc: "최종 실전 대비", icon: "📝", href: `${base}/mock/6` },
    { key: "wrong_mock", label: "최종 오답복습 ②", desc: "모의고사 오답 최종 점검", icon: "🏁", href: `${base}/wrong/mock` },
  ];

  const doneMap: Record<StepKey, boolean> = {
    round1,
    round2,
    round3,
    wrong_round: wrongRound,
    mock1: mockDone >= 1,
    mock2: mockDone >= 2,
    mock3: mockDone >= 3,
    mock4: mockDone >= 4,
    mock5: mockDone >= 5,
    mock6: mockDone >= 6,
    wrong_mock: wrongMock,
  };

  return raw.map((step, i) => {
    const done = doneMap[step.key];
    // 직전 단계 완료 여부로 잠금 판단 (순차적 잠금 해제). 관리자는 잠금 없음.
    const prevDone = i === 0 ? true : doneMap[raw[i - 1].key];
    const state: StepState = done ? "done" : prevDone || isAdmin ? "current" : "locked";
    return { ...step, state };
  });
}

export function progressPercent(p: ProgressLike): number {
  const steps = computeSteps("x", p);
  const done = steps.filter((s) => s.state === "done").length;
  return Math.round((done / steps.length) * 100);
}

// 회차+모의고사에 해당하는 단계 (복습 제외)
const ROUND_MOCK_KEYS: StepKey[] = [
  "round1",
  "round2",
  "round3",
  "mock1",
  "mock2",
  "mock3",
  "mock4",
  "mock5",
  "mock6",
];

// 전체 진행률(모든 단계) + 회차·모의고사 진행률(복습 제외) 두 막대 계산.
// 진행 중인 단계(curStepKey)의 부분 진행률(curStepPct)도 소수로 반영한다.
export function computeProgressBars(
  slug: string,
  p: ProgressLike,
  curStepKey = "",
  curStepPct = 0
): { overallPct: number; roundMockPct: number } {
  const steps = computeSteps(slug, p);
  const curStep = steps.find((s) => s.key === curStepKey);
  const partial =
    curStep && curStep.state !== "done" && curStepPct > 0
      ? Math.min(1, curStepPct / 100)
      : 0;

  const doneAll = steps.filter((s) => s.state === "done").length;
  const overallPct = Math.min(
    100,
    Math.round(((doneAll + partial) / steps.length) * 100)
  );

  const rmSteps = steps.filter((s) => ROUND_MOCK_KEYS.includes(s.key));
  const doneRM = rmSteps.filter((s) => s.state === "done").length;
  const rmPartial =
    curStep && ROUND_MOCK_KEYS.includes(curStep.key) ? partial : 0;
  const roundMockPct = Math.min(
    100,
    Math.round(((doneRM + rmPartial) / rmSteps.length) * 100)
  );

  return { overallPct, roundMockPct };
}

// 다음에 풀어야 할 단계의 키 반환
export function nextStepKey(slug: string, p: ProgressLike): Step | undefined {
  return computeSteps(slug, p).find((s) => s.state === "current");
}
