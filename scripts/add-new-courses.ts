import { PrismaClient } from "@prisma/client";
import { COURSES, COURSE_DURATION_DAYS } from "../lib/courses";

const prisma = new PrismaClient();

// 기존 데이터(문제/회원/수강내역)를 건드리지 않고
// 신규 자격증 과정(이용사/문신사)만 안전하게 추가/갱신한다.
const NEW_SLUGS = ["barber", "tattoo"];

async function main() {
  console.log("➕ 신규 자격증 과정 추가 중...");

  for (const slug of NEW_SLUGS) {
    const c = COURSES.find((x) => x.slug === slug);
    if (!c) {
      console.warn(`⚠ lib/courses.ts에 '${slug}' 설정이 없습니다. 건너뜀`);
      continue;
    }

    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        category: c.category,
        description: c.description,
        price: c.price,
        durationDays: COURSE_DURATION_DAYS,
        isActive: !c.comingSoon,
      },
      create: {
        slug: c.slug,
        name: c.name,
        category: c.category,
        description: c.description,
        price: c.price,
        durationDays: COURSE_DURATION_DAYS,
        isActive: !c.comingSoon,
      },
    });

    console.log(
      `✔ [${course.name}] (slug=${course.slug}, id=${course.id}, isActive=${course.isActive})`,
    );
  }

  console.log("\n🎉 완료! 문제는 관리자 페이지에서 업로드하세요.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
