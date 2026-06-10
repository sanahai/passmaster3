"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/access";

export async function approveEnrollmentAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!enrollment) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + enrollment.course.durationDays);

  await prisma.enrollment.update({
    where: { id },
    data: { status: "active", paidAt: new Date(), expiresAt: expires },
  });
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
}

export async function cancelEnrollmentAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.enrollment.update({
    where: { id },
    data: { status: "cancelled" },
  });
  revalidatePath("/admin/enrollments");
}

// 관리자가 수강 상태를 직접 지정 (pending | active | expired | cancelled)
export async function setEnrollmentStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "");
  const allowed = ["pending", "active", "expired", "cancelled"];
  if (!allowed.includes(status)) return;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!enrollment) return;

  if (status === "active") {
    // 승인(결제완료) → 학습 권한 부여
    const expires = new Date();
    expires.setDate(expires.getDate() + enrollment.course.durationDays);
    await prisma.enrollment.update({
      where: { id },
      data: {
        status: "active",
        paidAt: enrollment.paidAt ?? new Date(),
        expiresAt: expires,
      },
    });
  } else {
    await prisma.enrollment.update({ where: { id }, data: { status } });
  }

  revalidatePath("/admin/enrollments");
  revalidatePath("/admin");
}

// 오류 신고 해결 처리
export async function resolveReportAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.questionReport.update({
    where: { id },
    data: { status: "resolved", resolvedAt: new Date() },
  });
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}

// 오류 신고 삭제
export async function deleteReportAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.questionReport.delete({ where: { id } });
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}

export async function createQuestionAction(formData: FormData) {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  await prisma.question.create({
    data: {
      courseId,
      subject: String(formData.get("subject") || ""),
      content: String(formData.get("content") || ""),
      option1: String(formData.get("option1") || ""),
      option2: String(formData.get("option2") || ""),
      option3: String(formData.get("option3") || ""),
      option4: String(formData.get("option4") || ""),
      answer: Number(formData.get("answer")) || 1,
      explanation: String(formData.get("explanation") || "") || null,
      difficulty: Number(formData.get("difficulty")) || 2,
      isFree: formData.get("isFree") === "on",
    },
  });
  revalidatePath("/admin/questions");
  revalidatePath("/admin/free-questions");
}

export async function toggleQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q) return;
  await prisma.question.update({
    where: { id },
    data: { isActive: !q.isActive },
  });
  revalidatePath("/admin/questions");
  revalidatePath("/admin/free-questions");
}

// 시드(자동 생성) 샘플 문제 전체 삭제 — 업로드한 문제는 남김.
// 시드 문제는 지문이 "...가장 관련이 깊은 개념은 무엇인가?" 패턴으로 생성됨.
export async function deleteSampleQuestionsAction(): Promise<void> {
  await requireAdmin();
  const SAMPLE_MARKER = "가장 관련이 깊은 개념은 무엇인가?";

  const samples = await prisma.question.findMany({
    where: { content: { contains: SAMPLE_MARKER } },
    select: { id: true },
  });
  const ids = samples.map((s) => s.id);
  if (ids.length === 0) {
    revalidatePath("/admin/questions");
    return;
  }

  // 외래키 제약: 연관된 답안·오답노트를 먼저 삭제
  await prisma.userAnswer.deleteMany({ where: { questionId: { in: ids } } });
  await prisma.wrongNote.deleteMany({ where: { questionId: { in: ids } } });
  await prisma.question.deleteMany({ where: { id: { in: ids } } });

  revalidatePath("/admin/questions");
  revalidatePath("/admin");
}

