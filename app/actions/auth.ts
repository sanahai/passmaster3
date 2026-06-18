"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { linkStudentToAcademy } from "@/lib/academy";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
} from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");
  const phone = String(formData.get("phone") || "").trim();
  const academyCode = String(formData.get("academyCode") || "").trim();

  if (!name || !email || !password) {
    return { error: "이름, 이메일, 비밀번호를 모두 입력해 주세요." };
  }
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { error: "비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다." };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "이미 가입된 이메일입니다." };
  }

  if (academyCode) {
    const { resolveAcademyByCode } = await import("@/lib/academy");
    const academy = await resolveAcademyByCode(academyCode);
    if (!academy) return { error: "유효하지 않은 학원 코드입니다." };
    if (academy.activeUntil < new Date()) return { error: "만료된 학원 코드입니다." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await hashPassword(password),
      // MVP: SMTP 미연동으로 이메일 인증을 자동 완료 처리
      emailVerified: true,
    },
  });

  if (academyCode) {
    try {
      await linkStudentToAcademy(user.id, academyCode);
    } catch (e) {
      await prisma.user.delete({ where: { id: user.id } });
      return { error: e instanceof Error ? e.message : "학원 코드 등록 실패" };
    }
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/enroll");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const remember = formData.get("remember") === "on";
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }
  if (!user.emailVerified) {
    return { error: "이메일 인증이 완료되지 않은 계정입니다." };
  }

  await createSession(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    remember,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  });

  const staffRoles = new Set(["owner", "teacher", "branch_admin"]);
  if (user.role === "admin") redirect("/admin");
  if (staffRoles.has(user.role)) redirect("/academy/dashboard");
  redirect(redirectTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
