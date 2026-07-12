import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [newUsers, newEnrolls, pending, activeStudents, totalQuestions, paidEnrolls, openReports, academyTotal, academyExpiring] =
    await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.enrollment.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.enrollment.count({ where: { status: "pending" } }),
      prisma.enrollment.count({ where: { status: "active" } }),
      prisma.question.count(),
      // 누적 매출: 수강·결제 관리의 '결제완료(active)' 건과 동일 기준으로 연동
      prisma.enrollment.findMany({
        where: { status: "active" },
        select: { amount: true, course: { select: { price: true } } },
      }),
      prisma.questionReport.count({ where: { status: "open" } }),
      prisma.academy.count(),
      prisma.academy.count({
        where: {
          activeUntil: {
            lte: (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d; })(),
            gte: new Date(),
          },
        },
      }),
    ]);

  const revenue = paidEnrolls.reduce((sum, e) => sum + e.course.price, 0);

  // 만료 임박(7일 이내)
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const expiringSoon = await prisma.enrollment.findMany({
    where: { status: "active", expiresAt: { lte: soon, gte: new Date() } },
    include: { user: true, course: true },
    take: 5,
  });

  const expiringAcademies = await prisma.academy.findMany({
    where: {
      activeUntil: { lte: soon, gte: new Date() },
    },
    orderBy: { activeUntil: "asc" },
    take: 5,
  });

  const cards = [
    { label: "오늘 신규 가입", value: newUsers, icon: "🆕", href: "/admin/users" },
    { label: "오늘 신규 신청", value: newEnrolls, icon: "📝", href: "/admin/enrollments" },
    {
      label: "승인 대기",
      value: pending,
      icon: "⏳",
      href: "/admin/enrollments?status=pending",
    },
    {
      label: "활성 수강생",
      value: activeStudents,
      icon: "🎓",
      href: "/admin/enrollments?status=active",
    },
    {
      label: "B2B 학원",
      value: academyTotal,
      icon: "🏫",
      href: "/admin/academies",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">관리자 대시보드</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => {
          const inner = (
            <div className="card transition-shadow hover:shadow-cardHover">
              <div className="mb-1 text-2xl">{c.icon}</div>
              <div className="text-3xl font-extrabold text-primary">{c.value}</div>
              <div className="mt-1 flex items-center justify-between text-sm text-beauty-gray">
                <span>{c.label}</span>
                {c.href && <span className="text-xs text-primary">바로가기 →</span>}
              </div>
            </div>
          );
          return c.href ? (
            <Link key={c.label} href={c.href}>{inner}</Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-beauty-neutral">누적 매출</h2>
            <Link
              href="/admin/enrollments?status=active"
              className="text-xs font-semibold text-primary hover:underline"
            >
              결제완료 내역 →
            </Link>
          </div>
          <Link href="/admin/enrollments?status=active" className="block">
            <p className="text-3xl font-extrabold text-primary hover:underline">
              {revenue.toLocaleString()}원
            </p>
          </Link>
          <p className="mt-1 text-sm text-beauty-gray">
            수강·결제 관리의 결제완료({activeStudents}건)와 연동
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-btn bg-primary-pale/50 p-3 text-sm text-beauty-gray">
              등록 문제 수<br />
              <span className="font-bold text-primary">{totalQuestions.toLocaleString()}개</span>
            </div>
            <Link
              href="/admin/reports?status=open"
              className="rounded-btn bg-beauty-danger/10 p-3 text-sm text-beauty-gray transition hover:bg-beauty-danger/20"
            >
              미처리 오류 신고<br />
              <span className="font-bold text-beauty-danger">{openReports.toLocaleString()}건</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-3 text-lg font-bold text-beauty-neutral">만료 임박 (7일 이내)</h2>
          {expiringSoon.length === 0 ? (
            <p className="text-sm text-beauty-gray">해당 수강생이 없습니다.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {expiringSoon.map((e) => (
                <li key={e.id} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-beauty-neutral">{e.user.name} · {e.course.name}</span>
                  <span className="text-beauty-gray">
                    ~{e.expiresAt?.toLocaleDateString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {academyExpiring > 0 && (
        <div className="card mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-beauty-neutral">B2B 학원 만료 임박 ({academyExpiring}곳)</h2>
            <Link href="/admin/academies?status=active" className="text-xs font-semibold text-primary hover:underline">
              학원 관리 →
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {expiringAcademies.map((a) => (
              <li key={a.id} className="flex justify-between border-b border-gray-100 pb-2">
                <Link href={`/admin/academies/${a.id}`} className="font-semibold text-beauty-neutral hover:text-primary">
                  {a.name}
                </Link>
                <span className="text-beauty-gray">~{a.activeUntil.toLocaleDateString("ko-KR")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
