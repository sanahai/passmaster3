"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, getSession } from "@/lib/auth";

export type ProfileState = { error?: string; success?: string } | undefined;

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요합니다." };

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name) {
    return { error: "이름을 입력해 주세요." };
  }
  if (name.length > 40) {
    return { error: "이름은 40자 이내로 입력해 주세요." };
  }
  if (phone && !/^[\d\-+()\s]{8,20}$/.test(phone)) {
    return { error: "연락처 형식을 확인해 주세요." };
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name,
      phone: phone || null,
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  revalidatePath("/mypage");
  revalidatePath("/dashboard");

  return { success: "내 정보가 저장되었습니다." };
}
