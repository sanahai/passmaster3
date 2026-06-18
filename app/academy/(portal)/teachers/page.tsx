import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { prisma } from "@/lib/prisma";
import InviteTeacherForm from "@/components/academy/InviteTeacherForm";
import UpgradeBanner from "@/components/academy/UpgradeBanner";
import { TIER_MAX_TEACHERS, type AcademyTier } from "@/lib/academy";

export default async function AcademyTeachersPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "standard")) return <UpgradeBanner />;
  if (ctx.user.role === "teacher") {
    return (
      <div className="b2b-card">
        <p className="text-slate-600">강사 계정은 강사 관리 메뉴에 접근할 수 없습니다.</p>
      </div>
    );
  }

  const teachers = await prisma.user.findMany({
    where: { academyId: ctx.academy.id, role: "teacher" },
    include: { teachingGroups: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  const pending = await prisma.academyInvite.findMany({
    where: { academyId: ctx.academy.id, role: "teacher", usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  const max = TIER_MAX_TEACHERS[ctx.academy.tier as AcademyTier];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-b2b-primary">강사 관리</h1>
      <p className="mb-6 text-sm text-slate-500">
        등록 강사 {teachers.length}/{max === 999 ? "∞" : max}명
      </p>

      {ctx.user.role === "owner" && teachers.length < max && (
        <div className="mb-6 b2b-card">
          <h2 className="mb-3 font-bold">강사 초대</h2>
          <InviteTeacherForm />
        </div>
      )}

      <div className="mb-6 space-y-3">
        {teachers.map((t) => (
          <div key={t.id} className="b2b-card flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-slate-500">{t.email}</p>
            </div>
            <p className="text-sm text-slate-600">
              담당 반: {t.teachingGroups.map((g) => g.name).join(", ") || "없음"}
            </p>
          </div>
        ))}
        {teachers.length === 0 && <p className="text-slate-500">등록된 강사가 없습니다.</p>}
      </div>

      {pending.length > 0 && (
        <div className="b2b-card">
          <h2 className="mb-3 font-bold">대기 중인 초대</h2>
          <ul className="space-y-2 text-sm">
            {pending.map((i) => (
              <li key={i.id} className="flex justify-between border-b border-slate-100 pb-2">
                <span>{i.email}</span>
                <a href={`/academy/setup?token=${i.token}`} className="text-b2b-accent hover:underline">
                  초대 링크
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
