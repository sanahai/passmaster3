import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getSession, type SessionPayload } from "./auth";

// 로그인 필수 가드
export async function requireSession(redirectTo?: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect(`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`);
  }
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession("/admin");
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}

// 활성 수강 등록 조회 (slug 기준)
export async function getActiveEnrollment(userId: number, courseSlug: string) {
  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return null;
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });
  return { course, enrollment };
}

// 수강 승인된 사용자만 접근. 아니면 리디렉션.
// 관리자는 문제 검토 목적으로 수강 등록 없이도 접근 가능(isAdmin=true).
export async function requireEnrollment(courseSlug: string) {
  const session = await requireSession(`/learn/${courseSlug}`);
  const data = await getActiveEnrollment(session.userId, courseSlug);
  if (!data?.course) redirect("/dashboard");
  const isAdmin = session.role === "admin";
  if (
    !isAdmin &&
    (!data.enrollment || data.enrollment.status !== "active" || data.enrollment.userDeleted)
  ) {
    redirect(`/enroll/${courseSlug}`);
  }
  return { session, course: data.course, enrollment: data.enrollment, isAdmin };
}

// 학습 진행 상태 조회/생성
export async function getOrCreateProgress(userId: number, courseId: number) {
  return prisma.learningProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });
}
