import { prisma } from "./prisma";
import { getCourseConfig, MOCK_CONFIG, type SubjectRatio } from "./courses";
import { quizOrderSeed } from "./quiz";
import { seededShuffle } from "./shuffle";

type QLite = { id: number; difficulty: string; subject: string | null };

function difficultyBucket(value: string): "low" | "medium" | "high" {
  const v = value.toLowerCase();
  if (v === "low" || v === "easy" || v === "1") return "low";
  if (v === "high" || v === "hard" || v === "3") return "high";
  return "medium";
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

/** DB 문제은행 과목 분포로 출제 비율 자동 산출 (lib/courses.ts 미정의 과정용) */
function subjectRatiosFromPool(pool: QLite[]): SubjectRatio[] {
  if (pool.length === 0) return [];
  const counts = new Map<string, number>();
  for (const q of pool) {
    const subject = q.subject?.trim() || "기타";
    counts.set(subject, (counts.get(subject) ?? 0) + 1);
  }
  const total = pool.length;
  return Array.from(counts.entries()).map(([subject, count]) => ({
    subject,
    ratio: count / total,
  }));
}

/** 이전 회차 모의고사에서 이미 출제된 문제 ID */
export async function getPriorMockQuestionIds(
  userId: number,
  courseId: number,
  mockNumber: number
): Promise<number[]> {
  const sessions = await prisma.mockSession.findMany({
    where: { userId, courseId, mockNumber: { lt: mockNumber } },
    select: { questionIds: true },
  });
  const used = new Set<number>();
  for (const s of sessions) {
    if (!s.questionIds) continue;
    try {
      for (const id of JSON.parse(s.questionIds) as number[]) used.add(id);
    } catch {
      /* ignore malformed */
    }
  }
  return Array.from(used);
}

function selectFromPool(
  pool: QLite[],
  subject: string,
  totalQ: number,
  mock: { easy: number; normal: number; hard: number }
): number[] {
  const subjectQs = pool.filter((q) => q.subject === subject);
  const easyQ = Math.round(totalQ * mock.easy);
  const normalQ = Math.round(totalQ * mock.normal);
  const hardQ = totalQ - easyQ - normalQ;

  const byDiff = (bucket: "low" | "medium" | "high") =>
    subjectQs.filter((q) => difficultyBucket(q.difficulty) === bucket);

  const chosen = [
    ...pickRandom(byDiff("low"), easyQ),
    ...pickRandom(byDiff("medium"), normalQ),
    ...pickRandom(byDiff("high"), hardQ),
  ].map((q) => q.id);

  if (chosen.length < totalQ) {
    const remaining = subjectQs.filter((q) => !chosen.includes(q.id)).map((q) => q.id);
    chosen.push(...pickRandom(remaining, totalQ - chosen.length));
  }
  return chosen;
}

async function loadMockQuestionPool(courseId: number): Promise<QLite[]> {
  let rows = await prisma.question.findMany({
    where: { courseId, isActive: true, isFree: false },
    select: { id: true, subject: true, difficulty: true },
  });
  if (rows.length === 0) {
    rows = await prisma.question.findMany({
      where: { courseId, isActive: true },
      select: { id: true, subject: true, difficulty: true },
    });
  }
  return rows;
}

// 모의고사 문제 60문항을 과목 비율 + 난이도 비율에 맞게 선정 (이전 회차 출제 ID 제외)
export async function generateMockQuestionIds(
  courseId: number,
  courseSlug: string,
  mockNumber: number,
  userId: number,
  total = 60
): Promise<number[]> {
  const mock = MOCK_CONFIG[mockNumber];
  if (!mock) return [];

  const excludeIds = await getPriorMockQuestionIds(userId, courseId, mockNumber);
  const excludeSet = new Set(excludeIds);

  const allQuestions = await loadMockQuestionPool(courseId);
  if (allQuestions.length === 0) return [];

  const freshPool = allQuestions.filter((q) => !excludeSet.has(q.id));
  const poolForPlan = freshPool.length > 0 ? freshPool : allQuestions;

  const config = getCourseConfig(courseSlug);
  const subjectPlan =
    config?.subjects?.length ? config.subjects : subjectRatiosFromPool(poolForPlan);
  if (subjectPlan.length === 0) return [];

  const selected: number[] = [];

  for (const { subject, ratio } of subjectPlan) {
    selected.push(...selectFromPool(poolForPlan, subject, Math.round(total * ratio), mock));
  }

  if (selected.length < total) {
    const remaining = poolForPlan
      .filter((q) => !selected.includes(q.id))
      .map((q) => q.id);
    selected.push(...pickRandom(remaining, total - selected.length));
  }

  if (selected.length < total) {
    const remaining = allQuestions
      .filter((q) => !selected.includes(q.id))
      .map((q) => q.id);
    selected.push(...pickRandom(remaining, total - selected.length));
  }

  const unique = Array.from(new Set(selected)).slice(0, total);
  const orderSeed = quizOrderSeed(courseId, userId, 100 + mockNumber);
  return seededShuffle(unique, orderSeed);
}
