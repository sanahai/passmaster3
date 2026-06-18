import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateAcademyForm from "@/components/admin/CreateAcademyForm";
import { TIER_LABEL, type AcademyTier } from "@/lib/academy";

export default async function AdminAcademiesPage() {
  const academies = await prisma.academy.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">B2B 학원 관리</h1>

      <CreateAcademyForm />

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">등록 학원 ({academies.length})</h2>
        <div className="space-y-3">
          {academies.map((a) => (
            <div key={a.id} className="card flex flex-wrap justify-between gap-2 text-sm">
              <div>
                <p className="font-bold text-beauty-neutral">{a.name}</p>
                <p className="text-beauty-gray">
                  {TIER_LABEL[a.tier as AcademyTier]} · 코드 {a.code} · 학생 {a._count.users}명
                </p>
              </div>
              <div className="text-right text-beauty-gray">
                <p>{a.ownerEmail}</p>
                <p>~{a.activeUntil.toLocaleDateString("ko-KR")}</p>
                {a.subdomain && (
                  <Link href={`/a/${a.subdomain}`} className="text-primary hover:underline">
                    /a/{a.subdomain}
                  </Link>
                )}
              </div>
            </div>
          ))}
          {academies.length === 0 && <p className="text-beauty-gray">등록된 학원이 없습니다.</p>}
        </div>
      </div>
    </div>
  );
}
