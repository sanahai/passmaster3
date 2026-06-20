import Link from "next/link";
import { requireSubsiteStudent, subsitePath } from "@/lib/academy-subsite";
import { getStudentSubsiteStats } from "@/lib/academy-subsite";
import { COURSES } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default async function SubsitePracticePage({ params }: { params: { subdomain: string } }) {
  const { user } = await requireSubsiteStudent(params.subdomain);
  const stats = await getStudentSubsiteStats(user.id);
  const activeSlugs = new Set(stats.enrollments.map((e) => e.course.slug));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">문제 풀기</h1>
        <p className="text-slate-500">과목·단원별 연습 및 단계별 학습</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {COURSES.filter((c) => !c.comingSoon).map((course) => {
          const active = activeSlugs.has(course.slug);
          return (
            <div key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span className="text-2xl">{course.icon}</span>
              <h2 className="mt-2 font-bold text-slate-900">{course.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{course.description}</p>
              {active ? (
                <Link
                  href={`/learn/${course.slug}`}
                  className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--subsite-primary)" }}
                >
                  학습 시작
                </Link>
              ) : (
                <Link href={`/enroll/${course.slug}`} className="mt-4 inline-block text-sm font-bold text-[var(--subsite-primary)]">
                  수강 신청 →
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <Link href={subsitePath(params.subdomain, "/dashboard")} className="text-sm text-slate-500 hover:underline">
        ← 대시보드
      </Link>
    </div>
  );
}
