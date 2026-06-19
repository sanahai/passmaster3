"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  generateUniqueAcademyCode,
  type AcademyTier,
} from "@/lib/academy";
import { sendAcademyOwnerInviteEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/site-url";

async function requireAdmin() {
  const { requireAdmin } = await import("@/lib/access");
  await requireAdmin();
}

function revalidateAcademyAdmin(id?: number) {
  revalidatePath("/admin/academies");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/academies/${id}`);
}

export async function updateAcademyAdminAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const tier = String(formData.get("tier") || "basic") as AcademyTier;
  const maxStudents = Number(formData.get("maxStudents") || 15);
  const ownerEmail = String(formData.get("ownerEmail") || "").trim().toLowerCase();
  const ownerPhone = String(formData.get("ownerPhone") || "").trim();
  const subdomain = String(formData.get("subdomain") || "").trim() || null;
  const activeUntilStr = String(formData.get("activeUntil") || "").trim();

  if (!id || !name || !ownerEmail) return;

  const activeUntil = activeUntilStr ? new Date(activeUntilStr) : undefined;

  await prisma.academy.update({
    where: { id },
    data: {
      name,
      tier,
      maxStudents,
      ownerEmail,
      ownerPhone: ownerPhone || null,
      subdomain: tier === "premium" ? subdomain : null,
      ...(activeUntil ? { activeUntil } : {}),
    },
  });

  revalidateAcademyAdmin(id);
}

export async function extendAcademyAdminAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const months = Number(formData.get("months") || 0);
  if (!id || months <= 0) return;

  const academy = await prisma.academy.findUnique({ where: { id } });
  if (!academy) return;

  const base = academy.activeUntil > new Date() ? academy.activeUntil : new Date();
  const activeUntil = new Date(base);
  activeUntil.setMonth(activeUntil.getMonth() + months);

  await prisma.academy.update({ where: { id }, data: { activeUntil } });
  revalidateAcademyAdmin(id);
}

export async function resendOwnerInviteAdminAction(formData: FormData) {
  await requireAdmin();
  const academyId = Number(formData.get("academyId"));
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!academyId || !email) return { error: "학원 ID와 이메일이 필요합니다." };

  const academy = await prisma.academy.findUnique({ where: { id: academyId } });
  if (!academy) return { error: "학원을 찾을 수 없습니다." };

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  await prisma.academyInvite.create({
    data: { academyId, email, role: "owner", token, expiresAt },
  });

  const setupUrl = `/academy/setup?token=${token}`;
  await sendAcademyOwnerInviteEmail({
    to: email,
    academyName: academy.name,
    setupUrl,
    code: academy.code,
  });

  revalidateAcademyAdmin(academyId);
  return { ok: true, setupUrl: absoluteUrl(setupUrl) };
}

export async function deleteAcademyAdminAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.user.updateMany({
    where: { academyId: id, role: { in: ["owner", "teacher", "branch_admin"] } },
    data: { role: "student", academyId: null, groupId: null, branchId: null },
  });
  await prisma.user.updateMany({
    where: { academyId: id },
    data: { academyId: null, groupId: null, branchId: null },
  });

  await prisma.academy.delete({ where: { id } });
  revalidateAcademyAdmin();
  redirect("/admin/academies");
}

export async function regenerateAcademyCodeAdminAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.academy.update({
    where: { id },
    data: { code: await generateUniqueAcademyCode() },
  });
  revalidateAcademyAdmin(id);
}
