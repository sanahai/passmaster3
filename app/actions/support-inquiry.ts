"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { INQUIRY_CATEGORIES } from "@/lib/support-inquiry";

export type InquiryState = { error?: string; success?: string } | undefined;

const VALID_CATEGORIES = new Set(INQUIRY_CATEGORIES.map((c) => c.value));

export async function createInquiryAction(
  _prev: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const session = await getSession();
  if (!session) return { error: "로그인이 필요합니다." };

  const category = String(formData.get("category") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!VALID_CATEGORIES.has(category as (typeof INQUIRY_CATEGORIES)[number]["value"])) {
    return { error: "문의 유형을 선택해 주세요." };
  }
  if (!subject || subject.length < 2) {
    return { error: "제목을 2자 이상 입력해 주세요." };
  }
  if (subject.length > 100) {
    return { error: "제목은 100자 이내로 입력해 주세요." };
  }
  if (!content || content.length < 10) {
    return { error: "문의 내용을 10자 이상 입력해 주세요." };
  }
  if (content.length > 2000) {
    return { error: "문의 내용은 2000자 이내로 입력해 주세요." };
  }

  await prisma.supportInquiry.create({
    data: {
      userId: session.userId,
      category,
      subject,
      content,
    },
  });

  revalidatePath("/support/inquiries");
  return { success: "문의가 접수되었습니다. 영업일 기준 순차적으로 답변드립니다." };
}
