import Link from "next/link";
import { requireSubsiteStudent, getStudentSubsiteStats, subsitePath } from "@/lib/academy-subsite";
import { computeProgressBars, nextStepKey } from "@/lib/progress";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubsiteDashboardPage({ params }: { params: { subdomain: string } }) {
  const { session, user } = await requireSubsiteStudent(params.subdomain);
  const stats = await getStudentSubsiteStats(user.id);

  const progresses = await prisma.learningProgress.findMany({ where: { userId: user.id } });
  const progByCourse = new Map(progresses.map((p) => [p.courseId, p]));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          안녕하세요, {session.name}님 👋
        </h1>
        <p className="mt-1 text-slate-500">오늘도 합격을 향해 한 걸음 더!</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "전체 풀이", value: stats.totalAnswered, icon: "📚" },
          { label: "이번 주 풀이", value: stats.weekAnswers, icon: "📅" },
          { label: "평균 정답률", value: `${stats.avgScore}%`, icon: "🎯" },
          { label: "오답 노트", value: stats.wrongCount, icon: "🔁" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{c.icon} {c.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={subsitePath(params.subdomain, "/practice")}
          className="rounded-xl px-5 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: "var(--subsite-primary)" }}
        >
          문제 풀기 시작
        </Link>
        <Link href={subsitePath(params.subdomain, "/wrong")} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">
          오답 복습
        </Link>
        <Link href={subsitePath(params.subdomain, "/mock")} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700">
          모의고사
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">내 과정</h2>
        {stats.enrollments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="mb-4 text-slate-500">활성 수강 과정이 없습니다.</p>
            <Link href="/enroll" className="text-sm font-bold text-[var(--subsite-primary)] hover:underline">
              과정 둘러보기 →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {stats.enrollments.map((e) => {
              const prog = progByCourse.get(e.courseId) ?? null;
              const { overallPct } = computeProgressBars(
                e.course.slug,
                prog,
                prog?.curStepKey ?? "",
                prog?.curStepPct ?? 0,
              );
              const next = nextStepKey(e.course.slug, prog);
              return (
                <div key={e.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-900">{e.course.name}</h3>
                  <div className="mt-3 mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${overallPct}%` }} />
                  </div>
                  <p className="text-sm text-slate-500">진행률 {overallPct}% · {next?.label ?? "학습 완료"}</p>
                  <Link
                    href={`/learn/${e.course.slug}`}
                    className="mt-4 inline-block text-sm font-bold text-[var(--subsite-primary)] hover:underline"
                  >
                    학습 계속하기 →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