// TSV 일괄 업로드: subject \t content \t opt1 \t opt2 \t opt3 \t opt4 \t answer \t explanation \t difficulty \t isFree
export async function bulkUploadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  const raw = String(formData.get("data") || "").trim();
  if (!raw || !courseId) return;

  const rows = raw.split("\n").filter((l) => l.trim());
  const data = rows
    .map((line) => {
      const c = line.split("\t");
      if (c.length < 7) return null;
      return {
        courseId,
        subject: c[0]?.trim() || null,
        content: c[1]?.trim() || "",
        option1: c[2]?.trim() || "",
        option2: c[3]?.trim() || "",
        option3: c[4]?.trim() || "",
        option4: c[5]?.trim() || "",
        answer: Number(c[6]?.trim()) || 1,
        explanation: c[7]?.trim() || null,
        difficulty: Number(c[8]?.trim()) || 2,
        isFree: (c[9]?.trim() || "").toUpperCase() === "TRUE",
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (data.length > 0) {
    await prisma.question.createMany({ data });
  }
  revalidatePath("/admin/questions");
}

// JSON 파일 일괄 업로드
// 허용 형식: 객체 배열. snake_case / camelCase 키 모두 지원.
// [{ subject, content, option_1~4 (또는 option1~4 / options:[]), answer, explanation, difficulty, is_free }]
export type JsonUploadState = { error?: string; count?: number } | undefined;

export async function bulkUploadJsonAction(
  _prev: JsonUploadState,
  formData: FormData
): Promise<JsonUploadState> {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  const file = formData.get("file") as File | null;
  // 무료체험 업로드 시 모든 문제를 무료(isFree=true)로 강제
  const forceFree = formData.get("forceFree") === "1";

  if (!courseId) return { error: "대상 과정을 선택해 주세요." };
  if (!file || file.size === 0) return { error: "JSON 파일을 선택해 주세요." };

  let parsed: unknown;
  try {
    const text = await file.text();
    parsed = JSON.parse(text);
  } catch {
    return { error: "JSON 파싱에 실패했습니다. 올바른 JSON 파일인지 확인해 주세요." };
  }

  // 배열 또는 { questions: [...] } 형태 모두 허용
  const container = parsed as { questions?: unknown };
  const list: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray(container?.questions)
    ? (container.questions as unknown[])
    : [];

  if (list.length === 0) {
    return { error: "등록할 문제가 없습니다. JSON은 문제 객체 배열이어야 합니다." };
  }

  const pick = (o: Record<string, unknown>, ...keys: string[]): unknown => {
    for (const k of keys) {
      if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
    }
    return undefined;
  };

  type QuestionInput = {
    courseId: number;
    subject: string | null;
    content: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: number;
    explanation: string | null;
    difficulty: number;
    isFree: boolean;
  };

  const data: QuestionInput[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Record<string, unknown>;
    const opts = Array.isArray(raw.options) ? (raw.options as unknown[]) : null;
    const option1 = opts ? opts[0] : pick(raw, "option_1", "option1");
    const option2 = opts ? opts[1] : pick(raw, "option_2", "option2");
    const option3 = opts ? opts[2] : pick(raw, "option_3", "option3");
    const option4 = opts ? opts[3] : pick(raw, "option_4", "option4");
    const content = pick(raw, "content", "question", "지문");
    const answer = Number(pick(raw, "answer", "정답") ?? 1);

    if (!content || !option1 || !option2 || !option3 || !option4) continue;

    const isFreeRaw = pick(raw, "is_free", "isFree", "free");
    data.push({
      courseId,
      subject: String(pick(raw, "subject", "과목", "키워드") ?? "") || null,
      content: String(content),
      option1: String(option1),
      option2: String(option2),
      option3: String(option3),
      option4: String(option4),
      answer: answer >= 1 && answer <= 4 ? answer : 1,
      explanation: String(pick(raw, "explanation", "해설") ?? "") || null,
      difficulty: Number(pick(raw, "difficulty", "난이도") ?? 2) || 2,
      isFree: forceFree || isFreeRaw === true || String(isFreeRaw).toUpperCase() === "TRUE",
    });
  }

  if (data.length === 0) {
    return { error: "유효한 문제가 없습니다. content/option_1~4 필수 항목을 확인해 주세요." };
  }

  await prisma.question.createMany({ data });
  revalidatePath("/admin/questions");
  revalidatePath("/admin/free-questions");
  return { count: data.length };
}
