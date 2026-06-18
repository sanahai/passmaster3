import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import UpgradeBanner from "@/components/academy/UpgradeBanner";
import { prisma } from "@/lib/prisma";
import { assignStudentsToGroupAction } from "@/app/actions/academy";
import { notFound } from "next/navigation";

export default async function AcademyGroupDetailPage({ params }: { params: { id: string } }) {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "standard")) return <UpgradeBanner />;
  const { academy } = ctx;
  const groupId = Number(params.id);

  const group = await prisma.academyGroup.findFirst({
    where: { id: groupId, academyId: academy.id },
    include: { members: true },
  });
  if (!group) notFound();

  const unassigned = await prisma.user.findMany({
    where: { academyId: academy.id, role: "student", groupId: null },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-b2b-primary">{group.name} · 학생 배정</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="b2b-card">
          <h2 className="mb-3 font-bold">현재 소속 ({group.members.length}명)</h2>
          <ul className="space-y-2 text-sm">
            {group.members.map((m) => (
              <li key={m.id} className="rounded bg-b2b-section px-3 py-2">
                {m.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="b2b-card">
          <h2 className="mb-3 font-bold">미배정 학생</h2>
          <form action={assignStudentsToGroupAction}>
            <input type="hidden" name="groupId" value={groupId} />
            <ul className="mb-4 max-h-64 space-y-2 overflow-y-auto text-sm">
              {unassigned.map((u) => (
                <li key={u.id} className="flex items-center gap-2">
                  <input type="checkbox" name="studentIds" value={u.id} />
                  {u.name}
                </li>
              ))}
            </ul>
            <button type="submit" className="b2b-btn-accent w-full">
              선택 학생 이 반에 추가
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
