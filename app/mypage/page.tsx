import Link from "next/link";
import Header from "@/components/Header";
import AcademyCodeForm from "@/components/academy/AcademyCodeForm";
import MyProfileForm from "@/components/mypage/MyProfileForm";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { sortByCourseDisplayOrder } from "@/lib/course-catalog";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const session = await requireSession("/mypage");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true },
  });

  const [activeEnrollments, answered] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: session.userId, status: "active", userDeleted: false },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userAnswer.count({ where: { userId: session.userId } }),
  ]);

  const sortedActive = sortByCourseDisplayOrder(
    activeEnrollments.map((e) => ({ ...e, slug: e.course.slug }))
  );

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1120px] px-4 py-10 sm:px-6 lg:py-12">
        <h1 className="mb-8 text-3xl font-bold text-beauty-neutral">마이페이지</h1>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <section className="card lg:col-span-2">
            <h2 className="mb-1 text-xl font-bold text-beauty-neutral">내 정보</h2>
            <p className="mb-6 text-sm text-beauty-gray">이름과 연락처를 수정할 수 있습니다.</p>
            {user && (
              <MyProfileForm
                name={user.name}
                email={user.email}
                phone={user.phone}
                createdAt={user.createdAt.toLocaleDateString("ko-KR")}
              />
            )}
          </section>

          <section className="card flex flex-col justify-center text-center">
            <div className="text-4xl font-extrabold text-primary">{answered.toLocaleString()}</div>
            <div className="mt-2 text-sm font-semibold text-beauty-neutral">누적 푼 문제</div>
            <p className="mt-2 text-xs text-beauty-gray">무료체험·학습·모의고사 포함</p>
          </section>
        </div>

        <section className="card mb-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-beauty-neutral">수강 중 과정</h2>
              <p className="mt-1 text-sm text-beauty-gray">
                현재 {sortedActive.length}개 과정을 수강하고 있습니다.
              </p>
            </div>
            <Link href="/dashboard" className="text-sm font-semibold text-primary hover:underline">
              내 학습 →
            </Link>
          </div>

          {sortedActive.length === 0 ? (
            <div className="rounded-card border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-beauty-gray">
              수강 중인 과정이 없습니다.{" "}
              <Link href="/enroll" className="font-semibold text-primary hover:underline">
                수강신청
              </Link>
              을 진행해 주세요.
            </div>
          ) : (
            <ul className="space-y-3">
              {sortedActive.map((e) => {
                const daysLeft = e.expiresAt
                  ? Math.max(0, Math.ceil((e.expiresAt.getTime() - Date.now()) / 86400000))
                  : null;
                return (
                  <li
                    key={e.id}
                    className="flex flex-col gap-3 rounded-card border border-gray-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-beauty-neutral">{e.course.name}</p>
                      <p className="mt-1 text-sm text-beauty-gray">
                        {e.expiresAt
                          ? `수강 만료 ${e.expiresAt.toLocaleDateString("ko-KR")}`
                          : "수강 기간 정보 없음"}
                        {daysLeft !== null && ` · D-${daysLeft}`}
                      </p>
                    </div>
                    <Link href={`/learn/${e.course.slug}`} className="btn-primary shrink-0 px-5 py-2.5 text-sm">
                      학습하기
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {user?.role === "student" && (
          <div className="mb-6">
            <AcademyCodeForm currentAcademy={user.academy?.name} />
          </div>
        )}

        <Link href="/mypage/history" className="btn-outline w-full">
          결제·수강 내역 보기
        </Link>
      </main>
    </>
  );
}
