import Link from "next/link";
import StatCards from "@/components/academy/StatCards";
import AcademyCodeCard from "@/components/academy/AcademyCodeCard";
import StudentTable from "@/components/academy/StudentTable";
import UpgradeBanner from "@/components/academy/UpgradeBanner";
import { requireAcademyStaff } from "@/lib/academy-access";
import { getAcademyStats, getAcademyStudents, getAtRiskStudents, getGroupStats } from "@/lib/academy-stats";
import { tierAtLeast } from "@/lib/academy";

type SearchParams = {
  tab?: string;
  filter?: string;
  q?: string;
  error?: string;
  from?: string;
};

async function resolveSearchParams(
  searchParams?: SearchParams | Promise<SearchParams>,
): Promise<SearchParams> {
  if (!searchParams) return {};
  if (typeof (searchParams as Promise<SearchParams>).then === "function") {
    return await (searchParams as Promise<SearchParams>);
  }
  return searchParams;
}

export const dynamic = "force-dynamic";

export default async function AcademyDashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const sp = await resolveSearchParams(searchParams);
  const { user, academy } = await requireAcademyStaff();
  const stats = await getAcademyStats(academy.id);
  const students = await getAcademyStudents(academy.id, {
    filter: sp.filter,
    q: sp.q,
    branchId: user.role === "branch_admin" ? user.branchId ?? undefined : undefined,
    teacherId: user.role === "teacher" ? user.id : undefined,
  });
  const atRisk = tierAtLeast(academy.tier, "standard")
    ? await getAtRiskStudents(academy.id)
    : [];
  const groupStats = tierAtLeast(academy.tier, "standard")
    ? await getGroupStats(academy.id)
    : [];

  return (
    <div>
      {sp.error === "upgrade" && (
        <div className="mb-6">
          <UpgradeBanner />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-b2b-primary">
          안녕하세요, {academy.name} {user.role === "owner" ? "원장" : user.role === "teacher" ? "강사" : "관리자"}님
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          플랜: {academy.tier.toUpperCase()} · 학생 {stats.total}/{academy.maxStudents}명
        </p>
      </div>

      {academy.code && <AcademyCodeCard code={academy.code} />}

      <StatCards
        stats={[
          { label: "전체 학생", value: stats.total },
          { label: "7일 활성", value: stats.active7d, color: "#10B981" },
          { label: "7일 미접속", value: stats.inactive7d, color: "#F59E0B" },
          { label: "평균 정답률", value: `${stats.avgAccuracy}%`, color: "#E91E8C" },
        ]}
      />

      {groupStats.length > 0 && (
        <div className="mb-6 b2b-card">
          <h2 className="mb-4 text-lg font-bold text-b2b-primary">반별 평균 정답률</h2>
          <div className="space-y-3">
            {groupStats.map((g) => (
              <div key={g.id} className="flex items-center gap-4">
                <span className="w-24 text-sm font-semibold">{g.name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-b2b-section">
                  <div
                    className="h-full rounded-full bg-b2b-accent"
                    style={{ width: `${g.avgScore}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-bold">{g.avgScore}%</span>
                <span className="text-xs text-slate-500">{g.count}명</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {atRisk.length > 0 && (
        <div className="mb-6 b2b-card border-amber-200 bg-amber-50/30">
          <h2 className="mb-3 text-lg font-bold text-amber-800">주의 학생 ({atRisk.length}명)</h2>
          <ul className="space-y-2 text-sm">
            {atRisk.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>{s.name}</span>
                <span className="text-amber-700">정답률 {s.accuracy}% · {s.status.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/academy/dashboard"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!sp.filter ? "bg-b2b-primary text-white" : "bg-white border"}`}
        >
          전체
        </Link>
        <Link
          href="/academy/dashboard?filter=active"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${sp.filter === "active" ? "bg-b2b-primary text-white" : "bg-white border"}`}
        >
          활성
        </Link>
        <Link
          href="/academy/dashboard?filter=warning"
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${sp.filter === "warning" ? "bg-b2b-primary text-white" : "bg-white border"}`}
        >
          주의
        </Link>
      </div>

      <StudentTable students={students} />
    </div>
  );
}
