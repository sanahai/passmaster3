import { prisma } from "./prisma";
import { getCourseConfig, MOCK_CONFIG } from "./courses";

type QLite = { id: number; difficulty: string };

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

// 모의고사 문제 60문항을 과목 비율 + 난이도 비율에 맞게 선정 (스펙 Chapter 4-6)
export async function generateMockQuestionIds(
  courseId: number,
  courseSlug: string,
  mockNumber: number,
  total = 60
): Promise<number[]> {
  const config = getCourseConfig(courseSlug);
  const mock = MOCK_CONFIG[mockNumber];
  if (!config || !mock) return [];

  const allQuestions = (await prisma.question.findMany({
    where: { courseId, isActive: true, isFree: false },
    select: { id: true, subject: true, difficulty: true },
  })) as (QLite & { subject: string | null })[];

  const selected: number[] = [];

  for (const { subject, ratio } of config.subjects) {
    const subjectQs = allQuestions.filter((q) => q.subject === subject);
    const totalQ = Math.round(total * ratio);
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

    // 난이도별 문제가 부족하면 같은 과목 내 다른 문제로 보충
    if (chosen.length < totalQ) {
      const remaining = subjectQs
        .filter((q) => !chosen.includes(q.id))
        .map((q) => q.id);
      chosen.push(...pickRandom(remaining, totalQ - chosen.length));
    }
    selected.push(...chosen);
  }

  // 60문항이 안 되면 전체에서 보충
  if (selected.length < total) {
    const remaining = allQuestions
      .filter((q) => !selected.includes(q.id))
      .map((q) => q.id);
    selected.push(...pickRandom(remaining, total - selected.length));
  }

  return selected.slice(0, total);
}
