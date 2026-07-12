import Link from "next/link";
import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { getAcademyStats, getAcademyStudents, getGroupStats } from "@/lib/academy-stats";
import UpgradeBanner from "@/components/academy/UpgradeBanner";
import PrintReportButton from "@/components/academy/PrintReportButton";

export default async function AcademyReportPrintPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "standard")) return <UpgradeBanner />;

  const [stats, students, groups] = await Promise.all([
    getAcademyStats(ctx.academy.id),
    getAcademyStudents(ctx.academy.id),
    getGroupStats(ctx.academy.id),
  ]);

  const date = new Date().toLocaleDateString("ko-KR");

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="mb-6 flex justify-between print:hidden">
        <Link href="/academy/report" className="text-sm text-b2b-accent hover:underline">
          ← 리포트로
        </Link>
        <PrintReportButton />
      </div>

      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-b2b-primary">{ctx.academy.name} 학습 리포트</h1>
        <p className="text-sm text-slate-500">생성일 {date}</p>
      </header>

      <section className="mb-8 grid grid-cols-4 gap-4 text-center">
        {[
          ["전체 학생", `${stats.total}명`],
          ["7일 활성", `${stats.active7d}명`],
          ["7일 미접속", `${stats.inactive7d}명`],
          ["평균 정답률", `${stats.avgAccuracy}%`],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg bg-b2b-section p-4">
            <p className="text-xl font-bold">{v}</p>
            <p className="text-xs text-slate-500">{l}</p>
          </div>
        ))}
      </section>

      {groups.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-bold">반별 요약</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-2 text-left">반</th>
                <th className="p-2 text-left">인원</th>
                <th className="p-2 text-left">평균 정답률</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className="border-b">
                  <td className="p-2">{g.name}</td>
                  <td className="p-2">{g.count}명</td>
                  <td className="p-2">{g.avgScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-bold">학생별 상세</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-2 text-left">이름</th>
              <th className="p-2 text-left">이메일</th>
              <th className="p-2 text-left">반</th>
              <th className="p-2 text-left">정답률</th>
              <th className="p-2 text-left">풀이</th>
              <th className="p-2 text-left">상태</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.groupName ?? "-"}</td>
                <td className="p-2">{s.accuracy}%</td>
                <td className="p-2">{s.answerCount}</td>
                <td className="p-2">{s.status.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-10 text-center text-xs text-slate-400 print:fixed print:bottom-4 print:w-full">
        PASSmaster B2B · Powered by 골든웨이브
      </footer>
    </div>
  );
}
