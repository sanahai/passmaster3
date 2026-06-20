import Link from "next/link";
import { requireSubsiteStudent } from "@/lib/academy-subsite";
import { subsitePath } from "@/lib/academy-subsite";

export const dynamic = "force-dynamic";

export default async function SubsiteMypagePage({ params }: { params: { subdomain: string } }) {
  const { session, academy } = await requireSubsiteStudent(params.subdomain);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">마이페이지</h1>
        <p className="text-slate-500">프로필 및 학원 연동 정보</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div>
          <p className="text-xs text-slate-400">이름</p>
          <p className="font-bold text-slate-900">{session.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">이메일</p>
          <p className="text-slate-700">{session.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">소속 학원</p>
          <p className="font-bold text-slate-900">{academy.name}</p>
          {academy.code && <p className="text-sm text-slate-500">코드: {academy.code}</p>}
        </div>
      </div>
      <Link href="/mypage" className="text-sm font-bold text-[var(--subsite-primary)] hover:underline">
        전체 마이페이지 →
      </Link>
      <Link href={subsitePath(params.subdomain, "/dashboard")} className="block text-sm text-slate-500 hover:underline">
        ← 대시보드
      </Link>
    </div>
  );
}
