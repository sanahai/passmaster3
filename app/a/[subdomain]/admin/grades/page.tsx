import Link from "next/link";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { tierAtLeast } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminGradesPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);

  if (!tierAtLeast(academy.tier, "standard")) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-300">
        스탠다드 이상 플랜에서 성적 리포트를 이용할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">성적 관리</h1>
        <p className="text-slate-400">학생별·반별 성적 분석 및 내보내기</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/academy/report" className="rounded-2xl border border-slate-700 bg-slate-800 p-6 hover:border-sky-600">
          <p className="font-bold text-white">📄 주간 리포트</p>
          <p className="mt-1 text-sm text-slate-400">PDF·CSV 다운로드</p>
        </Link>
        <Link href="/academy/analytics" className="rounded-2xl border border-slate-700 bg-slate-800 p-6 hover:border-sky-600">
          <p className="font-bold text-white">📈 학습 분석</p>
          <p className="mt-1 text-sm text-slate-400">차트·통계 (프리미엄)</p>
        </Link>
      </div>
      <Link href={subsitePath(params.subdomain, "/admin")} className="text-sm text-slate-400 hover:text-white">
        ← 대시보드
      </Link>
    </div>
  );
}
