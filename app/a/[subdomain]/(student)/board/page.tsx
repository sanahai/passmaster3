import { requireSubsiteStudent } from "@/lib/academy-subsite";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubsiteBoardPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStudent(params.subdomain);

  const notices = await prisma.academyNotice.findMany({
    where: { academyId: academy.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">공지·게시판</h1>
        <p className="text-slate-500">{academy.name} 학원 공지사항</p>
      </div>
      {notices.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          등록된 공지가 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {notices.map((n) => (
            <li key={n.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                {n.isPinned && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">고정</span>
                )}
                <time className="text-xs text-slate-400">
                  {n.createdAt.toLocaleDateString("ko-KR")}
                </time>
              </div>
              <h2 className="font-bold text-slate-900">{n.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{n.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
