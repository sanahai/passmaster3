import Link from "next/link";
import Header from "@/components/Header";
import { requireTrialSession } from "@/lib/trial-access";
import { prisma } from "@/lib/prisma";
import { getCourseConfig } from "@/lib/courses";
import { getCompletedTrialCourseIds } from "@/lib/trial";
import { sortByCourseDisplayOrder } from "@/lib/course-catalog";

export const dynamic = "force-dynamic";

export default async function TrialSelectPage() {
  const session = await requireTrialSession("/trial");

  const [courses, enrollments, completedTrialIds] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true },
    }),
    prisma.enrollment.findMany({
      where: { userId: session.userId, userDeleted: false, status: "active" },
      select: { courseId: true },
    }),
    getCompletedTrialCourseIds(session.userId),
  ]);

  const activeCourseIds = new Set(enrollments.map((e) => e.courseId));
  const trialCourses = sortByCourseDisplayOrder(
    courses.filter((c) => !activeCourseIds.has(c.id) && !completedTrialIds.has(c.id))
  );

  const freeCounts = await prisma.question.groupBy({
    by: ["courseId"],
    where: { isFree: true, isActive: true },
    _count: { _all: true },
  });
  const countByCourse = new Map(freeCounts.map((f) => [f.courseId, f._count._all]));

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1120px] px-4 py-10 sm:px-6 lg:py-12">
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">🎁 무료체험</h1>
        <p className="mb-8 text-beauty-gray">
          체험할 자격증을 선택하세요. 과정당 무료체험은 1회만 가능합니다.
        </p>

        <div className="course-card-grid">
          {trialCourses.length === 0 ? (
            <div className="card col-span-full text-center">
              <p className="mb-4 text-beauty-gray">
                수강 중이거나 이미 무료체험을 완료한 과정을 제외하면 체험할 수 있는 과정이 없습니다.
              </p>
              <Link href="/enroll" className="btn-primary">
                수강신청 보기
              </Link>
            </div>
          ) : (
            trialCourses.map((c) => {
              const cfg = getCourseConfig(c.slug);
              const count = countByCourse.get(c.id) ?? 0;
              const disabled = count === 0;
              return (
                <div key={c.id} className="card flex flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-3xl">{cfg?.icon ?? "📘"}</span>
                    <h3 className="text-lg font-bold text-beauty-neutral">{c.name}</h3>
                  </div>
                  <p className="mb-4 text-sm text-beauty-gray">{c.description}</p>
                  <ul className="mb-5 space-y-1 text-sm text-beauty-gray">
                    <li>🎁 무료 체험 문제: {count.toLocaleString()}문제</li>
                    <li>⏱️ 타이머 없이 편하게 풀이</li>
                  </ul>
                  <div className="course-card-actions">
                    {disabled ? (
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-btn bg-gray-300 px-5 py-3.5 text-[15px] font-bold text-white"
                      >
                        준비 중
                      </button>
                    ) : (
                      <Link href={`/trial/${c.slug}`} className="btn-primary">
                        이 과정 무료체험 시작
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 rounded-card bg-primary-pale/40 p-5 text-sm text-beauty-gray">
          체험 후 마음에 들면{" "}
          <Link href="/enroll" className="font-semibold text-primary hover:underline">
            수강신청
          </Link>
          에서 정식 과정을 등록할 수 있습니다.
        </div>
      </main>
    </>
  );
}
