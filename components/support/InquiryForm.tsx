"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createInquiryAction } from "@/app/actions/support-inquiry";
import { INQUIRY_CATEGORIES } from "@/lib/support-inquiry";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "접수 중..." : "문의 접수하기"}
    </button>
  );
}

export default function InquiryForm() {
  const [state, formAction] = useFormState(createInquiryAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="inquiry-category">
          문의 유형
        </label>
        <select id="inquiry-category" name="category" className="input" required defaultValue="">
          <option value="" disabled>
            유형을 선택하세요
          </option>
          {INQUIRY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="inquiry-subject">
          제목
        </label>
        <input
          id="inquiry-subject"
          name="subject"
          type="text"
          className="input"
          placeholder="문의 제목을 입력하세요"
          maxLength={100}
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="inquiry-content">
          문의 내용
        </label>
        <textarea
          id="inquiry-content"
          name="content"
          className="input min-h-[160px] resize-y"
          placeholder="결제·수강·학습 관련 내용을 구체적으로 적어 주시면 더 빠르게 도와드릴 수 있습니다."
          maxLength={2000}
          required
        />
      </div>

      {state?.error && (
        <p className="rounded-btn bg-red-50 px-4 py-2 text-sm text-beauty-danger">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-btn bg-primary-pale px-4 py-2 text-sm font-semibold text-primary">
          {state.success}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
