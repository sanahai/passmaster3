import Link from "next/link";
import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { getAcademyStats, getAcademyStudents, getGroupStats } from "@/lib/academy-stats";
import UpgradeBanner from "@/components/academy/UpgradeBanner";

export default async function AcademyReportPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "standard")) return <UpgradeBanner />;

  const stats = await getAcademyStats(ctx.academy.id);
  const students = await getAcademyStudents(ctx.academy.id);
  const groups = await getGroupStats(ctx.academy.id);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-b2b-primary">학습 리포트</h1>
        <a
          href="/api/academy/report"
          className="b2b-btn-accent"
          download
        >
          CSV 다운로드
        </a>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="b2b-card text-center">
          <p className="text-3xl font-bold text-b2b-accent">{stats.total}</p>
          <p className="text-sm text-slate-500">전체 학생</p>
        </div>
        <div className="b2b-card text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.avgAccuracy}%</p>
          <p className="text-sm text-slate-500">평균 정답률</p>
        </div>
        <div className="b2b-card text-center">
          <p className="text-3xl font-bold text-amber-600">{stats.inactive7d}</p>
          <p className="text-sm text-slate-500">7일 미접속</p>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="mb-6 b2b-card">
          <h2 className="mb-4 font-bold">반별 요약</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">반</th>
                <th>인원</th>
                <th>평균 정답률</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className="border-b border-slate-50">
                  <td className="py-2">{g.name}</td>
                  <td>{g.count}명</td>
                  <td>{g.avgScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="b2b-card">
        <h2 className="mb-4 font-bold">학생별 요약</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">이름</th>
                <th>반</th>
                <th>정답률</th>
                <th>풀이</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-slate-50">
                  <td className="py-2 font-medium">{s.name}</td>
                  <td>{s.groupName ?? "-"}</td>
                  <td>{s.accuracy}%</td>
                  <td>{s.answerCount}</td>
                  <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${s.status.className}`}>
                      {s.status.label}
                    </span>
                  </td>
                  <td>
                    <Link href={`/academy/students/${s.id}`} className="text-b2b-accent hover:underline">
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
