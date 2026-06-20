import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { COURSES } from "../lib/courses";

const prisma = new PrismaClient();

// 과목별 핵심 키워드 뱅크 (샘플 문제 생성용)
const TOPIC_BANK: Record<string, string[]> = {
  미용이론: ["두상 포인트", "헤어커트", "퍼머넌트 웨이브", "모발의 구조", "미용의 역사", "샴푸의 종류", "헤어컬러링", "두피관리", "블로 드라이", "가발"],
  피부학: ["표피층", "진피층", "피하지방", "멜라닌 색소", "피지선", "한선", "각질층", "피부유형", "여드름", "피부노화"],
  공중보건학: ["감염병 관리", "역학의 정의", "환경위생", "산업보건", "모자보건", "인구통계", "보건행정", "기생충 질환", "예방접종", "수질오염"],
  소독학: ["물리적 소독", "화학적 소독", "자비소독", "고압증기멸균", "자외선 소독", "에탄올 소독", "크레졸", "역성비누", "석탄산계수", "방부와 살균"],
  미용관계법규: ["공중위생관리법", "면허 발급", "영업신고", "위생교육", "행정처분", "과태료", "면허 취소", "영업소 폐쇄", "위생관리등급", "청문 절차"],
  화장품학: ["화장품 정의", "계면활성제", "보습제", "자외선 차단제", "방부제", "화장품 색소", "기능성 화장품", "유화 형태", "에센셜 오일", "화장품 분류"],
  피부미용이론: ["피부분석", "클렌징", "딥클렌징", "매뉴얼 테크닉", "팩과 마스크", "왁싱", "림프드레나지", "피부미용기기", "전신관리", "관리계획 수립"],
  해부생리학: ["세포의 구조", "조직의 종류", "골격계", "근육계", "신경계", "순환계", "소화계", "내분비계", "호흡계", "림프계"],
  피부미용관계법규: ["공중위생관리법", "피부미용업 정의", "영업자 준수사항", "위생교육", "면허 규정", "행정처분 기준", "과태료", "영업정지", "신고 사항", "청문"],
  네일개론: ["손톱의 구조", "네일의 성장", "네일 도구", "큐티클 관리", "네일 폴리시", "젤 네일", "팁 오버레이", "네일 아트", "페디큐어", "네일 질환"],
  네일미용관계법규: ["공중위생관리법", "네일미용업 정의", "영업신고", "위생관리", "면허 규정", "행정처분", "과태료", "위생교육", "준수사항", "청문 절차"],
  메이크업개론: ["색채의 이해", "베이스 메이크업", "아이 메이크업", "립 메이크업", "컨투어링", "메이크업 도구", "TPO 메이크업", "웨딩 메이크업", "미디어 메이크업", "수정 메이크업"],
  메이크업관계법규: ["공중위생관리법", "메이크업미용업 정의", "영업신고", "위생관리", "면허 규정", "행정처분", "과태료", "위생교육", "준수사항", "청문 절차"],
  이용이론: ["이용의 역사", "헤어커트", "면도", "정발", "두피·모발관리", "아이론", "이용기구", "조발술", "샴푸", "염모와 탈색"],
  이용관계법규: ["공중위생관리법", "이용업 정의", "면허 발급", "영업신고", "위생교육", "행정처분", "과태료", "면허 취소", "영업소 폐쇄", "청문 절차"],
};

function buildQuestions(courseId: number, subjects: { subject: string }[]) {
  const rows: any[] = [];
  let counter = 0;
  for (const { subject } of subjects) {
    const topics = TOPIC_BANK[subject] || ["기본 개념", "응용", "심화", "실무"];
    // 과목당 40문항 (난이도: 쉬움 16 / 보통 12 / 어려움 12) → 모의고사 비율 충족
    const plan: { difficulty: number; count: number }[] = [
      { difficulty: 1, count: 16 },
      { difficulty: 2, count: 12 },
      { difficulty: 3, count: 12 },
    ];
    for (const { difficulty, count } of plan) {
      for (let i = 0; i < count; i++) {
        const topic = topics[(i + difficulty) % topics.length];
        const distractors = topics.filter((t) => t !== topic);
        // 정답 + 오답 3개 구성
        const correct = `${topic}`;
        const wrongs = [distractors[i % distractors.length], distractors[(i + 1) % distractors.length], distractors[(i + 2) % distractors.length]];
        const optionTexts = [correct, ...wrongs];
        // 정답 위치를 순환시켜 다양화
        const answerPos = (counter % 4) + 1;
        const ordered = [...optionTexts];
        // correct 를 answerPos 위치로 이동
        [ordered[0], ordered[answerPos - 1]] = [ordered[answerPos - 1], ordered[0]];

        const diffLabel = difficulty === 1 ? "기초" : difficulty === 2 ? "표준" : "심화";
        rows.push({
          courseId,
          subject,
          content: `[${subject}·${diffLabel}] 다음 중 '${topic}'와(과) 가장 관련이 깊은 개념은 무엇인가?`,
          option1: ordered[0],
          option2: ordered[1],
          option3: ordered[2],
          option4: ordered[3],
          answer: answerPos,
          explanation: `'${topic}'은(는) ${subject}의 핵심 개념입니다. 정답은 ${answerPos}번 '${correct}'이며, 나머지 보기는 관련성이 낮습니다.`,
          difficulty,
          // 각 과목의 쉬움 문제 일부를 무료체험에 포함
          isFree: difficulty === 1 && i < 5,
        });
        counter++;
      }
    }
  }
  return rows;
}

