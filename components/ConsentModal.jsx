"use client";

// BEAUTYmaster — 학습 시작 전 안내·동의 컴포넌트
// 무료체험(mode="trial")과 유료결제(mode="paid") 두 가지를 지원합니다.
// 모든 필수 항목 체크 시에만 "다음" 버튼이 활성화됩니다.

import { useState, useMemo } from "react";

/* 동의 항목 정의 — 모드별로 노출 항목이 다릅니다 */
const TRIAL_ITEMS = [
  {
    id: "official",
    label: "공식 기출문제가 아닌 AI 재구성 학습 문항임을 확인했습니다.",
  },
  {
    id: "noimage",
    label: "이미지·그림 기반 문항은 제공되지 않음을 확인했습니다.",
  },
];

const PAID_ITEMS = [
  {
    id: "official",
    label: "공식 기출문제가 아닌 AI 재구성 학습 문항임을 확인했습니다.",
  },
  {
    id: "noimage",
    label: "이미지·그림 기반 문항은 제공되지 않음을 확인했습니다.",
  },
  {
    id: "noguarantee",
    label: "합격을 보장하지 않는 보조 학습 자료임을 확인했습니다.",
  },
  {
    id: "refund",
    label:
      "결제 후 학습(문제 풀이)을 시작하면 디지털콘텐츠 제공 개시로 간주되어 환불이 제한될 수 있음을 확인했습니다.",
  },
];

export default function ConsentModal({ mode = "trial", onAgree, onCancel, submitting = false }) {
  const items = mode === "paid" ? PAID_ITEMS : TRIAL_ITEMS;
  const [checked, setChecked] = useState({});

  const allChecked = useMemo(
    () => items.every((it) => checked[it.id]),
    [items, checked]
  );

  const toggle = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAll = () => {
    if (allChecked) setChecked({});
    else setChecked(Object.fromEntries(items.map((it) => [it.id, true])));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            학습 시작 전 꼭 확인해 주세요
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {mode === "paid"
              ? "결제 진행 전, 아래 내용을 확인하고 동의해 주세요."
              : "무료체험 시작 전, 아래 내용을 확인해 주세요."}
          </p>
        </div>

        {/* 본문 — 안내 텍스트 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <InfoBlock
            icon="📋"
            title="문제·학습 자료 안내"
            body="본 서비스는 큐넷(Q-Net)·한국산업인력공단 또는 자격시험 시행기관과 제휴·운영 관계가 없는 민간 학습 서비스입니다. 제공되는 문제는 공개된 출제 경향·과목 구성·시험 범위를 참고하여 AI로 재구성한 학습용 예상·복습 문항이며, 기관이 배포하는 정식 기출문제 원문이 아닙니다."
          />

          <InfoBlock
            icon="🖼️"
            title="이미지 문항 미제공"
            body="본 서비스의 문항은 텍스트 기반으로 제공됩니다. 그림·사진·도표 등 이미지를 보고 푸는 유형의 문항은 제공되지 않습니다. 실제 시험에는 이미지 문항이 출제될 수 있으므로, 해당 유형은 별도 자료로 보완 학습하시기를 권장합니다."
          />

          <InfoBlock
            icon="⚠️"
            title="학습 보조 목적 · 합격 비보장"
            body="제공 문항은 학습 보조 목적이며 합격을 보장하지 않습니다. 출제 범위·방식·법령·기준 개정 등에 따라 실제 시험과 차이가 날 수 있습니다. 시험 접수·출제기준·일정·합격 기준 등 공식 정보는 반드시 큐넷(Q-Net) 또는 해당 시행기관의 공지를 확인해 주세요."
          />

          {mode === "paid" && (
            <InfoBlock
              icon="💳"
              title="환불 안내"
              body="결제 후 학습 기록(문제 풀이)이 전혀 없는 경우, 결제일로부터 7일 이내 전액 환불이 가능합니다. 다만 단 1문항이라도 풀이를 시작하면 디지털콘텐츠 제공이 개시된 것으로 보아 환불이 제한될 수 있습니다. 결제 전 무료체험 100문제로 충분히 확인하시기를 권장합니다. (문의: support@beautymaster.kr)"
              highlight
            />
          )}

          {/* 체크 영역 */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-center gap-3 border-b border-gray-200 pb-3">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="h-5 w-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm font-semibold text-gray-900">
                아래 내용을 모두 확인했습니다
              </span>
            </label>

            <div className="mt-3 space-y-3">
              {items.map((it) => (
                <label
                  key={it.id}
                  className="flex cursor-pointer items-start gap-3"
                >
                  <input
                    type="checkbox"
                    checked={!!checked[it.id]}
                    onChange={() => toggle(it.id)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm leading-relaxed text-gray-700">
                    {it.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 푸터 — 버튼 */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            취소
          </button>
          <button
            onClick={onAgree}
            disabled={!allChecked || submitting}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
              allChecked && !submitting
                ? "bg-rose-600 hover:bg-rose-700"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            {submitting
              ? "처리 중..."
              : mode === "paid"
              ? "동의하고 결제하기"
              : "동의하고 시작하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, title, body, highlight }) {
  return (
    <div
      className={`mt-4 rounded-xl p-4 first:mt-0 ${
        highlight
          ? "border border-rose-200 bg-rose-50"
          : "border border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <span>{icon}</span>
        <span className="text-sm">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}
