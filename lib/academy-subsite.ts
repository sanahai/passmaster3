import { notFound, redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getSession } from "./auth";
import { isAcademyActive, type AcademyPortal } from "./academy-portal";
import { getBrand } from "./brand";
import { subsiteBase, subsitePath } from "./academy-subsite-paths";

const STAFF_ROLES = new Set(["owner", "teacher", "branch_admin"]);

export type SubsiteContext = {
  academy: AcademyPortal;
  subdomain: string;
  session: NonNullable<Awaited<ReturnType<typeof getSession>>>;
  user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
};

export async function resolveSubsiteAcademy(subdomain: string) {
  const academy = await prisma.academy.findUnique({
    where: { subdomain: subdomain.toLowerCase().trim() },
  });
  if (!academy) return null;
  if (!isAcademyActive(academy)) return { academy, expired: true as const };
  return { academy, expired: false as const };
}

export async function requireSubsiteAcademy(subdomain: string) {
  const resolved = await resolveSubsiteAcademy(subdomain);
  if (!resolved) notFound();
  return resolved;
}

export async function requireSubsiteStudent(subdomain: string): Promise<SubsiteContext> {
  const session = await getSession();
  const loginRedirect = `/login?redirect=${encodeURIComponent(subsitePath(subdomain, "/dashboard"))}`;
  if (!session) redirect(loginRedirect);

  const resolved = await requireSubsiteAcademy(subdomain);
  if (resolved.expired) redirect(subsiteBase(subdomain));

  const { academy } = resolved;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect(loginRedirect);

  if (STAFF_ROLES.has(user.role)) {
    redirect(subsitePath(subdomain, "/admin"));
  }

  if (user.academyId !== academy.id) {
    if (academy.code) {
      redirect(`/signup?academyCode=${encodeURIComponent(academy.code)}`);
    }
    redirect(subsiteBase(subdomain));
  }

  return { academy, subdomain, session, user };
}

export async function requireSubsiteStaff(subdomain: string): Promise<SubsiteContext> {
  const session = await getSession();
  const loginRedirect = `/login?redirect=${encodeURIComponent(subsitePath(subdomain, "/admin"))}`;
  if (!session) redirect(loginRedirect);

  const resolved = await requireSubsiteAcademy(subdomain);
  if (resolved.expired) redirect(subsiteBase(subdomain));

  const { academy } = resolved;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !STAFF_ROLES.has(user.role) || user.academyId !== academy.id) {
    redirect(subsitePath(subdomain, "/dashboard"));
  }

  return { academy, subdomain, session, user };
}

export async function getStudentSubsiteStats(userId: number) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [answers, weekAnswers, wrongCount, enrollments] = await Promise.all([
    prisma.userAnswer.findMany({
      where: { userId, isCorrect: { not: null } },
      select: { isCorrect: true },
    }),
    prisma.userAnswer.count({
      where: { userId, answeredAt: { gte: sevenDaysAgo } },
    }),
    prisma.wrongNote.count({ where: { userId, isResolved: false } }),
    prisma.enrollment.findMany({
      where: { userId, status: "active", userDeleted: false },
      include: { course: true },
    }),
  ]);

  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const avgScore = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { totalAnswered: total, weekAnswers, wrongCount, avgScore, enrollments };
}

export function subsiteThemeStyle(academy: { primaryColor: string }, brandKey?: string | null) {
  const brand = getBrand(brandKey);
  const primary = academy.primaryColor || brand.primary;
  return {
    "--subsite-primary": primary,
    "--subsite-accent": brand.accent,
    "--subsite-student-accent": brand.studentAccent,
    "--subsite-admin-bg": brand.adminBg,
  } as Record<string, string>;
}

export { subsiteBase, subsitePath } from "./academy-subsite-paths";
