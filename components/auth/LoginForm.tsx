"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import PasswordInput from "./PasswordInput";
import SocialLoginButtons from "./SocialLoginButtons";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "로그인 중..." : "로그인"}
    </button>
  );
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div>
        <label className="label" htmlFor="email">
          이메일
        </label>
        <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          비밀번호
        </label>
        <PasswordInput id="password" name="password" placeholder="비밀번호" required />
      </div>
      <label className="flex items-center gap-2 text-sm text-beauty-gray">
        <input type="checkbox" name="remember" className="h-4 w-4 accent-primary" />
        로그인 상태 유지 (7일)
      </label>

      {state?.error && (
        <p className="rounded-btn bg-red-50 px-4 py-2 text-sm text-beauty-danger">{state.error}</p>
      )}

      <SubmitButton />

      <SocialLoginButtons redirectTo={redirectTo} />

      <p className="text-center text-sm text-beauty-gray">
        아직 회원이 아니신가요?{" "}
        <Link
          href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-primary hover:underline"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}
