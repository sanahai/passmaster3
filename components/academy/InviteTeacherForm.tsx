"use client";

import { useState } from "react";
import { inviteTeacherAction } from "@/app/actions/academy";

export default function InviteTeacherForm() {
  const [result, setResult] = useState<{ setupUrl?: string; error?: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    const res = await inviteTeacherAction(formData);
    setResult(res ?? { error: "초대 링크를 생성했습니다." });
    setPending(false);
  }

  return (
    <div>
      <form action={handleSubmit} className="flex gap-2">
        <input
          name="email"
          type="email"
          placeholder="강사 이메일"
          className="flex-1 rounded-lg border border-b2b-border px-4 py-2 text-sm"
          required
        />
        <button type="submit" disabled={pending} className="b2b-btn-accent shrink-0">
          {pending ? "생성 중..." : "초대 링크 생성"}
        </button>
      </form>
      {result?.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
      {result?.setupUrl && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm">
          <p className="font-semibold text-emerald-800">초대 링크 (48시간 유효)</p>
          <code className="mt-1 block break-all text-emerald-700">{result.setupUrl}</code>
        </div>
      )}
    </div>
  );
}
