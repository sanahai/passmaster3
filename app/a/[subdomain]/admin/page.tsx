import Link from "next/link";
import StatCards from "@/components/academy/StatCards";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { getAcademyStats, getAtRiskStudents } from "@/lib/academy-stats";
import { tierAtLeast } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminDashboardPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);
  const stats = await getAcademyStats(academy.id);
  const atRisk = tierAtLeast(academy.tier, "standard") ? await getAtRiskStudents(academy.id) : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">관리자 대시보드</h1>
        <p className="text-slate-400">{academy.name} · 학습 현황 요약</p>
      </div>
      <StatCards
        stats={[
          { label: "전체 학생", value: stats.total, color: "#38BDF8" },
          { label: "7일 활성", value: stats.active7d, color: "#34D399" },
          { label: "7일 미접속", value: stats.inactive7d, color: "#FBBF24" },
          { label: "평균 정답률", value: `${stats.avgAccuracy}%`, color: "#A78BFA" },
        ]}
      />
      {atRisk.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
          <h2 className="font-bold text-amber-200">⚠️ 관리 필요 학생 {atRisk.length}명</h2>
          <Link href={subsitePath(params.subdomain, "/admin/students?filter=atrisk")} className="mt-2 inline-block text-sm text-amber-300 hover:underline">
            학생 목록 보기 →
          </Link>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/students", label: "학생 관리", icon: "👥" },
          { href: "/admin/grades", label: "성적 관리", icon: "📈" },
          { href: "/admin/board", label: "공지 작성", icon: "📌" },
          { href: "/admin/settings", label: "학원 설정", icon: "⚙️" },
        ].map((item) => (
          <Link
            key={item.href}
            href={subsitePath(params.subdomain, item.href)}
            className="rounded-2xl border border-slate-700 bg-slate-800 p-5 hover:bg-slate-750"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-2 font-bold text-white">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
