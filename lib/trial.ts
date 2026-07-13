import { prisma } from "@/lib/prisma";

/** 과정별 무료체험 완료 여부 (DB 기록 + 기존 풀이 이력 보정) */
export async function hasCompletedTrial(
  userId: number,
  courseId: number
): Promise<boolean> {
  const completed = await prisma.trialCompletion.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (completed) return true;

  const freeCount = await prisma.question.count({
    where: { courseId, isFree: true, isActive: true },
  });
  if (freeCount === 0) return false;

  const answered = await prisma.userAnswer.count({
    where: {
      userId,
      sessionType: "trial",
      question: { courseId, isFree: true, isActive: true },
    },
  });
  return answered >= freeCount;
}

export async function getCompletedTrialCourseIds(
  userId: number
): Promise<Set<number>> {
  const [completions, courses] = await Promise.all([
    prisma.trialCompletion.findMany({
      where: { userId },
      select: { courseId: true },
    }),
    prisma.course.findMany({
      where: { isActive: true },
      select: { id: true },
    }),
  ]);

  const completed = new Set(completions.map((c) => c.courseId));
  const pending = courses.filter((c) => !completed.has(c.id));
  if (pending.length === 0) return completed;

  const courseIds = pending.map((c) => c.id);
  const [freeCounts, trialAnswers] = await Promise.all([
    prisma.question.groupBy({
      by: ["courseId"],
      where: { isFree: true, isActive: true, courseId: { in: courseIds } },
      _count: { _all: true },
    }),
    prisma.userAnswer.findMany({
      where: {
        userId,
        sessionType: "trial",
        question: { isFree: true, isActive: true, courseId: { in: courseIds } },
      },
      select: { question: { select: { courseId: true } } },
    }),
  ]);

  const freeByCourse = new Map(freeCounts.map((f) => [f.courseId, f._count._all]));
  const answeredByCourse = new Map<number, number>();
  for (const row of trialAnswers) {
    const cid = row.question.courseId;
    answeredByCourse.set(cid, (answeredByCourse.get(cid) ?? 0) + 1);
  }

  for (const courseId of courseIds) {
    const freeCount = freeByCourse.get(courseId) ?? 0;
    const answered = answeredByCourse.get(courseId) ?? 0;
    if (freeCount > 0 && answered >= freeCount) completed.add(courseId);
  }

  return completed;
}

export async function recordTrialCompletion(
  userId: number,
  courseId: number
): Promise<void> {
  await prisma.trialCompletion.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });
}
