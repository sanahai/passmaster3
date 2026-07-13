"use client";

import { useFormState, useFormStatus } from "react-dom";
import { replyInquiryAction } from "@/app/actions/admin-inquiry";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-btn bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-light disabled:opacity-50"
    >
      {pending ? "등록 중..." : "답변 등록"}
    </button>
  );
}

export default function InquiryReplyForm({ inquiryId, defaultReply }: { inquiryId: number; defaultReply?: string }) {
  const [state, formAction] = useFormState(replyInquiryAction, undefined);

  return (
    <form action={formAction} className="mt-4 space-y-3 border-t border-gray-100 pt-4">
      <input type="hidden" name="id" value={inquiryId} />
      <label className="label" htmlFor={`reply-${inquiryId}`}>
        관리자 답변
      </label>
      <textarea
        id={`reply-${inquiryId}`}
        name="reply"
        className="input min-h-[120px] resize-y"
        placeholder="회원에게 전달할 답변을 입력하세요."
        maxLength={3000}
        defaultValue={defaultReply}
        required
      />
      {state?.error && (
        <p className="rounded-btn bg-red-50 px-3 py-2 text-sm text-beauty-danger">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-btn bg-primary-pale px-3 py-2 text-sm font-semibold text-primary">{state.success}</p>
      )}
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
