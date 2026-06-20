import { prisma } from "./prisma";

export type AcademyTier = "basic" | "standard" | "premium";

export const TIER_LABEL: Record<AcademyTier, string> = {
  basic: "베이직",
  standard: "스탠다드",
  premium: "프리미엄",
};

export const TIER_MAX_TEACHERS: Record<AcademyTier, number> = {
  basic: 0,
  standard: 3,
  premium: 999,
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateAcademyCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export async function generateUniqueAcademyCode(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const code = generateAcademyCode();
    const exists = await prisma.academy.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error("학원 코드 생성 실패");
}

export function slugifySubdomain(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return slug || `academy-${Math.random().toString(36).slice(2, 8)}`;
}

export async function generateUniqueSubdomain(name: string, preferred?: string | null): Promise<string> {
  const base = preferred?.trim() ? slugifySubdomain(preferred) : slugifySubdomain(name);
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const exists = await prisma.academy.findUnique({ where: { subdomain: candidate } });
    if (!exists) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function resolveAcademyByCode(code: string) {
  return prisma.academy.findUnique({
    where: { code: code.toUpperCase().trim() },
  });
}

export async function linkStudentToAcademy(userId: number, code: string) {
  const academy = await resolveAcademyByCode(code);
  if (!academy) throw new Error("유효하지 않은 학원 코드입니다.");
  if (academy.activeUntil < new Date()) throw new Error("만료된 학원 코드입니다.");

  const count = await prisma.user.count({
    where: { academyId: academy.id, role: "student" },
  });
  if (count >= academy.maxStudents) {
    throw new Error("학원 정원이 초과되었습니다. 학원에 문의하세요.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { academyId: academy.id, role: "student" },
  });
  return academy;
}

export function tierAtLeast(tier: string, required: AcademyTier): boolean {
  const order: AcademyTier[] = ["basic", "standard", "premium"];
  return order.indexOf(tier as AcademyTier) >= order.indexOf(required);
}

export function studentStatusBadge(
  accuracy: number,
  lastActive: Date | null,
): { label: string; className: string } {
  const daysSince = lastActive
    ? Math.floor((Date.now() - lastActive.getTime()) / 86400000)
    : 999;
  if (daysSince >= 14) return { label: "위험", className: "bg-red-50 text-red-700" };
  if (accuracy >= 80) return { label: "우수", className: "bg-emerald-50 text-emerald-700" };
  if (accuracy >= 60 && daysSince < 7)
    return { label: "보통", className: "bg-blue-50 text-blue-700" };
  return { label: "주의", className: "bg-amber-50 text-amber-700" };
}
