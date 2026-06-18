import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getSession } from "./auth";
import { tierAtLeast, type AcademyTier } from "./academy";

const STAFF_ROLES = new Set(["owner", "teacher", "branch_admin"]);

export async function getAcademyContext() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true, branch: true },
  });
  if (!user?.academy) return null;
  return { session, user, academy: user.academy };
}

export async function requireAcademyStaff(redirectTo = "/academy/dashboard") {
  const session = await getSession();
  if (!session) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true, branch: true },
  });

  if (!user?.academy || !STAFF_ROLES.has(user.role)) {
    redirect("/dashboard");
  }
  return { session, user, academy: user.academy };
}

export async function requireAcademyOwner() {
  const ctx = await requireAcademyStaff();
  if (ctx.user.role !== "owner" && ctx.user.role !== "branch_admin") {
    redirect("/academy/dashboard?error=forbidden");
  }
  return ctx;
}

export async function requireAcademyTier(min: AcademyTier, path: string) {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, min)) {
    redirect(`/academy/dashboard?error=upgrade&from=${encodeURIComponent(path)}`);
  }
  return ctx;
}

/** teacher는 담당 반 학생만, branch_admin은 지점만, owner는 전체 */
export function studentScopeFilter(user: {
  role: string;
  academyId: number | null;
  branchId: number | null;
  id: number;
}) {
  if (user.role === "owner") return { academyId: user.academyId! };
  if (user.role === "branch_admin") return { academyId: user.academyId!, branchId: user.branchId! };
  if (user.role === "teacher") {
    return { academyId: user.academyId!, teacherId: user.id };
  }
  return { academyId: user.academyId! };
}
