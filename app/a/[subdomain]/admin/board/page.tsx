import Link from "next/link";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { tierAtLeast } from "@/lib/academy";
import { prisma } from "@/lib/prisma";
import { createAcademyNoticeAction, deleteAcademyNoticeAction } from "@/app/actions/academy-notice";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminBoardPage({ params }: { params: { subdomain: string } }) {
  const { academy } = await requireSubsiteStaff(params.subdomain);

  if (!tierAtLeast(academy.tier, "standard")) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-300">
        스탠다드 이상에서 공지·게시판을 이용할 수 있습니다.
      </div>
    );
  }

  const notices = await prisma.academyNotice.findMany({
    where: { academyId: academy.id },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">공지·게시판 관리</h1>
        <p className="text-slate-400">수강생 포털에 노출되는 공지사항</p>
      </div>

      <form action={createAcademyNoticeAction} className="space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-6">
        <input type="hidden" name="subdomain" value={params.subdomain} />
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-300">제목</label>
          <input name="title" className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-300">내용</label>
          <textarea name="content" rows={4} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white" required />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" name="isPinned" className="rounded" />
          상단 고정
        </label>
        <button type="submit" className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
          공지 등록
        </button>
      </form>

      <ul className="space-y-3">
        {notices.map((n) => (
          <li key={n.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <div>
              <div className="mb-1 flex items-center gap-2">
                {n.isPinned && <span className="text-xs text-amber-400">📌 고정</span>}
                <span className="text-xs text-slate-500">{n.createdAt.toLocaleDateString("ko-KR")}</span>
              </div>
              <h2 className="font-bold text-white">{n.title}</h2>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{n.content}</p>
            </div>
            <form action={deleteAcademyNoticeAction}>
              <input type="hidden" name="subdomain" value={params.subdomain} />
              <input type="hidden" name="id" value={n.id} />
              <button type="submit" className="text-xs text-red-400 hover:text-red-300">
                삭제
              </button>
            </form>
          </li>
        ))}
      </ul>

      <Link href={subsitePath(params.subdomain, "/admin")} className="text-sm text-slate-400 hover:text-white">
        ← 대시보드
      </Link>
    </div>
  );
}
