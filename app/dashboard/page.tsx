import Link from "next/link";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { computeProgressBars, nextStepKey } from "@/lib/progress";

export default async function DashboardPage() {
  const session = await requireSession("/dashboard");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  const progresses = await prisma.learningProgress.findMany({
    where: { userId: session.userId },
  });
  const progByCourse = new Map(progresses.map((p) => [p.courseId, p]));

  const visible = enrollments.filter((e) => e.status !== "cancelled" && !e.userDeleted);

  const STATUS_LABEL: Record<string, string> = {
    pending: "입금/승인 대기 중",
    active: "수강중",
    expired: "수강 만료",
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-1 text-3xl font-bold text-beauty-neutral">
          안녕하세요, {session.name}님 👋
        </h1>
        <p className="mb-8 text-beauty-gray">오늘도 합격을 향해 한 걸음 더!</p>

        {/* 무료체험 배너 */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-card bg-gradient-to-r from-primary to-primary-light p-6 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">🎁 무료체험 100문제</h2>
            <p className="text-sm text-primary-pale">결제 전, 100문제로 실력을 확인해 보세요.</p>
          </div>
          <Link href="/trial" className="rounded-btn bg-white px-5 py-2.5 font-bold text-primary hover:bg-primary-pale">
            무료체험 풀기
          </Link>
        </div>

        <h2 className="mb-4 text-xl font-bold text-beauty-neutral">내 과정</h2>
        {visible.length === 0 ? (
          <div className="card mb-8 text-center">
            <p className="mb-4 text-beauty-gray">아직 신청한 과정이 없습니다.</p>
            <Link href="/enroll" className="btn-primary">과정 둘러보기</Link>
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {visible.map((e) => {
              const isActive = e.status === "active";
              const prog = progByCourse.get(e.courseId) ?? null;
              const { overallPct, roundMockPct } = computeProgressBars(
                e.course.slug,
                prog,
                prog?.curStepKey ?? "",
                prog?.curStepPct ?? 0
              );
              const next = nextStepKey(e.course.slug, prog);
              const daysLeft = e.expiresAt
                ? Math.max(0, Math.ceil((e.expiresAt.getTime() - Date.now()) / 86400000))
                : null;
              return (
                <div key={e.id} className={`card ${!isActive ? "bg-gray-50" : ""}`}>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-beauty-neutral">{e.course.name}</h3>
                    {isActive && daysLeft !== null ? (
                      <span className="rounded-full bg-primary-pale px-2.5 py-0.5 text-xs font-semibold text-primary">
                        D-{daysLeft}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-beauty-gray">
                        {STATUS_LABEL[e.status] || e.status}
                      </span>
                    )}
                  </div>

                  {isActive ? (
                    <>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-beauty-gray">전체 진행률</span>
                        <span className="font-bold text-primary">{overallPct}%</span>
                      </div>
                      <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-primary-pale">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${overallPct}%` }} />
                      </div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-beauty-gray">회차·모의고사 진행률</span>
                        <span className="font-bold text-primary-accent">{roundMockPct}%</span>
                      </div>
                      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-primary-pale">
                        <div
                          className="h-full rounded-full bg-primary-accent"
                          style={{ width: `${roundMockPct}%` }}
                        />
                      </div>
                      {next && (
                        <p className="mb-4 text-sm text-beauty-gray">
                          다음 단계: <span className="font-semibold text-beauty-neutral">{next.label}</span>
                        </p>
                      )}
                      <Link href={`/learn/${e.course.slug}`} className="btn-primary w-full">
                        학습 계속하기
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="mb-4 text-sm text-beauty-gray">
                        {e.status === "pending"
                          ? "관리자 승인 후 학습을 시작할 수 있습니다."
                          : "현재 학습할 수 없는 상태입니다."}
                      </p>
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-btn bg-gray-300 px-4 py-2.5 text-sm font-bold text-white"
                      >
                        {e.status === "pending" ? "승인 대기 중" : "학습 불가"}
                      </button>
                      {e.status === "pending" && (
                        <Link
                          href={`/enroll/${e.course.slug}/payment`}
                          className="btn-outline mt-2 w-full text-center"
                        >
                          결제 안내 보기
                        </Link>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
