"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAcademyWithInviteAction } from "@/app/actions/academy";

export default function CreateAcademyForm() {
  const router = useRouter();
  const [result, setResult] = useState<{
    setupUrl?: string;
    code?: string | null;
    academyId?: number;
    portalUrl?: string;
    error?: string;
  } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    try {
      const res = await createAcademyWithInviteAction(formData);
      setResult(res);
      if (res.academyId) {
        router.refresh();
      }
    } catch {
      setResult({ error: "생성 실패" });
    }
    setPending(false);
  }

  return (
    <div>
      <form action={handleSubmit} className="card max-w-2xl space-y-4">
        <h2 className="text-lg font-bold text-beauty-neutral">새 B2B 학원 등록</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">학원명</label>
            <input name="name" className="input" placeholder="○○미용학원" required />
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
          <div>
            <label className="label">학생 정원</label>
            <input name="maxStudents" type="number" className="input" defaultValue={30} min={1} />
          </div>
          <div>
            <label className="label">이용 개월</label>
            <input name="months" type="number" className="input" defaultValue={12} min={1} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">전용 페이지 URL (서브도메인)</label>
            <input name="subdomain" className="input" placeholder="my-academy" />
            <p className="mt-1 text-xs text-beauty-gray">
              생성 후 https://beautymaster.vercel.app/a/서브도메인 제휴 템플릿 사이트 제공
            </p>
          </div>
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
          {pending ? "생성 중..." : "학원 생성 + 원장 초대"}
        </button>
      </form>

      {result?.error && (
        <p className="mt-4 text-sm text-beauty-danger">{result.error}</p>
      )}

      {result?.setupUrl && (
        <div className="card mt-4 max-w-2xl text-sm">
          <p className="font-bold text-beauty-success">학원이 등록되었습니다.</p>
          <dl className="mt-3 space-y-2">
            <div className="flex gap-2">
              <dt className="text-beauty-gray">학원 코드</dt>
              <dd className="font-mono font-bold">{result.code}</dd>
            </div>
            <div>
              <dt className="text-beauty-gray">제휴학원 페이지</dt>
              <dd className="mt-1 break-all rounded-btn bg-primary-pale/40 p-2 font-mono text-xs">
                {result.portalUrl}
              </dd>
            </div>
            <div>
              <dt className="text-beauty-gray">원장 설정 링크 (48시간)</dt>
              <dd className="mt-1 break-all rounded-btn bg-primary-pale/40 p-2 font-mono text-xs">
                {result.setupUrl}
              </dd>
            </div>
          </dl>
          {result.academyId && (
            <a href={`/admin/academies/${result.academyId}`} className="btn-outline mt-4 inline-block">
              학원 상세 관리 →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
