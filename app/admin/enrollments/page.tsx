import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import EnrollmentFilter from "@/components/admin/EnrollmentFilter";
import EnrollmentStatusSelect from "@/components/admin/EnrollmentStatusSelect";
import ApplicantCell, { type ApplicantInfo } from "@/components/admin/ApplicantCell";
import { progressPercent, nextStepKey } from "@/lib/progress";

const STATUS: Record<string, string> = {
  pending: "입금대기중",
  active: "결제완료",
  expired: "만료",
  cancelled: "취소",
};

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: { q?: string; course?: string; status?: string };
}) {
  const q = searchParams.q?.trim() || undefined;
  const courseId = searchParams.course ? Number(searchParams.course) : undefined;
  const status = searchParams.status || undefined;

  const where: Prisma.EnrollmentWhereInput = {};
  if (q) where.user = { name: { contains: q, mode: "insensitive" } };
  if (courseId) where.courseId = courseId;
  if (status) where.status = status;

  const [enrollments, courses] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      include: { user: true, course: true },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.course.findMany({ orderBy: { id: "asc" } }),
  ]);

  // 팝업용: 신청자별 전체 수강/학습 현황 미리 조회
  const userIds = Array.from(new Set(enrollments.map((e) => e.userId)));
  const [allEnrollments, progresses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: { in: userIds } },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.learningProgress.findMany({ where: { userId: { in: userIds } } }),
  ]);

  const infoByUser = new Map<number, ApplicantInfo>();
  for (const e of enrollments) {
    if (infoByUser.has(e.userId)) continue;
    const myEnrolls = allEnrollments.filter((x) => x.userId === e.userId);
    const learning = myEnrolls
      .filter((x) => x.status === "active")
      .map((x) => {
        const prog = progresses.find((p) => p.userId === e.userId && p.courseId === x.courseId) ?? null;
        return {
          course: x.course.name,
          pct: progressPercent(prog),
          nextLabel: nextStepKey(x.course.slug, prog)?.label ?? null,
        };
      });
    infoByUser.set(e.userId, {
      name: e.user.name,
      email: e.user.email,
      phone: e.user.phone,
      enrollments: myEnrolls.map((x) => ({ course: x.course.name, status: x.status })),
      learning,
    });
  }

  const courseOptions = courses.map((c) => ({ value: String(c.id), label: c.name }));
  const statusOptions = Object.entries(STATUS).map(([value, label]) => ({ value, label }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">수강신청 & 결제 관리</h1>

      <EnrollmentFilter courses={courseOptions} statuses={statusOptions} />

      <div className="overflow-x-auto rounded-card bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-primary-pale/40 text-left text-beauty-neutral">
            <tr>
              <th className="px-4 py-3">신청자</th>
              <th className="px-4 py-3">과정</th>
              <th className="px-4 py-3">금액</th>
              <th className="px-4 py-3">상태 변경</th>
              <th className="px-4 py-3">신청일</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <ApplicantCell email={e.user.email} info={infoByUser.get(e.userId)!} />
                </td>
                <td className="px-4 py-3 text-beauty-neutral">{e.course.name}</td>
                <td className="px-4 py-3 text-beauty-neutral">{e.amount.toLocaleString()}원</td>
                <td className="px-4 py-3">
                  <EnrollmentStatusSelect id={e.id} status={e.status} />
                </td>
                <td className="px-4 py-3 text-beauty-gray">
                  {e.createdAt.toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enrollments.length === 0 && (
          <p className="p-6 text-center text-beauty-gray">신청 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
