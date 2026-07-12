/**
 * 배포 시 DB 과정 가격·수강기간을 lib/courses.ts 기준(1개월 9,900원)으로 동기화
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRICE = 9900;
const DURATION_DAYS = 30;

async function main() {
  const result = await prisma.course.updateMany({
    data: { price: PRICE, durationDays: DURATION_DAYS },
  });
  console.log(`[sync-pricing] ${result.count} courses → ${PRICE.toLocaleString()}원 / ${DURATION_DAYS}일`);

  const enrollments = await prisma.enrollment.findMany({
    where: { status: { in: ["pending", "active"] } },
    include: { course: true },
  });
  let synced = 0;
  for (const e of enrollments) {
    if (e.amount !== e.course.price) {
      await prisma.enrollment.update({
        where: { id: e.id },
        data: { amount: e.course.price },
      });
      synced++;
    }
  }
  if (synced > 0) {
    console.log(`[sync-pricing] ${synced} enrollments → amount synced to course price`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
