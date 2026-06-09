"use client";

import { useState } from "react";
import { submitReportAction } from "@/app/actions/report";

const CATEGORIES = [
  { value: "question", label: "문제(지문) 오류" },
  { value: "option", label: "선택지 오류" },
  { value: "answer", label: "정답 오류" },
  { value: "explanation", label: "해설 오류" },
  { value: "other", label: "기타" },
];

export default function ReportButton({ questionId }: { questionId: number }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("question");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategory("question");
    setDetail("");
    setDone(false);
    setError(null);
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = async () => {
    if (!detail.trim()) {
      setError("오류 내용을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitReportAction(questionId, category, detail);
      if (res.ok) setDone(true);
      else setError(res.error || "신고에 실패했습니다.");
    } catch {
      setError("신고 처리 중 오류가 발생했습니다.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-btn px-2 py-1 text-xs font-semibold text-beauty-gray transition hover:bg-primary-pale hover:text-primary"
        title="이 문제의 오류 신고"
        aria-label="오류 신고"
      >
        🚩 오류 신고
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-base font-bold text-beauty-neutral">🚩 오류 신고</h3>
              <p className="mt-0.5 text-xs text-beauty-gray">
                문제·선택지·정답·해설의 오류나 잘못된 내용을 알려주세요.
              </p>
            </div>

            {done ? (
              <div className="px-5 py-8 text-center">
                <div className="mb-2 text-4xl">✅</div>
                <p className="font-semibold text-beauty-neutral">신고가 접수되었습니다.</p>
                <p className="mt-1 text-sm text-beauty-gray">검토 후 빠르게 반영하겠습니다.</p>
                <button onClick={close} className="btn-primary mt-5 w-full">
                  닫기
                </button>
              </div>
            ) : (
              <div className="space-y-4 px-5 py-4">
                <div>
                  <label className="label">오류 유형</label>
                  <select
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">상세 내용</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="예) 정답이 2번이 아니라 3번인 것 같습니다."
                  />
                </div>
                {error && <p className="text-sm font-semibold text-beauty-danger">{error}</p>}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={close}
                    disabled={submitting}
                    className="flex-1 rounded-btn border border-gray-300 px-4 py-2.5 text-sm font-semibold text-beauty-gray hover:bg-gray-50 disabled:opacity-60"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary flex-1"
                  >
                    {submitting ? "접수 중..." : "신고하기"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
