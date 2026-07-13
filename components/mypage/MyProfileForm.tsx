"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfileAction } from "@/app/actions/profile";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-8">
      {pending ? "저장 중..." : "저장하기"}
    </button>
  );
}

export default function MyProfileForm({
  name,
  email,
  phone,
  createdAt,
}: {
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}) {
  const [state, formAction] = useFormState(updateProfileAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="profile-name">
            이름
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            className="input"
            defaultValue={name}
            required
            maxLength={40}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="profile-email">
            이메일
          </label>
          <input
            id="profile-email"
            type="email"
            className="input bg-gray-50 text-beauty-gray"
            value={email}
            readOnly
            disabled
          />
          <p className="mt-1 text-xs text-beauty-gray">이메일은 로그인 계정이라 여기서는 변경할 수 없습니다.</p>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="profile-phone">
            연락처
          </label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            className="input"
            defaultValue={phone || ""}
            placeholder="010-0000-0000"
          />
        </div>
        <div>
          <label className="label">가입일</label>
          <input
            type="text"
            className="input bg-gray-50 text-beauty-gray"
            value={createdAt}
            readOnly
            disabled
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-btn bg-red-50 px-4 py-2 text-sm text-beauty-danger">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-btn bg-primary-pale px-4 py-2 text-sm font-semibold text-primary">
          {state.success}
        </p>
      )}

      <div className="flex justify-end border-t border-gray-100 pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
