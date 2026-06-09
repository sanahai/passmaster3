"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// 현재 동의 약관 버전 — 약관 변경 시 올려서 재동의를 유도
// (use server 파일은 async 함수만 export 가능하므로 모듈 내부 상수로 둠)
const TERMS_VERSION = "v1.0";

// 학습/결제 전 동의 기록 저장 (법적 방어용)
export async function recordConsentAction(
  mode: "trial" | "paid",
  examCategory?: string
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  await prisma.userConsent.create({
    data: {
      userId: session.userId,
      consentMode: mode,
      termsVersion: TERMS_VERSION,
      examCategory: examCategory ?? null,
    },
  });

  return { ok: true };
}
