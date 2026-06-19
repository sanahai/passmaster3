import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TIER_LABEL, type AcademyTier } from "@/lib/academy";

function academyStatus(activeUntil: Date) {
  const now = new Date();
  if (activeUntil < now) return { label: "만료", className: "bg-red-100 text-red-700" };
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  if (activeUntil <= soon) return { label: "만료임박", className: "bg-amber-100 text-amber-800" };
  return { label: "운영중", className: "bg-emerald-100 text-emerald-800" };
}

export default async function AdminAcademiesPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string; tier?: string };
}) {
  const sp = searchParams ?? {};
  const now = new Date();

  const academies = await prisma.academy.findMany({
    where: {
      ...(sp.q ? { name: { contains: sp.q, mode: "insensitive" } } : {}),
      ...(sp.tier ? { tier: sp.tier } : {}),
      ...(sp.status === "active" ? { activeUntil: { gte: now } } : {}),
      ...(sp.status === "expired" ? { activeUntil: { lt: now } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          users: true,
          groups: true,
          invites: true,
        },
      },
      users: {
        where: { role: "student" },
        select: { id: true },
      },
    },
  });

  const [total, active, expired] = await Promise.all([
    prisma.academy.count(),
    prisma.academy.count({ where: { activeUntil: { gte: now } } }),
    prisma.academy.count({ where: { activeUntil: { lt: now } } }),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-beauty-neutral">B2B 학원 관리</h1>
        <Link href="/admin/academies/new" className="btn-primary">
          + 새 학원 등록
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "전체 학원", value: total },
          { label: "운영 중", value: active },
          { label: "만료", value: expired },
        ].map((c) => (
          <div key={c.label} className="card text-center">
            <p className="text-2xl font-extrabold text-primary">{c.value}</p>
            <p className="text-xs text-beauty-gray">{c.label}</p>
          </div>
        ))}
      </div>

      <form className="mb-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="학원명 검색"
          className="input w-48"
        />
        <select name="status" className="input w-32" defaultValue={sp.status ?? ""}>
          <option value="">전체 상태</option>
          <option value="active">운영중</option>
          <option value="expired">만료</option>
        </select>
        <select name="tier" className="input w-32" defaultValue={sp.tier ?? ""}>
          <option value="">전체 플랜</option>
          <option value="basic">베이직</option>
          <option value="standard">스탠다드</option>
          <option value="premium">프리미엄</option>
        </select>
        <button type="submit" className="btn-outline">검색</button>
        {(sp.q || sp.status || sp.tier) && (
          <Link href="/admin/academies" className="btn-outline">초기화</Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-card bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-primary-pale/40 text-left">
            <tr>
              <th className="px-4 py-3">학원명</th>
              <th className="px-4 py-3">플랜</th>
              <th className="px-4 py-3">코드</th>
              <th className="px-4 py-3">학생</th>
              <th className="px-4 py-3">원장</th>
              <th className="px-4 py-3">만료일</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {academies.map((a) => {
              const status = academyStatus(a.activeUntil);
              const studentCount = a.users.length;
              return (
                <tr key={a.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-beauty-neutral">{a.name}</td>
                  <td className="px-4 py-3">{TIER_LABEL[a.tier as AcademyTier]}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.code ?? "-"}</td>
                  <td className="px-4 py-3">
                    {studentCount}/{a.maxStudents}
                  </td>
                  <td className="px-4 py-3 text-beauty-gray">{a.ownerEmail}</td>
                  <td className="px-4 py-3 text-beauty-gray">
                    {a.activeUntil.toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/academies/${a.id}`} className="font-semibold text-primary hover:underline">
                      관리 →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {academies.length === 0 && (
          <p className="p-8 text-center text-beauty-gray">
            등록된 학원이 없습니다.{" "}
            <Link href="/admin/academies/new" className="text-primary hover:underline">
              새 학원 등록
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
