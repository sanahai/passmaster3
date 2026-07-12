/**
 * 문제은행 시드 스크립트 (13종)
 *   우리가 만든 문제은행 JSON을 passmaster3 DB(Question 테이블)에 주입.
 *   - choices[] → option1~4
 *   - answer_index → answer
 *   - ai_analysis(misconception_map 포함) → aiAnalysis(Json)
 *   무료체험 100문제 파일이 있으면 isFree=true로 표시.
 *
 * 실행:
 *   npx tsx prisma/seed-questionbank.ts
 *
 * 준비: 문제은행 JSON들을 data/questionbank/ 폴더에 넣어두세요.
 *   각 파일명은 아래 COURSES의 file과 일치해야 합니다.
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// 13종 과정 정의 (slug, 이름, 카테고리, 문제은행 파일, 무료체험 파일)
const COURSES = [
  { slug: "hansik",     name: "한식조리기능사 필기",   category: "조리", file: "kr_final.json",         free: "kr_free100.json" },
  { slug: "yangsik",    name: "양식조리기능사 필기",   category: "조리", file: "yangsik_final.json",     free: "yangsik_free100.json" },
  { slug: "jungsik",    name: "중식조리기능사 필기",   category: "조리", file: "jungsik_final.json",     free: "jungsik_free100.json" },
  { slug: "ilsik",      name: "일식조리기능사 필기",   category: "조리", file: "ilsik_final.json",       free: "ilsik_free100.json" },
  { slug: "jegwa",      name: "제과기능사 필기",       category: "제과제빵", file: "jegwa_final.json",   free: "jegwa_free100.json" },
  { slug: "jeppang",    name: "제빵기능사 필기",       category: "제과제빵", file: "jeppang_final.json", free: "jeppang_free100.json" },
  { slug: "skin",       name: "피부미용사 필기",       category: "미용", file: "skin_final.json",        free: "skin_free100.json" },
  { slug: "nail",       name: "네일미용사 필기",       category: "미용", file: "nail_final.json",        free: "nail_free100.json" },
  { slug: "makeup",     name: "메이크업미용사 필기",   category: "미용", file: "makeup_final.json",      free: "makeup_free100.json" },
  { slug: "beautician", name: "미용사(일반) 필기",     category: "미용", file: "beautician_final.json",  free: "beautician_free100.json" },
  { slug: "baber",      name: "이용사 필기",           category: "미용", file: "baber_final.json",       free: "baber_free100.json" },
  { slug: "forklift",   name: "지게차운전기능사 필기", category: "기타", file: "forklift_final.json",    free: "forklift_free100.json" },
  { slug: "electric",   name: "전기기능사 필기",       category: "기타", file: "electric_final.json",    free: "electric_free100.json" },
];

const DATA_DIR = path.join(process.cwd(), "data", "questionbank");
const FREE_DIR = path.join(process.cwd(), "data", "free100");

// 무료체험 문제 식별용: stem(지문) 정규화 키
const norm = (s: string) => (s ?? "").replace(/\s+/g, "").slice(0, 60);

function loadFreeStems(freeFile: string): Set<string> {
  const p = path.join(FREE_DIR, freeFile);
  if (!fs.existsSync(p)) return new Set();
  const arr = JSON.parse(fs.readFileSync(p, "utf-8"));
  // 무료체험 파일은 신버전(stem)이지만, 혹시 구버전(question)도 대비
  return new Set(arr.map((q: any) => norm(q.stem ?? q.question ?? "")));
}

// 구버전(easy/medium/hard) → 신버전(low/medium/high) 난이도 매핑
const DIFF_MAP: Record<string, string> = {
  easy: "low", medium: "medium", hard: "high",
  low: "low", high: "high",
};

// 문항의 지문 텍스트 추출 (신버전 stem / 구버전 question)
function getStem(q: any): string {
  return q.stem ?? q.question ?? "";
}

/**
 * 신버전/구버전 자동 감지 후 DB 행으로 변환.
 *   신버전: choices[], answer_index, stem, ai_analysis
 *   구버전: option1~4, answer, question (ai_analysis 없음)
 */
function toQuestionRow(q: any, courseId: number, freeStems: Set<string>) {
  const isNew = Array.isArray(q.choices); // choices 배열 있으면 신버전

  // 선택지
  const opts = isNew
    ? [q.choices[0], q.choices[1], q.choices[2], q.choices[3]]
    : [q.option1, q.option2, q.option3, q.option4];

  // 정답 번호
  let answer = Number(isNew ? q.answer_index : q.answer);
  if (!answer || answer < 1 || answer > 4) answer = 1;

  // 난이도 (구버전 easy/hard도 매핑)
  const rawDiff = String(q.difficulty ?? "medium").toLowerCase();
  const difficulty = DIFF_MAP[rawDiff] ?? "medium";

  const stem = getStem(q);

  return {
    courseId,
    subject: q.subject ?? null,
    content: stem,
    option1: String(opts[0] ?? ""),
    option2: String(opts[1] ?? ""),
    option3: String(opts[2] ?? ""),
    option4: String(opts[3] ?? ""),
    answer,
    explanation: q.explanation ?? null,
    difficulty,
    aiAnalysis: q.ai_analysis ?? null,          // 신버전만 있음(구버전은 null)
    questionPolarity: q.question_polarity ?? null,
    trapType: q.trap_type ?? null,
    keywordTags: q.keyword_tags ?? q.tags ?? null,   // 구버전은 tags
    unitTag: q.unit_tag ?? q.topic ?? null,          // 구버전은 topic
    requiresImage: Boolean(q.requires_image ?? q.has_image),
    imageDescription: q.image_description ?? null,
    isFree: freeStems.has(norm(stem)),          // 무료체험 문제면 true
    isActive: true,
  };
}

async function main() {
  console.log("문제은행 시드 시작...\n");

  for (const c of COURSES) {
    const filePath = path.join(DATA_DIR, c.file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${c.slug}: 파일 없음(${c.file}) — 건너뜀`);
      continue;
    }

    // 1) Course upsert
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: { name: c.name, category: c.category },
      create: {
        slug: c.slug, name: c.name, category: c.category,
        brand: "passmaster", price: 9900, durationDays: 30,
      },
    });

    // 2) 기존 문제 삭제(재시드 시 중복 방지)
    await prisma.question.deleteMany({ where: { courseId: course.id } });

    // 3) 문제은행 로드 + 무료체험 식별
    const questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const freeStems = loadFreeStems(c.free);
    const rows = questions.map((q: any) => toQuestionRow(q, course.id, freeStems));

    // 4) 배치 삽입(500개씩)
    let inserted = 0;
    for (let i = 0; i < rows.length; i += 500) {
      const chunk = rows.slice(i, i + 500);
      await prisma.question.createMany({ data: chunk });
      inserted += chunk.length;
    }

    const freeCount = rows.filter((r: any) => r.isFree).length;
    console.log(`✅ ${c.slug}: ${inserted}문제 (무료체험 ${freeCount})`);
  }

  console.log("\n시드 완료.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
