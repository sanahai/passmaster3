"use client";

import { useFormState } from "react-dom";
import { completeAcademySetupAction } from "@/app/actions/academy";

export default function AcademySetupForm({ token }: { token: string }) {
  const [state, formAction] = useFormState(completeAcademySetupAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="mb-1 block text-sm font-semibold">이름</label>
        <input name="name" className="w-full rounded-lg border border-b2b-border px-4 py-2.5 text-sm" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">비밀번호</label>
        <input
          name="password"
          type="password"
          className="w-full rounded-lg border border-b2b-border px-4 py-2.5 text-sm"
          placeholder="8자 이상, 숫자 1개 포함"
          required
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button type="submit" className="b2b-btn-accent w-full">
        완료하고 대시보드로
      </button>
    </form>
  );
}
