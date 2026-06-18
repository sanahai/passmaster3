import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { prisma } from "@/lib/prisma";
import { getGroupStats } from "@/lib/academy-stats";
import { createGroupAction, deleteGroupAction } from "@/app/actions/academy";
import UpgradeBanner from "@/components/academy/UpgradeBanner";

export default async function AcademyGroupsPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "standard")) return <UpgradeBanner />;

  const groups = await prisma.academyGroup.findMany({
    where: { academyId: ctx.academy.id },
    include: {
      teacher: { select: { name: true } },
      _count: { select: { members: true } },
    },
    orderBy: { name: "asc" },
  });
  const stats = await getGroupStats(ctx.academy.id);
  const statMap = new Map(stats.map((s) => [s.id, s.avgScore]));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-b2b-primary">반 관리</h1>
      </div>

      <form action={createGroupAction} className="mb-6 flex gap-2 b2b-card">
        <input
          name="name"
          placeholder="새 반 이름 (예: A반, 피부반)"
          className="flex-1 rounded-lg border border-b2b-border px-4 py-2 text-sm"
          required
        />
        <button type="submit" className="b2b-btn-accent shrink-0">
          + 새 반 만들기
        </button>
      </form>

      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.id} className="b2b-card flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">{g.name}</h3>
              <p className="text-sm text-slate-500">
                학생 {g._count.members}명 · 평균 {statMap.get(g.id) ?? 0}% · 담당:{" "}
                {g.teacher?.name ?? "미배정"}
              </p>
            </div>
            <div className="flex gap-2">
              <a href={`/academy/groups/${g.id}`} className="b2b-btn-primary text-sm">
                학생 관리
              </a>
              <form action={deleteGroupAction}>
                <input type="hidden" name="id" value={g.id} />
                <button type="submit" className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white">
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
        {groups.length === 0 && <p className="text-slate-500">등록된 반이 없습니다.</p>}
      </div>
    </div>
  );
}
