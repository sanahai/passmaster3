"use client";

// PASSmaster — Hero (D안) + AI 해설 차별점 섹션
// Tailwind CSS 기준. 기존 프로젝트의 rose/pink 계열 색상을 사용합니다.

import { useState } from "react";

/* ─────────────────────────────────────────────
   1. HERO 섹션 (D안: AI 해설 차별점 강조형)
   ───────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* 좌측: 카피 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-700">
            💄 미용사 자격증 필기 합격 플랫폼
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            왜 틀렸는지까지
            <br />
            <span className="text-rose-600">짚어주는</span> 미용사 필기
            <br />
            문제은행
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            정답만 알려주는 해설은 끝. AI가 당신이{" "}
            <strong className="font-semibold text-gray-900">
              ‘왜 그 오답을 골랐는지’
            </strong>
            까지 진단합니다. 같은 실수를 반복하지 않으니 합격이 빨라집니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
            >
              무료체험 시작하기
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              로그인
            </a>
          </div>

          {/* 신뢰 배지 */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> 신용카드 없이 무료 시작
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> 100문제 무제한
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon /> 7일 환불보장
            </span>
          </div>
        </div>

        {/* 우측: AI 해설 미리보기 카드 (제품을 직접 보여줌) */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-rose-200/40 to-pink-100/30 blur-2xl" />
          <AIExplanationPreview />
        </div>
      </div>

      {/* 하단 통계 바 */}
      <div className="border-t border-rose-100 bg-white/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-8 sm:grid-cols-4">
          <Stat value="2,448+" label="기출·예상 문제" />
          <Stat value="6회" label="실전 모의고사" />
          <Stat value="3단계" label="반복학습" />
          <Stat value="합격률 ↑" label="오답복습 시스템" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-rose-600">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-rose-500"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   2. AI 해설 미리보기 카드 (히어로 우측에 들어감)
   ───────────────────────────────────────────── */
function AIExplanationPreview() {
  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
      {/* 문제 영역 */}
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        미용사(피부) · 화장품학
      </p>
      <p className="mt-2 font-medium leading-relaxed text-gray-900">
        Q. 자외선 차단지수(SPF)가 나타내는 것은?
      </p>

      <div className="mt-4 space-y-2 text-sm">
        <Choice label="① UVA 차단 효과" />
        <Choice label="② UVB 차단 효과" correct />
        <Choice label="③ 적외선 차단 효과" wrong picked />
        <Choice label="④ 가시광선 차단 효과" />
      </div>

      {/* AI 해설 */}
      <div className="mt-5 rounded-xl bg-rose-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
          <span>🤖</span> AI 오개념 진단
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          ③을 고르셨네요. SPF는{" "}
          <strong className="text-gray-900">UVB(자외선 B) 차단 지수</strong>입니다.
          많은 분들이 ‘자외선=피부 노화=적외선’으로 혼동해 ③을 선택합니다.
          <br />
          <span className="mt-1 inline-block font-medium text-rose-700">
            👉 ‘B = Burn(화상) = SPF’로 묶어 외우세요.
          </span>
        </p>
      </div>
    </div>
  );
}

