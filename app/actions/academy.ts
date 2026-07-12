"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import {
  generateUniqueAcademyCode,
  generateUniqueSubdomain,
  linkStudentToAcademy,
  TIER_MAX_TEACHERS,
  type AcademyTier,
} from "@/lib/academy";
import { sendTeacherInviteEmail, sendAcademyOwnerInviteEmail } from "@/lib/email";
import { absoluteUrl } from "@/lib/site-url";
import { requireAcademyOwner, requireAcademyStaff } from "@/lib/academy-access";
import crypto from "crypto";

export async function completeAcademySetupAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();

  if (!token || password.length < 8 || !/[0-9]/.test(password)) {
    return { error: "비밀번호는 8자 이상, 숫자 1개 이상 포함해야 합니다." };
  }

  const invite = await prisma.academyInvite.findUnique({
    where: { token },
    include: { academy: true },
  });
  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return { error: "유효하지 않거나 만료된 초대 링크입니다." };
  }

  let user = await prisma.user.findUnique({ where: { email: invite.email.toLowerCase() } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: invite.email.toLowerCase(),
        name: name || invite.email.split("@")[0],
        passwordHash: await hashPassword(password),
        role: invite.role,
        academyId: invite.academyId,
        emailVerified: true,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(password),
        role: invite.role,
        academyId: invite.academyId,
        name: name || user.name,
      },
    });
  }

  const updates: { code?: string } = {};
  if (invite.role === "owner" && !invite.academy.code) {
    updates.code = await generateUniqueAcademyCode();
  }

  if (Object.keys(updates).length) {
    await prisma.academy.update({ where: { id: invite.academyId }, data: updates });
  }

  await prisma.academyInvite.update({
    where: { id: invite.id },
    data: { usedAt: new Date() },
  });

  redirect("/login?redirect=/academy/dashboard");
}

export async function registerAcademyCodeAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const { requireSession } = await import("@/lib/access");
  const session = await requireSession("/mypage");
  const code = String(formData.get("code") || "").trim();
  try {
    await linkStudentToAcademy(session.userId, code);
    revalidatePath("/mypage");
    revalidatePath("/dashboard");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록 실패" };
  }
}

export async function createGroupAction(formData: FormData): Promise<void> {
  const { user, academy } = await requireAcademyOwner();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await prisma.academyGroup.create({
    data: { academyId: academy.id, name, branchId: user.branchId ?? undefined },
  });
  revalidatePath("/academy/groups");
}

export async function deleteGroupAction(formData: FormData): Promise<void> {
  await requireAcademyOwner();
  const id = Number(formData.get("id"));
  await prisma.academyGroup.delete({ where: { id } });
  revalidatePath("/academy/groups");
}

export async function assignStudentsToGroupAction(formData: FormData): Promise<void> {
  await requireAcademyOwner();
  const groupId = Number(formData.get("groupId"));
  const ids = formData
    .getAll("studentIds")
    .map((v) => Number(v))
    .filter(Boolean);

  await prisma.user.updateMany({
    where: { id: { in: ids }, role: "student" },
    data: { groupId },
  });
  revalidatePath("/academy/groups");
}

