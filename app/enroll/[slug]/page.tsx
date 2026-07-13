import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { createEnrollmentAction } from "@/app/actions/enroll";

export default async function EnrollApplyPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await requireSession(`/enroll/${params.slug}`);
  const course = await prisma.course.findUnique({ where: { slug: params.slug } });
  if (!course) redirect("/enroll");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-12">
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">수강신청서</h1>
        <p className="mb-8 text-beauty-gray">{course.name}</p>

        <div className="card">
          <div className="mb-6 rounded-btn bg-primary-pale/50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-beauty-neutral">{course.name}</span>
              <span className="text-lg font-bold text-primary">
                {course.price.toLocaleString()}원
              </span>
            </div>
            <p className="mt-1 text-sm text-beauty-gray">수강기간 {course.durationDays}일</p>
          </div>

          <form action={createEnrollmentAction} className="space-y-4">
            <input type="hidden" name="slug" value={course.slug} />
            <div>
              <label className="label">신청자 이름</label>
              <input className="input bg-gray-50" value={user?.name || ""} readOnly />
            </div>
            <div>
              <label className="label">이메일</label>
              <input className="input bg-gray-50" value={user?.email || ""} readOnly />
            </div>
            <div>
              <label className="label">연락처</label>
              <input className="input bg-gray-50" value={user?.phone || "미등록"} readOnly />
            </div>
            <button type="submit" className="btn-primary w-full">
              신청하고 결제 안내 받기
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
