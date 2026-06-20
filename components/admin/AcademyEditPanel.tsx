"use client";

import { useState } from "react";
import {
  updateAcademyAdminAction,
  extendAcademyAdminAction,
  resendOwnerInviteAdminAction,
  deleteAcademyAdminAction,
  regenerateAcademyCodeAdminAction,
} from "@/app/actions/admin-academy";

type AcademyData = {
  id: number;
  name: string;
  tier: string;
  code: string | null;
  subdomain: string | null;
  ownerEmail: string;
  ownerPhone: string | null;
  maxStudents: number;
  activeUntil: string;
};

export default function AcademyEditPanel({
  academy,
  pendingInvite,
}: {
  academy: AcademyData;
  pendingInvite: { email: string; setupUrl: string; expiresAt: string } | null;
}) {
  const [inviteResult, setInviteResult] = useState<{ setupUrl?: string; error?: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleResend(formData: FormData) {
    setPending(true);
    setInviteResult(null);
    const res = await resendOwnerInviteAdminAction(formData);
    setInviteResult(res ?? null);
    setPending(false);
  }

  const isExpired = new Date(academy.activeUntil) < new Date();

  return (
    <div className="space-y-6">
      <form action={updateAcademyAdminAction} className="card space-y-4">
        <h2 className="text-lg font-bold text-beauty-neutral">기본 정보</h2>
        <input type="hidden" name="id" value={academy.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">학원명</label>
            <input name="name" className="input" defaultValue={academy.name} required />
          </div>
          <div>
            <label className="label">플랜</label>
            <select name="tier" className="input" defaultValue={academy.tier}>
              <option value="basic">베이직</option>
              <option value="standard">스탠다드</option>
              <option value="premium">프리미엄</option>
            </select>
          </div>
          <div>
            <label className="label">원장 이메일</label>
            <input name="ownerEmail" type="email" className="input" defaultValue={academy.ownerEmail} required />
          </div>
          <div>
            <label className="label">원장 연락처</label>
            <input name="ownerPhone" type="tel" className="input" defaultValue={academy.ownerPhone ?? ""} />
          </div>
          <div>
            <label className="label">학생 정원</label>
            <input name="maxStudents" type="number" className="input" defaultValue={academy.maxStudents} min={1} />
          </div>
          <div>
            <label className="label">이용 만료일</label>
            <input
              name="activeUntil"
              type="date"
              className="input"
              defaultValue={academy.activeUntil.slice(0, 10)}
            />
            {isExpired && (
              <p className="mt-1 text-xs text-beauty-danger">만료됨 — 연장이 필요합니다.</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="label">전용 페이지 URL (서브도메인)</label>
            <input name="subdomain" className="input" defaultValue={academy.subdomain ?? ""} placeholder="my-academy" />
            <p className="mt-1 text-xs text-beauty-gray">/a/서브도메인 — 제휴학원 템플릿 사이트</p>
          </div>
        </div>
        <button type="submit" className="btn-primary">저장</button>
      </form>

      <div className="card space-y-3">
        <h2 className="text-lg font-bold text-beauty-neutral">학원 코드</h2>
        <p className="font-mono text-2xl font-bold text-primary">{academy.code ?? "없음"}</p>
        <form action={regenerateAcademyCodeAdminAction}>
          <input type="hidden" name="id" value={academy.id} />
          <button type="submit" className="btn-outline text-sm">코드 재발급</button>
        </form>
      </div>

      <form action={extendAcademyAdminAction} className="card flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={academy.id} />
        <div>
          <label className="label">이용 기간 연장</label>
          <select name="months" className="input w-32">
            <option value="1">1개월</option>
            <option value="3">3개월</option>
            <option value="6">6개월</option>
            <option value="12">12개월</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">연장 적용</button>
      </form>

      <div className="card space-y-3">
        <h2 className="text-lg font-bold text-beauty-neutral">원장 초대</h2>
        {pendingInvite ? (
          <div className="rounded-btn bg-primary-pale/50 p-3 text-sm">
            <p className="font-semibold">대기 중인 초대 · {pendingInvite.email}</p>
            <p className="text-xs text-beauty-gray">만료: {pendingInvite.expiresAt}</p>
            <p className="mt-2 break-all font-mono text-xs">{pendingInvite.setupUrl}</p>
          </div>
        ) : (
          <p className="text-sm text-beauty-gray">사용 가능한 초대 링크가 없습니다. 아래에서 재발송하세요.</p>
        )}
        <form action={handleResend} className="flex flex-wrap gap-2">
          <input type="hidden" name="academyId" value={academy.id} />
          <input
            name="email"
            type="email"
            className="input flex-1"
            defaultValue={academy.ownerEmail}
            required
          />
          <button type="submit" disabled={pending} className="btn-primary shrink-0">
            {pending ? "발송 중..." : "초대 링크 재발송"}
          </button>
        </form>
        {inviteResult?.setupUrl && (
          <p className="break-all rounded-btn bg-emerald-50 p-2 text-xs text-emerald-800">
            {inviteResult.setupUrl}
          </p>
        )}
        {inviteResult?.error && (
          <p className="text-sm text-beauty-danger">{inviteResult.error}</p>
        )}
      </div>

      <form
        action={deleteAcademyAdminAction}
        className="card border-beauty-danger/30"
        onSubmit={(e) => {
          if (!confirm("학원과 소속 데이터(반·지점·초대)가 삭제됩니다. 계속할까요?")) {
            e.preventDefault();
          }
        }}
      >
        <h2 className="text-lg font-bold text-beauty-danger">학원 삭제</h2>
        <p className="mb-3 text-sm text-beauty-gray">
          소속 학생·강사 연결은 해제되며, 학원 전용 데이터는 삭제됩니다.
        </p>
        <input type="hidden" name="id" value={academy.id} />
        <button type="submit" className="rounded-btn bg-beauty-danger px-4 py-2 text-sm font-semibold text-white">
          학원 삭제
        </button>
      </form>
    </div>
  );
}
