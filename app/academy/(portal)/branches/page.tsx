import { requireAcademyOwner } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { prisma } from "@/lib/prisma";
import { createBranchAction } from "@/app/actions/academy";
import UpgradeBanner from "@/components/academy/UpgradeBanner";

export default async function AcademyBranchesPage() {
  const ctx = await requireAcademyOwner();
  if (!tierAtLeast(ctx.academy.tier, "premium")) return <UpgradeBanner />;

  const branches = await prisma.academyBranch.findMany({
    where: { academyId: ctx.academy.id },
    include: {
      manager: { select: { name: true, email: true } },
      _count: { select: { users: true, groups: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-b2b-primary">지점 관리</h1>

      <form action={createBranchAction} className="mb-6 space-y-3 b2b-card">
        <h2 className="font-bold">새 지점 추가</h2>
        <input
          name="name"
          placeholder="지점명"
          className="w-full rounded-lg border border-b2b-border px-4 py-2 text-sm"
          required
        />
        <input
          name="address"
          placeholder="주소 (선택)"
          className="w-full rounded-lg border border-b2b-border px-4 py-2 text-sm"
        />
        <button type="submit" className="b2b-btn-accent">
          지점 생성
        </button>
      </form>

      <div className="space-y-4">
        {branches.map((b) => (
          <div key={b.id} className="b2b-card">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{b.name}</h3>
                {b.address && <p className="text-sm text-slate-500">{b.address}</p>}
              </div>
              {b.code && (
                <span className="rounded-lg bg-b2b-section px-3 py-1 text-sm font-mono">
                  코드 {b.code}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              학생 {b._count.users}명 · 반 {b._count.groups}개 · 관리자:{" "}
              {b.manager?.name ?? "미배정"}
            </p>
          </div>
        ))}
        {branches.length === 0 && <p className="text-slate-500">등록된 지점이 없습니다.</p>}
      </div>
    </div>
  );
}
