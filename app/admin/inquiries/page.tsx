import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import InquiryReplyForm from "@/components/admin/InquiryReplyForm";
import { deleteInquiryAction, setInquiryStatusAction } from "@/app/actions/admin-inquiry";
import { INQUIRY_STATUS, inquiryCategoryLabel } from "@/lib/support-inquiry";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { key: "pending", label: "답변 대기" },
  { key: "answered", label: "답변 완료" },
  { key: "closed", label: "종료" },
  { key: "all", label: "전체" },
] as const;

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusParam = searchParams.status || "pending";
  const statusFilter = STATUS_TABS.some((t) => t.key === statusParam) ? statusParam : "pending";

  const where: Prisma.SupportInquiryWhereInput =
    statusFilter === "all" ? {} : { status: statusFilter };

  const [inquiries, pendingCount, answeredCount, closedCount, totalCount] = await Promise.all([
    prisma.supportInquiry.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.supportInquiry.count({ where: { status: "pending" } }),
    prisma.supportInquiry.count({ where: { status: "answered" } }),
    prisma.supportInquiry.count({ where: { status: "closed" } }),
    prisma.supportInquiry.count(),
  ]);

  const counts: Record<string, number> = {
    pending: pendingCount,
    answered: answeredCount,
    closed: closedCount,
    all: totalCount,
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-beauty-neutral">1:1 문의 관리</h1>
          <p className="mt-1 text-sm text-beauty-gray">
            회원 문의 접수·답변·종료 처리를 할 수 있습니다. 답변은 회원 문의 내역 페이지에 표시됩니다.
          </p>
        </div>
        <Link href="/support/inquiries" className="text-sm font-semibold text-primary hover:underline">
          회원 문의 페이지 보기 →
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "pending" ? "/admin/inquiries" : `/admin/inquiries?status=${t.key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              statusFilter === t.key
                ? "bg-primary text-white"
                : "bg-white text-beauty-neutral shadow-card hover:text-primary"
            }`}
          >
            {t.label} {counts[t.key]}
          </Link>
        ))}
      </div>

      {inquiries.length === 0 ? (
        <div className="card text-center text-beauty-gray">
          {statusFilter === "pending"
            ? "답변 대기 중인 문의가 없습니다."
            : statusFilter === "answered"
              ? "답변 완료된 문의가 없습니다."
              : statusFilter === "closed"
                ? "종료된 문의가 없습니다."
                : "등록된 문의가 없습니다."}
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((item) => {
            const status = INQUIRY_STATUS[item.status] ?? {
              label: item.status,
              cls: "bg-gray-100 text-beauty-gray",
            };
            return (
              <article key={item.id} className="card">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="rounded-full bg-primary-pale px-2.5 py-0.5 text-xs font-bold text-primary">
                        {inquiryCategoryLabel(item.category)}
                      </span>
                      <span className="text-xs text-beauty-gray">#{item.id}</span>
                    </div>
                    <h2 className="text-lg font-bold text-beauty-neutral">{item.subject}</h2>
                  </div>
                  <p className="text-xs text-beauty-gray">{item.createdAt.toLocaleString("ko-KR")}</p>
                </div>

                <div className="mb-3 rounded-btn bg-gray-50 px-4 py-3 text-sm">
                  <p className="mb-1 font-semibold text-beauty-neutral">
                    {item.user.name}{" "}
                    <span className="font-normal text-beauty-gray">
                      ({item.user.email}
                      {item.user.phone ? ` · ${item.user.phone}` : ""})
                    </span>
                  </p>
                </div>

                <div className="rounded-btn border border-gray-100 bg-white px-4 py-3">
                  <p className="mb-1 text-xs font-bold text-beauty-gray">문의 내용</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-beauty-neutral">{item.content}</p>
                </div>

                {item.reply && (
                  <div className="mt-3 rounded-btn border border-primary/20 bg-primary-pale/40 px-4 py-3">
                    <p className="mb-1 text-xs font-bold text-primary">등록된 답변</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-beauty-neutral">{item.reply}</p>
                    {item.repliedAt && (
                      <p className="mt-2 text-xs text-beauty-gray">{item.repliedAt.toLocaleString("ko-KR")}</p>
                    )}
                  </div>
                )}

                {item.status !== "closed" && (
                  <InquiryReplyForm inquiryId={item.id} defaultReply={item.reply ?? ""} />
                )}

                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
                  {item.status === "pending" && (
                    <form action={setInquiryStatusAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="closed" />
                      <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-gray">
                        종료 처리
                      </button>
                    </form>
                  )}
                  {item.status === "answered" && (
                    <form action={setInquiryStatusAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="closed" />
                      <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-gray">
                        종료
                      </button>
                    </form>
                  )}
                  {item.status === "closed" && (
                    <form action={setInquiryStatusAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="pending" />
                      <button className="rounded-btn border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-pale">
                        다시 대기로
                      </button>
                    </form>
                  )}
                  <form action={deleteInquiryAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-danger hover:text-beauty-danger">
                      삭제
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
