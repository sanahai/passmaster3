"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// 수강생 오류 신고 접수
export async function submitReportAction(
  questionId: number,
  category: string,
  detail: string
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "로그인이 필요합니다." };
  if (!questionId || !detail.trim()) {
    return { ok: false, error: "신고 내용을 입력해 주세요." };
  }

  await prisma.questionReport.create({
    data: {
      questionId,
      userId: session.userId,
      category: category || "other",
      detail: detail.trim().slice(0, 1000),
    },
  });

  return { ok: true };
}
