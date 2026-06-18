"use client";

import { useFormState } from "react-dom";
import { registerAcademyCodeAction } from "@/app/actions/academy";

export default function AcademyCodeForm({ currentAcademy }: { currentAcademy?: string | null }) {
  const [state, action] = useFormState(registerAcademyCodeAction, undefined);

  if (currentAcademy) {
    return (
      <div className="card">
        <h2 className="mb-2 text-lg font-bold text-beauty-neutral">소속 학원</h2>
        <p className="text-sm text-beauty-gray">{currentAcademy}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="mb-2 text-lg font-bold text-beauty-neutral">학원 코드 등록</h2>
      <p className="mb-4 text-sm text-beauty-gray">
        학원에서 받은 6자리 코드를 입력하면 학원 대시보드에 학습 현황이 연동됩니다.
      </p>
      <form action={action} className="flex gap-2">
        <input
          name="code"
          placeholder="예: ABCDEF"
          className="input flex-1 uppercase"
          maxLength={6}
          required
        />
        <button type="submit" className="btn-primary shrink-0">
          등록
        </button>
      </form>
      {state?.error && (
        <p className="mt-2 text-sm text-beauty-danger">{state.error}</p>
      )}
      {state && !state.error && (
        <p className="mt-2 text-sm text-beauty-success">학원 코드가 등록되었습니다.</p>
      )}
    </div>
  );
}
