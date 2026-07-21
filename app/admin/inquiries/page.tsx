import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { INQUIRY_STATUS, inquiryCategoryLabel } from "@/lib/support-inquiry";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const STATUS_TABS = [
  { key: "pending", label: "답변 대기" },
  { key: "answered", label: "답변 완료" },
  { key: "closed", label: "종료" },
  { key: "all", label: "전체" },
] as const;

function listHref(status: string, page: number) {
  const params = new URLSearchParams();
  if (status !== "pending") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/inquiries?${qs}` : "/admin/inquiries";
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const statusParam = searchParams.status || "pending";
  const statusFilter = STATUS_TABS.some((t) => t.key === statusParam) ? statusParam : "pending";

  const where: Prisma.SupportInquiryWhereInput =
    statusFilter === "all" ? {} : { status: statusFilter };

  const [filteredCount, pendingCount, answeredCount, closedCount, totalCount] = await Promise.all([
    prisma.supportInquiry.count({ where }),
    prisma.supportInquiry.count({ where: { status: "pending" } }),
    prisma.supportInquiry.count({ where: { status: "answered" } }),
    prisma.supportInquiry.count({ where: { status: "closed" } }),
    prisma.supportInquiry.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  const pageParam = Number(searchParams.page) || 1;
  const page = Math.min(Math.max(1, pageParam), totalPages);

  const inquiries = await prisma.supportInquiry.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

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
            제목을 클릭하면 문의 내용을 확인하고 답변을 등록할 수 있습니다.
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
            href={listHref(t.key, 1)}
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

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-bold text-beauty-gray">
              <th className="px-4 py-3 text-center" style={{ width: "64px" }}>번호</th>
              <th className="px-4 py-3" style={{ width: "110px" }}>분류</th>
              <th className="px-4 py-3">질문내용</th>
              <th className="px-4 py-3" style={{ width: "140px" }}>질문자</th>
              <th className="px-4 py-3" style={{ width: "120px" }}>날짜</th>
              <th className="px-4 py-3 text-center" style={{ width: "100px" }}>답변여부</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-beauty-gray">
                  {statusFilter === "pending"
                    ? "답변 대기 중인 문의가 없습니다."
                    : statusFilter === "answered"
                      ? "답변 완료된 문의가 없습니다."
                      : statusFilter === "closed"
                        ? "종료된 문의가 없습니다."
                        : "등록된 문의가 없습니다."}
                </td>
              </tr>
            ) : (
              inquiries.map((item) => {
                const status = INQUIRY_STATUS[item.status] ?? {
                  label: item.status,
                  cls: "bg-gray-100 text-beauty-gray",
                };
                return (
                  <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-primary-pale/20">
                    <td className="px-4 py-3 text-center text-beauty-gray">{item.id}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary-pale px-2.5 py-0.5 text-xs font-bold text-primary">
                        {inquiryCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/inquiries/${item.id}?${new URLSearchParams({ status: statusFilter, page: String(page) })}`}
                        className="block font-semibold text-beauty-neutral hover:text-primary hover:underline"
                      >
                        {item.subject}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-beauty-gray" style={{ maxWidth: "420px" }}>
                        {item.content}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-beauty-neutral">{item.user.name}</p>
                      <p className="truncate text-xs text-beauty-gray" style={{ maxWidth: "130px" }}>
                        {item.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-beauty-gray">
                      {item.createdAt.toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          {page > 1 && (
            <Link
              href={listHref(statusFilter, page - 1)}
              className="rounded-btn border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-beauty-neutral hover:border-primary hover:text-primary"
            >
              이전
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={listHref(statusFilter, p)}
              className={`rounded-btn px-3 py-1.5 text-sm font-semibold ${
                p === page
                  ? "bg-primary text-white"
                  : "border border-gray-200 bg-white text-beauty-neutral hover:border-primary hover:text-primary"
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={listHref(statusFilter, page + 1)}
              className="rounded-btn border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-beauty-neutral hover:border-primary hover:text-primary"
            >
              다음
            </Link>
          )}
        </div>
      )}

      <p className="mt-3 text-center text-xs text-beauty-gray">
        총 {filteredCount.toLocaleString()}건 · 페이지당 {PAGE_SIZE}건
      </p>
    </div>
  );
}
