import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resolveReportAction, deleteReportAction } from "@/app/actions/admin";

const CATEGORY: Record<string, string> = {
  question: "문제(지문)",
  option: "선택지",
  answer: "정답",
  explanation: "해설",
  other: "기타",
};

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status === "resolved" ? "resolved" : "open";

  const where: Prisma.QuestionReportWhereInput = { status };
  const [reports, openCount, resolvedCount] = await Promise.all([
    prisma.questionReport.findMany({
      where,
      include: { question: { include: { course: true } }, user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.questionReport.count({ where: { status: "open" } }),
    prisma.questionReport.count({ where: { status: "resolved" } }),
  ]);

  const tabs = [
    { key: "open", label: `미처리 ${openCount}`, href: "/admin/reports?status=open" },
    {
      key: "resolved",
      label: `처리완료 ${resolvedCount}`,
      href: "/admin/reports?status=resolved",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">오류 신고 관리</h1>

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={t.href}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              status === t.key
                ? "bg-primary text-white"
                : "bg-white text-beauty-neutral shadow-card hover:text-primary"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="card text-center text-beauty-gray">
          {status === "open" ? "미처리 신고가 없습니다." : "처리완료된 신고가 없습니다."}
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="card">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-beauty-danger/10 px-2 py-0.5 font-bold text-beauty-danger">
                  {CATEGORY[r.category] || r.category}
                </span>
                <span className="rounded-full bg-primary-pale px-2 py-0.5 font-bold text-primary">
                  {r.question.course.name}
                </span>
                <span className="text-beauty-gray">문제 #{r.questionId}</span>
                <span className="ml-auto text-beauty-gray">
                  {r.user.name} · {r.createdAt.toLocaleString("ko-KR")}
                </span>
              </div>

              <p className="text-sm font-semibold text-beauty-neutral">{r.question.content}</p>
              <ul className="mt-1 text-xs text-beauty-gray">
                {[r.question.option1, r.question.option2, r.question.option3, r.question.option4].map(
                  (opt, i) => (
                    <li key={i} className={r.question.answer === i + 1 ? "font-bold text-beauty-success" : ""}>
                      {i + 1}. {opt}
                      {r.question.answer === i + 1 ? " ✓" : ""}
                    </li>
                  )
                )}
              </ul>

              <div className="mt-3 rounded-btn bg-[#FFF6F8] p-3 text-sm text-beauty-neutral">
                <span className="font-bold text-beauty-danger">신고 내용: </span>
                {r.detail}
              </div>

              <div className="mt-3 flex justify-end gap-2">
                {r.status === "open" && (
                  <form action={resolveReportAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-btn bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-light">
                      처리완료
                    </button>
                  </form>
                )}
                <form action={deleteReportAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-danger hover:text-beauty-danger">
                    삭제
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
