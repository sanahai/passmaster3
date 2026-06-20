import Link from "next/link";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { tierAtLeast } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminQuestionsPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);

  if (!tierAtLeast(academy.tier, "premium")) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center">
        <p className="text-slate-300">프리미엄 플랜에서 학원 자체 문제 등록이 가능합니다.</p>
        <Link href={subsitePath(params.subdomain, "/admin")} className="mt-4 inline-block text-sm text-sky-400 hover:underline">
          ← 대시보드
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">문제 관리</h1>
        <p className="text-slate-400">학원 자체 문제 등록·일괄 업로드</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/academy/questions" className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500">
          문제 목록 (B2B)
        </Link>
        <Link href="/academy/questions/upload" className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
          일괄 업로드
        </Link>
      </div>
    </div>
  );
}
