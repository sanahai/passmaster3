import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InquiryReplyForm from "@/components/admin/InquiryReplyForm";
import { deleteInquiryAction, setInquiryStatusAction } from "@/app/actions/admin-inquiry";
import { INQUIRY_STATUS, inquiryCategoryLabel } from "@/lib/support-inquiry";

export const dynamic = "force-dynamic";

export default async function AdminInquiryDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { status?: string; page?: string };
}) {
  const id = Number(params.id);
  if (!id) notFound();

  const item = await prisma.supportInquiry.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
  if (!item) notFound();

  const backParams = new URLSearchParams();
  if (searchParams.status && searchParams.status !== "pending") backParams.set("status", searchParams.status);
  if (searchParams.page && searchParams.page !== "1") backParams.set("page", searchParams.page);
  const backQs = backParams.toString();
  const backHref = backQs ? `/admin/inquiries?${backQs}` : "/admin/inquiries";

  const status = INQUIRY_STATUS[item.status] ?? {
    label: item.status,
    cls: "bg-gray-100 text-beauty-gray",
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={backHref} className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
        ← 문의 목록
      </Link>

      <article className="card">
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
            <h1 className="text-xl font-bold text-beauty-neutral">{item.subject}</h1>
          </div>
          <p className="text-xs text-beauty-gray">{item.createdAt.toLocaleString("ko-KR")}</p>
        </div>

        <div className="mb-3 rounded-btn bg-gray-50 px-4 py-3 text-sm">
          <p className="font-semibold text-beauty-neutral">
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
          {item.status !== "closed" && (
            <form action={setInquiryStatusAction}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="status" value="closed" />
              <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-gray">
                종료 처리
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
            <input type="hidden" name="redirectTo" value={backHref} />
            <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-danger hover:text-beauty-danger">
              삭제
            </button>
          </form>
        </div>
      </article>
    </div>
  );
}
