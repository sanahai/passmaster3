import Link from "next/link";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EnrollListPage() {
  const session = await requireSession("/enroll");

  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
    include: { _count: { select: { questions: true } } },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
  });
  const statusByCourse = new Map(enrollments.map((e) => [e.courseId, e.status]));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">수강신청</h1>
        <p className="mb-8 text-beauty-gray">학습할 자격증 과정을 선택하세요.</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {courses.map((c) => {
            const status = statusByCourse.get(c.id);
            return (
              <div key={c.id} className="card flex flex-col">
                <h3 className="mb-1 text-lg font-bold text-beauty-neutral">{c.name}</h3>
                <p className="mb-4 text-sm text-beauty-gray">{c.description}</p>
                <ul className="mb-5 space-y-1 text-sm text-beauty-gray">
                  <li>📚 문제 수: {c._count.questions.toLocaleString()}문제</li>
                  <li>⏱️ 수강기간: {c.durationDays}일</li>
                  <li>💰 가격: {c.price.toLocaleString()}원</li>
                </ul>
                <div className="mt-auto">
                  {status === "active" ? (
                    <Link href={`/learn/${c.slug}`} className="btn-primary w-full">
                      학습하기
                    </Link>
                  ) : status === "pending" ? (
                    <Link href={`/enroll/${c.slug}/payment`} className="btn-outline w-full">
                      입금 대기 중 · 결제 안내
                    </Link>
                  ) : (
                    <div className="flex gap-2">
                      <Link href={`/trial/${c.slug}`} className="btn-primary flex-1 text-center">
                        무료체험하기
                      </Link>
                      <Link href={`/enroll/${c.slug}`} className="btn-outline flex-1 text-center">
                        신청하기
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
