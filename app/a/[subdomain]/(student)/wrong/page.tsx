import Link from "next/link";
import { requireSubsiteStudent, getStudentSubsiteStats } from "@/lib/academy-subsite";

export const dynamic = "force-dynamic";

export default async function SubsiteWrongPage({ params }: { params: { subdomain: string } }) {
  const { user } = await requireSubsiteStudent(params.subdomain);
  const stats = await getStudentSubsiteStats(user.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">오답 복습</h1>
        <p className="text-slate-500">틀린 문제를 모아 취약점을 집중 보완합니다.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-4xl font-bold text-[var(--subsite-primary)]">{stats.wrongCount}</p>
        <p className="mt-2 text-slate-500">미해결 오답</p>
        {stats.enrollments[0] ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/learn/${stats.enrollments[0].course.slug}/wrong/round`}
              className="rounded-xl px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "var(--subsite-primary)" }}
            >
              회차 오답 복습
            </Link>
            <Link
              href={`/learn/${stats.enrollments[0].course.slug}/wrong/mock`}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
            >
              모의고사 오답
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">수강 중인 과정이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
