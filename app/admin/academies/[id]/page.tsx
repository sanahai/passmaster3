import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TIER_LABEL, type AcademyTier } from "@/lib/academy";
import { absoluteUrl } from "@/lib/site-url";
import AcademyEditPanel from "@/components/admin/AcademyEditPanel";

const ROLE_LABEL: Record<string, string> = {
  owner: "원장",
  teacher: "강사",
  branch_admin: "지점관리",
  student: "학생",
};

export default async function AdminAcademyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!id) notFound();

  const academy = await prisma.academy.findUnique({
    where: { id },
    include: {
      users: {
        orderBy: [{ role: "asc" }, { name: "asc" }],
        include: { group: { select: { name: true } } },
      },
      groups: { select: { id: true, name: true, _count: { select: { members: true } } } },
      branches: { select: { id: true, name: true } },
      invites: {
        where: { usedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!academy) notFound();

  const pending = academy.invites[0];
  const pendingInvite = pending
    ? {
        email: pending.email,
        setupUrl: absoluteUrl(`/academy/setup?token=${pending.token}`),
        expiresAt: pending.expiresAt.toLocaleString("ko-KR"),
      }
    : null;

  const studentCount = academy.users.filter((u) => u.role === "student").length;
  const isExpired = academy.activeUntil < new Date();

  return (
    <div>
      <Link href="/admin/academies" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
        ← 학원 목록
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-beauty-neutral">{academy.name}</h1>
          <p className="mt-1 text-sm text-beauty-gray">
            {TIER_LABEL[academy.tier as AcademyTier]} · 학생 {studentCount}/{academy.maxStudents}명 ·
            등록 {academy.createdAt.toLocaleDateString("ko-KR")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {academy.subdomain && (
            <Link href={`/a/${academy.subdomain}`} target="_blank" className="btn-outline text-sm">
              화이트레이블 ↗
            </Link>
          )}
          <Link href="/academy/dashboard" className="btn-outline text-sm">
            B2B 포털 미리보기
          </Link>
        </div>
      </div>

      {isExpired && (
        <div className="mb-6 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          이 학원의 이용 기간이 만료되었습니다. 연장 후 학생 코드 등록이 가능합니다.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AcademyEditPanel
            academy={{
              id: academy.id,
              name: academy.name,
              tier: academy.tier,
              code: academy.code,
              subdomain: academy.subdomain,
              ownerEmail: academy.ownerEmail,
              ownerPhone: academy.ownerPhone,
              maxStudents: academy.maxStudents,
              activeUntil: academy.activeUntil.toISOString(),
            }}
            pendingInvite={pendingInvite}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <h2 className="mb-3 text-lg font-bold">소속 회원 ({academy.users.length})</h2>
            {academy.users.length === 0 ? (
              <p className="text-sm text-beauty-gray">연결된 회원이 없습니다.</p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
                {academy.users.map((u) => (
                  <li key={u.id} className="flex justify-between border-b border-gray-50 pb-2">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-beauty-gray">{u.email}</p>
                    </div>
                    <span className="text-xs text-primary">{ROLE_LABEL[u.role] ?? u.role}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="mb-3 text-lg font-bold">반 ({academy.groups.length})</h2>
            {academy.groups.length === 0 ? (
              <p className="text-sm text-beauty-gray">등록된 반이 없습니다.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {academy.groups.map((g) => (
                  <li key={g.id} className="flex justify-between">
                    <span>{g.name}</span>
                    <span className="text-beauty-gray">{g._count.members}명</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {academy.branches.length > 0 && (
            <div className="card">
              <h2 className="mb-3 text-lg font-bold">지점 ({academy.branches.length})</h2>
              <ul className="space-y-1 text-sm">
                {academy.branches.map((b) => (
                  <li key={b.id}>{b.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
