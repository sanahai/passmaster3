import { prisma } from "./prisma";
import { getAcademyStudents, getStudentAccuracy } from "./academy-stats";
import { formatDateYmd } from "./format-date";

export async function getWeeklyActivity(academyId: number, weeks = 8) {
  const students = await prisma.user.findMany({
    where: { academyId, role: "student" },
    select: { id: true },
  });
  const ids = students.map((s) => s.id);
  const points = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date();
    end.setDate(end.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);

    const answers = await prisma.userAnswer.count({
      where: {
        userId: { in: ids },
        answeredAt: { gte: start, lt: end },
      },
    });

    const active = await prisma.user.count({
      where: {
        id: { in: ids },
        lastActiveAt: { gte: start, lt: end },
      },
    });

    points.push({
      week: `${start.getMonth() + 1}/${start.getDate()}`,
      answers,
      active,
    });
  }
  return points;
}

export async function getAccuracyDistribution(academyId: number) {
  const students = await prisma.user.findMany({
    where: { academyId, role: "student" },
    select: { id: true },
  });

  const buckets = [
    { range: "0-39%", count: 0 },
    { range: "40-59%", count: 0 },
    { range: "60-79%", count: 0 },
    { range: "80-100%", count: 0 },
  ];

  for (const s of students) {
    const acc = await getStudentAccuracy(s.id);
    if (acc < 40) buckets[0].count++;
    else if (acc < 60) buckets[1].count++;
    else if (acc < 80) buckets[2].count++;
    else buckets[3].count++;
  }
  return buckets;
}

export async function buildAcademyReportCsv(academyId: number): Promise<string> {
  const academy = await prisma.academy.findUnique({ where: { id: academyId } });
  const students = await getAcademyStudents(academyId);
  const header = "이름,이메일,반,정답률,풀이수,최근접속,상태\n";
  const rows = students
    .map(
      (s) =>
        `"${s.name}","${s.email}","${s.groupName ?? ""}",${s.accuracy},${s.answerCount},"${formatDateYmd(s.lastActive)}","${s.status.label}"`,
    )
    .join("\n");
  return `\uFEFF${header}${rows}\n학원,${academy?.name ?? ""},생성일,${new Date().toISOString().slice(0, 10)}`;
}