export async function inviteTeacherAction(formData: FormData) {
  const { academy } = await requireAcademyOwner();
  if (academy.tier === "basic") return { error: "스탠다드 이상 플랜이 필요합니다." };

  const count = await prisma.user.count({
    where: { academyId: academy.id, role: "teacher" },
  });
  if (count >= TIER_MAX_TEACHERS[academy.tier as AcademyTier]) {
    return { error: "강사 계정 한도를 초과했습니다." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { error: "이메일을 입력하세요." };

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  await prisma.academyInvite.create({
    data: {
      academyId: academy.id,
      email,
      role: "teacher",
      token,
      expiresAt,
    },
  });

  const setupUrl = `/academy/setup?token=${token}`;
  await sendTeacherInviteEmail({ to: email, academyName: academy.name, setupUrl });

  revalidatePath("/academy/teachers");
  return { ok: true, setupUrl };
}

export async function updateAcademySettingsAction(formData: FormData): Promise<void> {
  const { academy } = await requireAcademyOwner();
  const name = String(formData.get("name") || "").trim();
  const logoUrl = String(formData.get("logoUrl") || "").trim();
  const primaryColor = String(formData.get("primaryColor") || "").trim();

  await prisma.academy.update({
    where: { id: academy.id },
    data: {
      ...(name ? { name } : {}),
      ...(logoUrl ? { logoUrl } : {}),
      ...(primaryColor ? { primaryColor } : {}),
    },
  });
  revalidatePath("/academy/settings");
}

export async function createBranchAction(formData: FormData): Promise<void> {
  const { academy } = await requireAcademyOwner();
  if (academy.tier !== "premium") return;

  const name = String(formData.get("name") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const code = crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 8);

  await prisma.academyBranch.create({
    data: { academyId: academy.id, name, address: address || null, code },
  });
  revalidatePath("/academy/branches");
}

/** 골든웨이브 운영용: 학원 + 원장 초대 생성 */
export async function createAcademyWithInviteAction(formData: FormData) {
  const { requireAdmin } = await import("@/lib/access");
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const ownerEmail = String(formData.get("ownerEmail") || "").trim().toLowerCase();
  const tier = String(formData.get("tier") || "basic") as AcademyTier;
  const maxStudents = Number(formData.get("maxStudents") || 15);
  const months = Number(formData.get("months") || 3);
  const subdomainInput = String(formData.get("subdomain") || "").trim() || null;

  const activeUntil = new Date();
  activeUntil.setMonth(activeUntil.getMonth() + months);

  const subdomain = await generateUniqueSubdomain(name, subdomainInput);

  const academy = await prisma.academy.create({
    data: {
      name,
      tier,
      ownerEmail,
      maxStudents,
      activeUntil,
      subdomain,
      code: await generateUniqueAcademyCode(),
      brand: process.env.NEXT_PUBLIC_BRAND || "passmaster",
    },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);

  await prisma.academyInvite.create({
    data: { academyId: academy.id, email: ownerEmail, role: "owner", token, expiresAt },
  });

  const setupUrl = `/academy/setup?token=${token}`;
  await sendAcademyOwnerInviteEmail({
    to: ownerEmail,
    academyName: name,
    setupUrl,
    code: academy.code,
  });

  return {
    academyId: academy.id,
    setupUrl: absoluteUrl(setupUrl),
    code: academy.code,
    portalUrl: absoluteUrl(`/a/${subdomain}`),
  };
}

export async function deleteCustomQuestionAction(formData: FormData): Promise<void> {
  const { academy } = await requireAcademyOwner();
  const id = Number(formData.get("id"));
  await prisma.academyCustomQuestion.deleteMany({
    where: { id, academyId: academy.id },
  });
  revalidatePath("/academy/questions");
}

export async function uploadCustomQuestionsAction(formData: FormData) {
  const { user, academy } = await requireAcademyStaff();
  if (academy.tier !== "premium") return { error: "프리미엄 플랜이 필요합니다." };

  const file = formData.get("file") as File | null;
  if (!file?.size) return { error: "파일을 선택하세요." };

  const XLSX = await import("xlsx");
  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });

  const data = [];
  for (const row of rows) {
    const subject = String(row["과목"] || row.subject || "").trim();
    const content = String(row["지문"] || row.content || "").trim();
    const o1 = String(row["보기1"] || row.option1 || "").trim();
    const o2 = String(row["보기2"] || row.option2 || "").trim();
    const o3 = String(row["보기3"] || row.option3 || "").trim();
    const o4 = String(row["보기4"] || row.option4 || "").trim();
    const answer = Number(row["정답"] || row.answer || 0);
    const explanation = String(row["해설"] || row.explanation || "").trim();
    if (!content || !o1 || answer < 1 || answer > 4) continue;
    data.push({
      academyId: academy.id,
      subject: subject || null,
      content,
      options: [o1, o2, o3, o4],
      answer,
      explanation: explanation || null,
      createdById: user.id,
    });
  }

  if (data.length === 0) return { error: "유효한 문제가 없습니다. 컬럼 형식을 확인하세요." };

  await prisma.academyCustomQuestion.createMany({ data });
  revalidatePath("/academy/questions");
  return { ok: true, count: data.length };
}
