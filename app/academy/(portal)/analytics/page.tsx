import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { getWeeklyActivity, getAccuracyDistribution } from "@/lib/academy-analytics";
import { getAcademyStats, getGroupStats } from "@/lib/academy-stats";
import AnalyticsCharts from "@/components/academy/AnalyticsCharts";
import UpgradeBanner from "@/components/academy/UpgradeBanner";

export default async function AcademyAnalyticsPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "premium")) return <UpgradeBanner />;

  const [stats, weekly, buckets, groups] = await Promise.all([
    getAcademyStats(ctx.academy.id),
    getWeeklyActivity(ctx.academy.id),
    getAccuracyDistribution(ctx.academy.id),
    getGroupStats(ctx.academy.id),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-b2b-primary">학습 분석</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "전체 학생", value: stats.total },
          { label: "7일 활성", value: stats.active7d },
          { label: "평균 정답률", value: `${stats.avgAccuracy}%` },
          { label: "7일 미접속", value: stats.inactive7d },
        ].map((c) => (
          <div key={c.label} className="b2b-card text-center">
            <p className="text-2xl font-bold text-b2b-primary">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts weekly={weekly} accuracyBuckets={buckets} />

      {groups.length > 0 && (
        <div className="mt-6 b2b-card">
          <h2 className="mb-4 font-bold">반별 비교</h2>
          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.id} className="flex items-center gap-4">
                <span className="w-24 text-sm font-semibold">{g.name}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-b2b-section">
                  <div
                    className="h-full rounded-full bg-b2b-teal"
                    style={{ width: `${g.avgScore}%` }}
                  />
                </div>
                <span className="w-16 text-sm">{g.avgScore}% ({g.count}명)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
