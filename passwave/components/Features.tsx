const FEATURES = [
  {
    title: "AI 오개념 진단",
    desc: "정답 번호만 알려주는 문제집과 달리, 내가 고른 오답이 왜 매력적이었는지 AI가 짚어줍니다. 같은 실수를 반복하지 않도록 돕습니다.",
  },
  {
    title: "최신 출제기준 반영",
    desc: "시험 범위·법령 개정이 반영되면 문제은행도 즉시 업데이트됩니다. 낡은 기출에 의존하지 않아도 됩니다.",
  },
  {
    title: "반복학습 · 모의고사",
    desc: "3회차 반복학습으로 암기가 아닌 이해를 돕고, 실전 비율을 반영한 모의고사로 시험 직전까지 점검할 수 있습니다.",
  },
  {
    title: "오답노트 자동 관리",
    desc: "틀린 문제만 모아 다시 풀 수 있습니다. 취약 과목·단원을 한눈에 파악하고 집중 복습할 수 있습니다.",
  },
  {
    title: "모바일 최적화",
    desc: "PC·스마트폰·태블릿 어디서든 동일한 학습 경험을 제공합니다. 출퇴근·점심시간 등 자투리 시간에 학습하세요.",
  },
  {
    title: "검증된 문항 품질",
    desc: "난이도·정답 분포·출제 비율을 고려해 설계된 문항으로, 실제 필기 시험에 가까운 학습 환경을 제공합니다.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-gradient-to-b from-brand-light/40 to-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand md:text-base">Why PASSWAVE</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-4xl">PASSWAVE가 제공하는 학습 경험</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            PASSWAVE는 자격증 분야별 전문 AI 문제은행을 하나의 허브로 연결합니다.
            합격에 필요한 문제 풀이, 오개념 분석, 반복 학습까지 — 한 곳에서 시작하세요.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-card md:p-10"
            >
              <div className="mb-5 h-1.5 w-12 rounded-full bg-brand" />
              <h3 className="text-lg font-bold text-slate-900 md:text-xl">{f.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
