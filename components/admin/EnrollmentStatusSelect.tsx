"use client";

import { useRef } from "react";
import { setEnrollmentStatusAction } from "@/app/actions/admin";

const OPTIONS = [
  { value: "pending", label: "입금대기중" },
  { value: "active", label: "결제완료" },
  { value: "expired", label: "만료" },
  { value: "cancelled", label: "취소" },
];

export default function EnrollmentStatusSelect({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  // 'paid' 등 과거 값은 결제완료(active)로 표시
  const current = OPTIONS.some((o) => o.value === status) ? status : "active";

  return (
    <form ref={formRef} action={setEnrollmentStatusAction}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={current}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-btn border border-gray-300 px-2 py-1.5 text-xs font-semibold text-beauty-neutral focus:border-primary focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}
