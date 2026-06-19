import { prisma } from "@/lib/prisma";
import ApplicantCell, { type ApplicantInfo } from "@/components/admin/ApplicantCell";
import { progressPercent, nextStepKey } from "@/lib/progress";

const ROLE_LABEL: Record<string, string> = {
  admin: "관리자",
  student: "학생",
  owner: "원장",
  teacher: "강사",
  branch_admin: "지점관리",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
      enrollments: { include: { course: true }, orderBy: { createdAt: "desc" } },
    },
  });

  const userIds = users.map((u) => u.id);
  const progresses = await prisma.learningProgress.findMany({
    where: { userId: { in: userIds } },
  });

  const infoByUser = new Map<number, ApplicantInfo>();
  for (const u of users) {
    const learning = u.enrollments
      .filter((x) => x.status === "active")
      .map((x) => {
        const prog = progresses.find((p) => p.userId === u.id && p.courseId === x.courseId) ?? null;
        return {
          course: x.course.name,
          pct: progressPercent(prog),
          nextLabel: nextStepKey(x.course.slug, prog)?.label ?? null,
        };
      });
    infoByUser.set(u.id, {
      name: u.name,
      email: u.email,
      phone: u.phone,
      enrollments: u.enrollments.map((x) => ({ course: x.course.name, status: x.status })),
      learning,
    });
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">회원 관리</h1>
      <div className="overflow-x-auto rounded-card bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-primary-pale/40 text-left text-beauty-neutral">
            <tr>
              <th className="px-4 py-3">이름</th>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">연락처</th>
              <th className="px-4 py-3">권한</th>
              <th className="px-4 py-3">수강수</th>
              <th className="px-4 py-3">가입일</th>
              <th className="px-4 py-3">정보</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3 font-semibold text-beauty-neutral">{u.name}</td>
                <td className="px-4 py-3 text-beauty-gray">{u.email}</td>
                <td className="px-4 py-3 text-beauty-gray">{u.phone || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      u.role === "admin"
                        ? "bg-primary text-white"
                        : u.role === "owner" || u.role === "teacher"
                        ? "bg-[#0F172A] text-white"
                        : "bg-primary-pale text-primary"
                    }`}
                  >
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-beauty-neutral">{u._count.enrollments}</td>
                <td className="px-4 py-3 text-beauty-gray">
                  {u.createdAt.toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <ApplicantCell email={u.email} info={infoByUser.get(u.id)!} variant="button" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
