import Link from "next/link";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { tierAtLeast } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminSettingsPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);

  if (!tierAtLeast(academy.tier, "standard")) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-300">
        스탠다드 이상에서 학원 설정을 변경할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">학원 설정</h1>
        <p className="text-slate-400">로고, 브랜드 색상, 서브도메인</p>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">학원명</span>
          <span className="font-bold text-white">{academy.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">학원 코드</span>
          <span className="font-mono text-white">{academy.code ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">전용 URL</span>
          <Link href={subsitePath(params.subdomain, "")} className="text-sky-400 hover:underline">
            /a/{params.subdomain}
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">브랜드 색상</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded" style={{ backgroundColor: academy.primaryColor }} />
            <span className="font-mono text-white">{academy.primaryColor}</span>
          </span>
        </div>
      </div>
      <Link href="/academy/settings" className="inline-block rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500">
        상세 설정 (B2B) →
      </Link>
      <Link href={subsitePath(params.subdomain, "/admin")} className="block text-sm text-slate-400 hover:text-white">
        ← 대시보드
      </Link>
    </div>
  );
}
