import Link from "next/link";
import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { prisma } from "@/lib/prisma";
import { deleteCustomQuestionAction } from "@/app/actions/academy";
import UpgradeBanner from "@/components/academy/UpgradeBanner";

export default async function AcademyQuestionsPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "premium")) return <UpgradeBanner />;

  const questions = await prisma.academyCustomQuestion.findMany({
    where: { academyId: ctx.academy.id },
    include: { createdBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-b2b-primary">학원 자체 문제</h1>
        <Link href="/academy/questions/upload" className="b2b-btn-accent">
          엑셀 업로드
        </Link>
      </div>

      <p className="mb-6 text-sm text-slate-500">
        학원 전용 문제 {questions.length}개 · 학생 학습 화면에 &apos;학원 문제&apos; 탭으로 제공됩니다.
      </p>

      <div className="space-y-3">
        {questions.map((q) => {
          const opts = q.options as string[];
          return (
            <div key={q.id} className="b2b-card">
              <div className="mb-2 flex flex-wrap justify-between gap-2">
                <span className="text-xs font-semibold text-b2b-accent">{q.subject ?? "기타"}</span>
                <span className="text-xs text-slate-400">
                  {q.createdBy?.name ?? "관리자"} · {q.createdAt.toLocaleDateString("ko-KR")}
                </span>
              </div>
              <p className="mb-2 text-sm font-medium">{q.content}</p>
              <ol className="mb-3 list-inside list-decimal text-sm text-slate-600">
                {opts.map((o, i) => (
                  <li key={i} className={i + 1 === q.answer ? "font-bold text-emerald-700" : ""}>
                    {o}
                  </li>
                ))}
              </ol>
              {ctx.user.role === "owner" && (
                <form action={deleteCustomQuestionAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    삭제
                  </button>
                </form>
              )}
            </div>
          );
        })}
        {questions.length === 0 && (
          <p className="text-slate-500">
            등록된 문제가 없습니다.{" "}
            <Link href="/academy/questions/upload" className="text-b2b-accent hover:underline">
              엑셀 업로드
            </Link>
            로 추가하세요.
          </p>
        )}
      </div>
    </div>
  );
}