async function main() {
  console.log("🌱 Seeding BEAUTYmaster...");

  // 기존 데이터 정리
  await prisma.userAnswer.deleteMany();
  await prisma.wrongNote.deleteMany();
  await prisma.mockSession.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.questionReport.deleteMany();
  await prisma.userConsent.deleteMany();
  await prisma.academyCustomQuestion.deleteMany();
  await prisma.academyUserAnswer.deleteMany();
  await prisma.academyInvite.deleteMany();
  await prisma.academyNotice.deleteMany();
  await prisma.academyGroup.deleteMany();
  await prisma.academyBranch.deleteMany();
  await prisma.question.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.academy.deleteMany();

  // 관리자 + 데모 학생
  const adminHash = await bcrypt.hash("admin1234", 10);
  const studentHash = await bcrypt.hash("test1234", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@beautymaster.kr",
      passwordHash: adminHash,
      name: "관리자",
      role: "admin",
      emailVerified: true,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@test.com",
      passwordHash: studentHash,
      name: "김미용",
      phone: "010-1234-5678",
      role: "student",
      emailVerified: true,
    },
  });

  console.log(`✔ 사용자 생성: ${admin.email}, ${student.email}`);

  // 과정 + 문제
  let firstCourseId = 0;
  for (const c of COURSES) {
    const course = await prisma.course.create({
      data: {
        slug: c.slug,
        name: c.name,
        category: c.category,
        description: c.description,
        price: c.price,
        durationDays: 90,
        isActive: !c.comingSoon,
      },
    });
    if (!firstCourseId) firstCourseId = course.id;

    const questions = buildQuestions(course.id, c.subjects);
    if (questions.length > 0) await prisma.question.createMany({ data: questions });
    console.log(
      `✔ 과정 [${c.name}] 문제 ${questions.length}개 생성${c.comingSoon ? " (준비 중)" : ""}`,
    );
  }

  // 데모 학생을 첫 과정(미용사 일반)에 활성 수강 등록
  const expires = new Date();
  expires.setDate(expires.getDate() + 90);
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: firstCourseId,
      status: "active",
      amount: 39000,
      paidAt: new Date(),
      expiresAt: expires,
    },
  });
  console.log("✔ 데모 학생 수강 등록(미용사 일반, active)");

  // B2B 데모 학원 (프리미엄)
  const activeUntil = new Date();
  activeUntil.setFullYear(activeUntil.getFullYear() + 1);

  const demoAcademy = await prisma.academy.create({
    data: {
      name: "데모미용학원",
      brand: "beautymaster",
      tier: "premium",
      code: "DEMO01",
      subdomain: "demo-beauty",
      ownerEmail: "owner@demo.academy",
      maxStudents: 50,
      activeUntil,
      primaryColor: "#0F172A",
    },
  });

  const ownerHash = await bcrypt.hash("owner1234", 10);
  const owner = await prisma.user.create({
    data: {
      email: "owner@demo.academy",
      passwordHash: ownerHash,
      name: "김원장",
      role: "owner",
      academyId: demoAcademy.id,
      emailVerified: true,
      lastActiveAt: new Date(),
    },
  });

  const branch = await prisma.academyBranch.create({
    data: {
      academyId: demoAcademy.id,
      name: "강남본점",
      address: "서울 강남구",
      code: "GN001",
      managerId: owner.id,
    },
  });

  const group = await prisma.academyGroup.create({
    data: {
      academyId: demoAcademy.id,
      branchId: branch.id,
      name: "A반",
    },
  });

  await prisma.user.update({
    where: { id: student.id },
    data: {
      academyId: demoAcademy.id,
      groupId: group.id,
      branchId: branch.id,
      lastActiveAt: new Date(),
    },
  });

  await prisma.academyCustomQuestion.create({
    data: {
      academyId: demoAcademy.id,
      subject: "미용이론",
      content: "[학원문제] 모발의 주성분은?",
      options: ["케라틴", "콜라겐", "멜라닌", "지방"],
      answer: 1,
      explanation: "모발의 주성분은 케라틴 단백질입니다.",
      createdById: owner.id,
    },
  });

  await prisma.academyNotice.createMany({
    data: [
      {
        academyId: demoAcademy.id,
        title: "환영합니다! 학원 전용 문제은행 안내",
        content: "회원가입 후 대시보드에서 학습을 시작하세요. 문의는 학원 데스크로 연락해 주세요.",
        isPinned: true,
      },
      {
        academyId: demoAcademy.id,
        title: "모의고사 1회차 오픈",
        content: "이번 주부터 모의고사 1~3회차 응시가 가능합니다.",
        isPinned: false,
      },
    ],
  });

  console.log("✔ B2B 데모 학원: owner@demo.academy / owner1234 (코드 DEMO01)");
  console.log("✔ 화이트레이블: /a/demo-beauty");
  console.log("✔ 수강생 포털: /a/demo-beauty/dashboard");
  console.log("✔ 관리자 포털: /a/demo-beauty/admin");

  console.log("\n🎉 시드 완료!");
  console.log("관리자: admin@beautymaster.kr / admin1234");
  console.log("학생:   student@test.com / test1234 (데모 학원 A반 연결)");
  console.log("원장:   owner@demo.academy / owner1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
