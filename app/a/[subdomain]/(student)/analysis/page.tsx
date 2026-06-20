import { requireSubsiteStudent, getStudentSubsiteStats } from "@/lib/academy-subsite";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubsiteAnalysisPage({ params }: { params: { subdomain: string } }) {
  const { user } = await requireSubsiteStudent(params.subdomain);
  const stats = await getStudentSubsiteStats(user.id);

  const mockSessions = await prisma.mockSession.findMany({
    where: { userId: user.id, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    take: 6,
    include: { course: true },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">성적 분석</h1>
        <p className="text-slate-500">학습 데이터 기반 합격 예측 및 약점 분석</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">예상 점수</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.avgScore}점</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">총 풀이</p>
          <p className="text-3xl font-bold text-slate-900">{stats.totalAnswered}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">오답 노트</p>
          <p className="text-3xl font-bold text-amber-600">{stats.wrongCount}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 font-bold text-slate-900">모의고사 기록</h2>
        {mockSessions.length === 0 ? (
          <p className="text-sm text-slate-500">아직 완료한 모의고사가 없습니다.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {mockSessions.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  {m.course.name} · {m.mockNumber}회차
                </span>
                <span className="font-bold text-slate-900">{m.score ?? 0}점</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
