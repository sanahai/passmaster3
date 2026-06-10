import Link from "next/link";
import Header from "@/components/Header";
import { requireEnrollment, getOrCreateProgress } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { computeSteps, computeProgressBars } from "@/lib/progress";

export default async function LearnHomePage({
  params,
}: {
  params: { slug: string };
}) {
  const { session, course, isAdmin } = await requireEnrollment(params.slug);
  const progress = await getOrCreateProgress(session.userId, course.id);
  const steps = computeSteps(course.slug, progress, isAdmin);
  const { overallPct, roundMockPct } = computeProgressBars(
    course.slug,
    progress,
    progress.curStepKey,
    progress.curStepPct
  );

  // 오답복습 단계의 오답 개수 표시
  const roundWrong = await prisma.wrongNote.count({
    where: {
      userId: session.userId,
      source: { in: ["round2", "round3"] },
      isResolved: false,
      question: { courseId: course.id },
    },
  });
  const mockWrong = await prisma.wrongNote.count({
    where: {
      userId: session.userId,
      source: { in: ["mock1", "mock2", "mock3", "mock4", "mock5", "mock6"] },
      isResolved: false,
      question: { courseId: course.id },
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/dashboard" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
          ← 대시보드
        </Link>
        <h1 className="mb-1 text-3xl font-bold text-beauty-neutral">{course.name}</h1>
        <p className="mb-6 text-beauty-gray">단계별로 잠금 해제하며 학습을 완성하세요.</p>

        {isAdmin && (
          <div className="mb-6 rounded-card border border-primary/30 bg-primary-pale/50 px-4 py-3 text-sm text-beauty-neutral">
            🔍 <b>관리자 검토 모드</b> — 문제 오류 확인을 위해 선행학습 없이 모든 단계에 바로 입장할 수 있습니다.
            (진행률은 검토용이며 수강생 통계에 영향을 주지 않습니다.)
          </div>
        )}

        {/* 진행률 막대 2종 */}
        <div className="card mb-8 space-y-5">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold text-beauty-neutral">
                전체 진행률
                <span className="ml-1 text-xs font-normal text-beauty-gray">(회차·모의고사·복습)</span>
              </span>
              <span className="font-bold text-primary">{overallPct}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-primary-pale">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <span className="font-semibold text-beauty-neutral">
                회차·모의고사 진행률
                <span className="ml-1 text-xs font-normal text-beauty-gray">(복습 제외)</span>
              </span>
              <span className="font-bold text-primary-accent">{roundMockPct}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-primary-pale">
              <div
                className="h-full rounded-full bg-primary-accent transition-all"
                style={{ width: `${roundMockPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 단계 카드 */}
        <div className="space-y-3">
          {steps.map((step) => {
            const wrongCount =
              step.key === "wrong_round" ? roundWrong : step.key === "wrong_mock" ? mockWrong : null;
            const inProgressPct =
              step.state === "current" && step.key === progress.curStepKey
                ? progress.curStepPct
                : 0;

            const card = (
              <div
                className={`flex items-center gap-4 rounded-card border-2 p-4 transition-all ${
                  step.state === "done"
                    ? "border-beauty-success/30 bg-[#E8F5E9]/40"
                    : step.state === "current"
                    ? "border-primary bg-white shadow-card hover:shadow-cardHover"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="text-3xl">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-beauty-neutral">{step.label}</h3>
                    {step.state === "done" && (
                      <span className="text-sm font-bold text-beauty-success">✓ 학습완료</span>
                    )}
                    {inProgressPct > 0 && (
                      <span className="rounded-full bg-primary-accent/15 px-2 py-0.5 text-xs font-bold text-primary-accent">
                        진행 중 {inProgressPct}%
                      </span>
                    )}
                    {step.state === "locked" && <span className="text-sm">🔒</span>}
                  </div>
                  <p className="text-sm text-beauty-gray">
                    {step.desc}
                    {wrongCount !== null && step.state !== "locked" && (
                      <span className="ml-1 font-semibold text-primary">· 오답 {wrongCount}개</span>
                    )}
                  </p>
                  {inProgressPct > 0 && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary-pale">
                      <div
                        className="h-full rounded-full bg-primary-accent"
                        style={{ width: `${inProgressPct}%` }}
                      />
                    </div>
                  )}
                </div>
                {step.state === "current" && (
                  <span className="rounded-btn bg-primary px-4 py-2 text-sm font-bold text-white">
                    {inProgressPct > 0
                      ? "이어하기"
                      : step.key.startsWith("round") || step.key.startsWith("wrong")
                      ? "시작"
                      : "응시"}
                  </span>
                )}
                {step.state === "done" && (
                  <span className="rounded-btn border border-primary px-4 py-2 text-sm font-semibold text-primary">
                    다시 풀기
                  </span>
                )}
              </div>
            );

            if (step.state === "locked") {
              return <div key={step.key}>{card}</div>;
            }
            // 오답복습은 오답이 없으면 비활성 안내 (관리자는 그대로 입장 허용)
            if (wrongCount === 0 && step.state === "current" && !isAdmin) {
              return (
                <div key={step.key} className="relative">
                  {card}
                  <p className="mt-1 pl-4 text-xs text-beauty-gray">
                    복습할 오답이 없습니다. 이전 단계에서 오답이 누적되면 활성화됩니다.
                  </p>
                </div>
              );
            }
            return (
              <Link key={step.key} href={step.href} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
