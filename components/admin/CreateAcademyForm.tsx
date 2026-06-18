"use client";

import { useState } from "react";
import { createAcademyWithInviteAction } from "@/app/actions/academy";

export default function CreateAcademyForm() {
  const [result, setResult] = useState<{
    setupUrl?: string;
    code?: string | null;
    error?: string;
  } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    try {
      const res = await createAcademyWithInviteAction(formData);
      setResult(res);
    } catch {
      setResult({ error: "생성 실패" });
    }
    setPending(false);
  }

  return (
    <div>
      <form action={handleSubmit} className="card max-w-lg space-y-4">
        <h2 className="text-lg font-bold text-beauty-neutral">새 B2B 학원</h2>
        <div>
          <label className="label">학원명</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">원장 이메일</label>
          <input name="ownerEmail" type="email" className="input" required />
        </div>
        <div>
          <label className="label">플랜</label>
          <select name="tier" className="input" defaultValue="standard">
            <option value="basic">베이직</option>
            <option value="standard">스탠다드</option>
            <option value="premium">프리미엄</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">학생 정원</label>
            <input name="maxStudents" type="number" className="input" defaultValue={30} />
          </div>
          <div>
            <label className="label">이용 개월</label>
            <input name="months" type="number" className="input" defaultValue={12} />
          </div>
        </div>
        <div>
          <label className="label">서브도메인 (프리미엄)</label>
          <input name="subdomain" className="input" placeholder="demo-beauty (선택)" />
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "생성 중..." : "학원 + 원장 초대 생성"}
        </button>
      </form>
      {result?.setupUrl && (
        <div className="card mt-4 max-w-lg text-sm">
          <p className="font-bold text-beauty-success">생성 완료</p>
          <p className="mt-2">학원 코드: <code>{result.code}</code></p>
          <p className="mt-1 break-all">원장 설정: {result.setupUrl}</p>
        </div>
      )}
    </div>
  );
}