function Choice({ label, correct, wrong, picked }) {
  let style = "border-gray-200 text-gray-600";
  if (correct) style = "border-green-300 bg-green-50 text-green-800";
  if (wrong && picked) style = "border-rose-300 bg-rose-50 text-rose-700";
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 ${style}`}
    >
      <span>{label}</span>
      {correct && <span className="text-xs font-semibold">정답</span>}
      {wrong && picked && <span className="text-xs font-semibold">내 선택</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. AI 해설 차별점 전용 섹션
   (히어로와 학습 플로우 사이에 배치)
   ───────────────────────────────────────────── */
export function AIExplanationSection() {
  const examples = [
    {
      subject: "미용사(피부) · 화장품학",
      question: "자외선 차단지수(SPF)가 나타내는 것은?",
      picked: "③ 적외선 차단 효과",
      answer: "② UVB 차단 효과",
      diagnosis:
        "‘자외선=노화=적외선’으로 혼동하는 대표적 오개념입니다. ‘B = Burn(화상) = SPF’로 묶어 외우세요.",
    },
    {
      subject: "미용사(일반) · 소독학",
      question: "고압증기멸균법에 가장 적합한 대상은?",
      picked: "③ 플라스틱 제품",
      answer: "① 금속·유리 기구",
      diagnosis:
        "고온·고압을 견디지 못하는 재질을 고르는 실수입니다. ‘열에 강한 금속·유리 = 고압증기’로 연결하세요.",
    },
    {
      subject: "미용사(네일) · 공중보건학",
      question: "이·미용업소의 조명 기준으로 옳은 것은?",
      picked: "② 50럭스 이상",
      answer: "③ 75럭스 이상",
      diagnosis:
        "숫자 기준을 헷갈리는 단순 암기 오류입니다. ‘작업면 75럭스’를 시각 작업 기준으로 함께 외우세요.",
    },
    {
      subject: "미용사(메이크업) · 색채학",
      question: "보색 대비에 대한 설명으로 옳은 것은?",
      picked: "② 비슷한 색을 나란히 두면 더 선명해진다",
      answer: "① 색상환에서 마주보는 색을 배치하면 서로 돋보인다",
      diagnosis:
        "‘대비 = 비슷한 색’으로 혼동하는 오개념입니다. 보색은 색상환에서 정반대(마주보는) 색으로, 함께 배치하면 서로를 더 선명하게 만듭니다.",
    },
    {
      subject: "이용사 · 이용이론",
      question: "면도 시 사용하는 기구로 옳은 것은?",
      picked: "③ 전기면도기(닫힌 칼날)",
      answer: "① 면도용 스트레이트 레이저",
      diagnosis:
        "전기면도기와 면도용 레이저는 구조·용도가 다릅니다. ‘손 면도 = 스트레이트 레이저, 기계 면도 = 전기면도기’로 구분해 외우세요.",
    },
  ];

  const [active, setActive] = useState(0);
  const ex = examples[active];

  return (
    <section id="ai-explanation" className="scroll-mt-24 bg-gradient-to-b from-white to-rose-50/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* 헤더 */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            틀린 이유까지 진단하는{" "}
            <span className="text-rose-600">AI 해설</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            대부분의 문제집은 “정답은 ②번, 왜냐하면…”에서 끝납니다.
            PASSmaster는 당신이 고른 오답이 ‘왜’ 매력적이었는지,
            어떤 개념을 헷갈렸는지까지 짚어줍니다.
          </p>
        </div>

        {/* 비교 표 */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold text-gray-400">일반 문제집</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <CompareItem text="정답 번호만 알려줌" muted />
              <CompareItem text="왜 틀렸는지는 알 수 없음" muted />
              <CompareItem text="같은 유형을 또 틀림" muted />
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-rose-300 bg-white p-6 shadow-lg shadow-rose-100">
            <p className="text-sm font-semibold text-rose-600">PASSmaster</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-800">
              <CompareItem text="정답 + 왜 맞는지 해설" />
              <CompareItem text="내가 고른 오답의 오개념 진단" />
              <CompareItem text="약점 자동 분석으로 실수 차단" />
            </ul>
          </div>
        </div>

        {/* 실제 예시 (탭) */}
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((e, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active === i
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {e.subject.split(" · ")[0]}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {ex.subject}
            </p>
            <p className="mt-2 font-medium text-gray-900">Q. {ex.question}</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-rose-700">
                <span>{ex.picked}</span>
                <span className="text-xs font-semibold">내 선택</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-green-800">
                <span>{ex.answer}</span>
                <span className="text-xs font-semibold">정답</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-rose-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
                <span>🤖</span> AI 오개념 진단
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {ex.diagnosis}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
          >
            무료체험에서 AI 해설 직접 확인하기
          </a>
        </div>
      </div>
    </section>
  );
}

function CompareItem({ text, muted }) {
  return (
    <li className="flex items-start gap-2">
      <span className={muted ? "text-gray-300" : "text-rose-500"}>
        {muted ? "✕" : "✓"}
      </span>
      <span>{text}</span>
    </li>
  );
}
