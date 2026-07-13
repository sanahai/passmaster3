import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "./auth";

/** 무료체험 진입 전 회원가입(또는 로그인) 유도 URL */
export function trialAuthRedirect(returnPath: string): string {
  return `/signup?redirect=${encodeURIComponent(returnPath)}`;
}

/** 무료체험은 로그인 회원만 이용 가능 — 비회원은 회원가입으로 안내 */
export async function requireTrialSession(returnPath: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect(trialAuthRedirect(returnPath));
  }
  return session;
}

export function isTrialPath(pathname: string): boolean {
  return pathname === "/trial" || pathname.startsWith("/trial/");
}
