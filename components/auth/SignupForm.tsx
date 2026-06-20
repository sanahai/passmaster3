"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signupAction } from "@/app/actions/auth";
import PasswordInput from "./PasswordInput";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "가입 중..." : "회원가입"}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState(signupAction, undefined);
  const searchParams = useSearchParams();
  const presetCode = searchParams.get("academyCode") ?? "";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          이름
        </label>
        <input id="name" name="name" type="text" className="input" placeholder="홍길동" required />
      </div>
      <div>
        <label className="label" htmlFor="email">
          이메일
        </label>
        <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          연락처 <span className="font-normal text-beauty-gray">(선택)</span>
        </label>
        <input id="phone" name="phone" type="tel" className="input" placeholder="010-0000-0000" />
      </div>
      <div>
        <label className="label" htmlFor="academyCode">
          학원 코드 <span className="font-normal text-beauty-gray">(선택)</span>
        </label>
        <input
          id="academyCode"
          name="academyCode"
          type="text"
          className="input uppercase"
          placeholder="6자리 코드"
          maxLength={6}
          defaultValue={presetCode}
        />
        {presetCode && (
          <p className="mt-1 text-xs text-primary">제휴학원 코드가 자동 입력되었습니다.</p>
        )}
      </div>
      <div>
        <label className="label" htmlFor="password">
          비밀번호
        </label>
        <PasswordInput id="password" name="password" placeholder="8자 이상, 영문+숫자" required />
      </div>
      <div>
        <label className="label" htmlFor="passwordConfirm">
          비밀번호 확인
        </label>
        <PasswordInput id="passwordConfirm" name="passwordConfirm" placeholder="비밀번호 재입력" required />
      </div>

      {state?.error && (
        <p className="rounded-btn bg-red-50 px-4 py-2 text-sm text-beauty-danger">{state.error}</p>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-beauty-gray">
        이미 회원이신가요?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
