"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";

export type AdminInquiryState = { error?: string; success?: string } | undefined;

export async function replyInquiryAction(
  _prev: AdminInquiryState,
  formData: FormData
): Promise<AdminInquiryState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const reply = String(formData.get("reply") || "").trim();

  if (!id) return { error: "문의 ID가 올바르지 않습니다." };
  if (!reply || reply.length < 2) return { error: "답변을 2자 이상 입력해 주세요." };
  if (reply.length > 3000) return { error: "답변은 3000자 이내로 입력해 주세요." };

  const inquiry = await prisma.supportInquiry.findUnique({ where: { id } });
  if (!inquiry) return { error: "문의를 찾을 수 없습니다." };

  await prisma.supportInquiry.update({
    where: { id },
    data: {
      reply,
      status: "answered",
      repliedAt: new Date(),
    },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/support/inquiries");
  return { success: "답변이 등록되었습니다." };
}

export async function setInquiryStatusAction(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "");
  const allowed = ["pending", "answered", "closed"];
  if (!id || !allowed.includes(status)) return;

  const data: { status: string; repliedAt?: Date | null } = { status };
  if (status === "pending") {
    data.repliedAt = null;
  }

  await prisma.supportInquiry.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/support/inquiries");
}

export async function deleteInquiryAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.supportInquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/support/inquiries");

  const redirectTo = String(formData.get("redirectTo") || "");
  if (redirectTo.startsWith("/admin/inquiries")) {
    redirect(redirectTo);
  }
}
