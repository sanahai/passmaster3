import Link from "next/link";
import Header from "@/components/Header";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { getCourseConfig, PACKAGE_PRICE, PACKAGE_CATEGORY } from "@/lib/courses";
import { createPackageEnrollmentAction } from "@/app/actions/enroll";

export default async function PackageEnrollPage() {
  const session = await requireSession("/enroll/package");

  const [courses, user] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true, category: PACKAGE_CATEGORY },
      orderBy: { id: "asc" },
    }),
    prisma.user.findUnique({ where: { id: session.userId } }),
  ]);

  const singleTotal = courses.reduce((sum, c) => sum + c.price, 0);
  const discount = singleTotal - PACKAGE_PRICE;
  const maxDuration = courses.reduce((m, c) => Math.max(m, c.durationDays), 0);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/enroll" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
          ← 수강신청
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">미용사 패키지 (4종 전체)</h1>
        <p className="mb-8 text-beauty-gray">
          일반·피부·네일·메이크업 필기 전 과정을 한 번에 신청할 수 있습니다.
        </p>

        {/* 가격 요약 */}
        <div className="mb-6 rounded-card border-2 border-primary bg-primary-pale/40 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-beauty-gray">개별 합계</span>
            <span className="text-beauty-gray line-through">{singleTotal.toLocaleString()}원</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-bold text-beauty-neutral">패키지 가격</span>
            <span className="text-2xl font-extrabold text-primary">
              {PACKAGE_PRICE.toLocaleString()}원
            </span>
          </div>
          {discount > 0 && (
            <p className="mt-2 text-right text-sm font-semibold text-beauty-success">
              {discount.toLocaleString()}원 할인 ({Math.round((discount / singleTotal) * 100)}% OFF)
            </p>
          )}
        </div>

        {/* 포함 과정 */}
        <div className="card mb-6">
          <h2 className="mb-3 text-lg font-bold text-beauty-neutral">포함 과정</h2>
          <ul className="space-y-2">
            {courses.map((c) => {
              const cfg = getCourseConfig(c.slug);
              return (
                <li key={c.id} className="flex items-center gap-3 border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-2xl">{cfg?.icon ?? "📘"}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-beauty-neutral">{c.name}</p>
                    <p className="text-xs text-beauty-gray">{c.description}</p>
                  </div>
                  <span className="text-sm text-beauty-gray">{c.price.toLocaleString()}원</span>
                </li>
              );
            })}
          </ul>
          <ul className="mt-4 space-y-1 text-sm text-beauty-gray">
            <li>⏱️ 수강기간: 최대 {maxDuration}일 (과정별 적용)</li>
            <li>🔁 11단계 학습 플로우 · 모의고사 · 오답복습 전체 제공</li>
          </ul>
        </div>

        {/* 신청 폼 */}
        <div className="card">
          <h2 className="mb-4 text-lg font-bold text-beauty-neutral">신청 정보</h2>
          <form action={createPackageEnrollmentAction} className="space-y-4">
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
              패키지 신청하고 결제 안내 받기
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
