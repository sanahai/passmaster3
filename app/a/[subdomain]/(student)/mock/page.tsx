import Link from "next/link";
import { requireSubsiteStudent, getStudentSubsiteStats } from "@/lib/academy-subsite";

export const dynamic = "force-dynamic";

export default async function SubsiteMockPage({ params }: { params: { subdomain: string } }) {
  const { user } = await requireSubsiteStudent(params.subdomain);
  const stats = await getStudentSubsiteStats(user.id);
  const course = stats.enrollments[0]?.course;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">모의고사</h1>
        <p className="text-slate-500">실전 형식 6회차 모의고사 · 60점 합격 기준</p>
      </div>
      {course ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((m) => (
            <Link
              key={m}
              href={`/learn/${course.slug}/mock/${m}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <p className="text-sm text-slate-500">모의고사</p>
              <p className="text-xl font-bold text-slate-900">{m}회차</p>
              <p className="mt-2 text-xs text-[var(--subsite-primary)]">응시하기 →</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          수강 중인 과정이 없습니다.
        </div>
      )}
    </div>
  );
}
