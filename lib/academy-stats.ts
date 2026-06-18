import { prisma } from "./prisma";
import { studentStatusBadge } from "./academy";
import { coerceDate } from "./format-date";

export type StudentRow = {
  id: number;
  name: string;
  email: string;
  lastActive: Date | string | null;
  answerCount: number;
  accuracy: number;
  status: { label: string; className: string };
  groupName: string | null;
};

export async function getStudentAccuracy(userId: number): Promise<number> {
  const answers = await prisma.userAnswer.findMany({
    where: { userId, isCorrect: { not: null } },
    select: { isCorrect: true },
  });
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
}

export async function getAcademyStats(academyId: number) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const students = await prisma.user.findMany({
    where: { academyId, role: "student" },
    select: { id: true, lastActiveAt: true },
  });

  const total = students.length;
  const active7d = students.filter(
    (s) => s.lastActiveAt && s.lastActiveAt >= sevenDaysAgo,
  ).length;
  const inactive7d = total - active7d;

  let accuracySum = 0;
  for (const s of students) {
    accuracySum += await getStudentAccuracy(s.id);
  }
  const avgAccuracy = total > 0 ? Math.round(accuracySum / total) : 0;

  return { total, active7d, inactive7d, avgAccuracy };
}

export async function getAcademyStudents(
  academyId: number,
  opts?: { groupId?: number; branchId?: number; teacherId?: number; q?: string; filter?: string },
): Promise<StudentRow[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const users = await prisma.user.findMany({
    where: {
      academyId,
      role: "student",
      ...(opts?.groupId ? { groupId: opts.groupId } : {}),
      ...(opts?.branchId ? { branchId: opts.branchId } : {}),
      ...(opts?.teacherId ? { group: { teacherId: opts.teacherId } } : {}),
      ...(opts?.q ? { name: { contains: opts.q, mode: "insensitive" } } : {}),
    },
    include: { group: true },
    orderBy: { name: "asc" },
  });

  const rows: StudentRow[] = [];
  for (const u of users) {
    const answerCount = await prisma.userAnswer.count({ where: { userId: u.id } });
    const accuracy = await getStudentAccuracy(u.id);
    const status = studentStatusBadge(accuracy, u.lastActiveAt);
    rows.push({
      id: u.id,
      name: u.name,
      email: u.email,
      lastActive: u.lastActiveAt,
      answerCount,
      accuracy,
      status,
      groupName: u.group?.name ?? null,
    });
  }

  if (opts?.filter === "active") {
    return rows.filter((r) => {
      const d = coerceDate(r.lastActive);
      return d !== null && d >= sevenDaysAgo;
    });
  }
  if (opts?.filter === "warning") {
    return rows.filter((r) => r.status.label === "주의" || r.status.label === "위험");
  }
  return rows;
}

export async function getStudentDetail(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { group: true, academy: true },
  });
  if (!user) return null;

  const answers = await prisma.userAnswer.findMany({
    where: { userId, isCorrect: { not: null } },
    include: { question: { select: { subject: true } } },
  });

  const bySubject: Record<string, { total: number; correct: number }> = {};
  for (const a of answers) {
    const sub = a.question.subject || "기타";
    if (!bySubject[sub]) bySubject[sub] = { total: 0, correct: 0 };
    bySubject[sub].total++;
    if (a.isCorrect) bySubject[sub].correct++;
  }

  const subjectStats = Object.entries(bySubject).map(([subject, v]) => ({
    subject,
    accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
  }));

  const progress = await prisma.learningProgress.findMany({
    where: { userId },
    include: { course: { select: { name: true } } },
  });

  const mocks = await prisma.mockSession.findMany({
    where: { userId, completedAt: { not: null } },
    include: { course: { select: { name: true } } },
    orderBy: { completedAt: "desc" },
    take: 20,
  });

  const wrongNotes = await prisma.wrongNote.findMany({
    where: { userId, isResolved: false },
    include: { question: { select: { id: true, subject: true, content: true } } },
    orderBy: { lastWrongAt: "desc" },
    take: 10,
  });

  const accuracy = await getStudentAccuracy(userId);

  return {
    user,
    accuracy,
    answerCount: answers.length,
    subjectStats,
    progress,
    mocks,
    wrongNotes,
  };
}

export async function getGroupStats(academyId: number) {
  const groups = await prisma.academyGroup.findMany({
    where: { academyId },
    include: { members: { where: { role: "student" } } },
  });
  const result = [];
  for (const g of groups) {
    let sum = 0;
    for (const m of g.members) sum += await getStudentAccuracy(m.id);
    result.push({
      id: g.id,
      name: g.name,
      count: g.members.length,
      avgScore: g.members.length ? Math.round(sum / g.members.length) : 0,
    });
  }
  return result;
}

export async function getAtRiskStudents(academyId: number, limit = 10) {
  const rows = await getAcademyStudents(academyId);
  return rows
    .filter((r) => r.status.label === "주의" || r.status.label === "위험" || r.accuracy < 50)
    .slice(0, limit);
}
