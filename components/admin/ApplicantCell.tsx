"use client";

import { useState } from "react";

export type ApplicantInfo = {
  name: string;
  email: string;
  phone: string | null;
  enrollments: { course: string; status: string }[];
  learning: { course: string; pct: number; nextLabel: string | null }[];
};

const STATUS_LABEL: Record<string, string> = {
  pending: "입금대기중",
  active: "결제완료(수강중)",
  paid: "결제완료",
  expired: "만료",
  cancelled: "취소",
};

export default function ApplicantCell({
  email,
  info,
}: {
  email: string;
  info: ApplicantInfo;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-left"
        title="신청자 정보 보기"
      >
        <div className="font-semibold text-primary underline-offset-2 hover:underline">
          {info.name}
        </div>
        <div className="text-xs text-beauty-gray">{email}</div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-base font-bold text-beauty-neutral">신청자 정보</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-beauty-gray hover:text-primary"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-4">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Field label="이름" value={info.name} />
                <Field label="휴대폰" value={info.phone || "미등록"} />
                <Field label="이메일" value={info.email} full />
              </div>

              {/* 수강신청 현황 */}
              <div>
                <p className="mb-2 text-sm font-bold text-beauty-neutral">수강신청 현황</p>
                {info.enrollments.length === 0 ? (
                  <p className="text-sm text-beauty-gray">신청 내역이 없습니다.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {info.enrollments.map((e, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-btn bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span className="text-beauty-neutral">{e.course}</span>
                        <span className="font-semibold text-primary">
                          {STATUS_LABEL[e.status] || e.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 학습 현황 */}
              <div>
                <p className="mb-2 text-sm font-bold text-beauty-neutral">학습 현황</p>
                {info.learning.length === 0 ? (
                  <p className="text-sm text-beauty-gray">진행 중인 학습이 없습니다.</p>
                ) : (
                  <ul className="space-y-2">
                    {info.learning.map((l, i) => (
                      <li key={i}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-beauty-neutral">{l.course}</span>
                          <span className="font-bold text-primary">{l.pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-primary-pale">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${l.pct}%` }}
                          />
                        </div>
                        {l.nextLabel && (
                          <p className="mt-0.5 text-xs text-beauty-gray">다음 단계: {l.nextLabel}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-3 text-right">
              <button onClick={() => setOpen(false)} className="btn-outline px-5 py-2 text-sm">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs text-beauty-gray">{label}</p>
      <p className="font-semibold text-beauty-neutral">{value}</p>
    </div>
  );
}
