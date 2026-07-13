import Link from "next/link";
import Header from "@/components/Header";
import InquiryForm from "@/components/support/InquiryForm";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { INQUIRY_STATUS, inquiryCategoryLabel } from "@/lib/support-inquiry";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PASSmaster | 1:1 문의 내역",
  description: "PASSmaster 1:1 문의 접수 및 내역 확인",
};

export default async function SupportInquiriesPage() {
  const session = await requireSession("/support/inquiries");

  const inquiries = await prisma.supportInquiry.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
        <Link href="/support" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
          ← 고객센터
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">1:1 문의</h1>
        <p className="mb-8 text-sm text-beauty-gray">
          결제·환불, 수강 승인, 학습 이용 등 궁금한 점을 남겨 주세요. 접수 후 영업일 기준 1~2일 내 답변을
          드립니다. (주말·공휴일은 순차 처리)
        </p>

        <section className="card mb-8">
          <h2 className="mb-1 text-lg font-bold text-beauty-neutral">새 문의 접수</h2>
          <p className="mb-6 text-sm text-beauty-gray">
            수강 과정명, 결제 일시, 오류 화면 등을 함께 적어 주시면 처리가 빠릅니다.
          </p>
          <InquiryForm />
        </section>

        <section className="card">
          <h2 className="mb-1 text-lg font-bold text-beauty-neutral">문의 내역</h2>
          <p className="mb-6 text-sm text-beauty-gray">접수한 문의와 답변을 확인할 수 있습니다.</p>

          {inquiries.length === 0 ? (
            <div className="rounded-card border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-beauty-gray">
              아직 접수한 문의가 없습니다. 위 양식으로 첫 문의를 남겨 주세요.
            </div>
          ) : (
            <ul className="space-y-4">
              {inquiries.map((item) => {
                const status = INQUIRY_STATUS[item.status] ?? {
                  label: item.status,
                  cls: "bg-gray-100 text-beauty-gray",
                };
                return (
                  <li key={item.id} className="rounded-card border border-gray-100 p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-beauty-neutral">{item.subject}</p>
                        <p className="mt-1 text-xs text-beauty-gray">
                          {inquiryCategoryLabel(item.category)} ·{" "}
                          {item.createdAt.toLocaleString("ko-KR")}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-beauty-neutral">
                      {item.content}
                    </p>
                    {item.reply && (
                      <div className="mt-4 rounded-card border border-primary/20 bg-primary-pale/40 p-4">
                        <p className="mb-1 text-xs font-bold text-primary">관리자 답변</p>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-beauty-neutral">
                          {item.reply}
                        </p>
                        {item.repliedAt && (
                          <p className="mt-2 text-xs text-beauty-gray">
                            {item.repliedAt.toLocaleString("ko-KR")}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="mt-8 rounded-card bg-primary-pale/40 p-5 text-sm text-beauty-gray">
          <p className="font-semibold text-beauty-neutral">빠른 안내</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>결제·환불: 입금자명, 신청 과정, 입금 일시를 함께 남겨 주세요.</li>
            <li>수강 승인: 마이페이지에서 입금 대기 상태인지 먼저 확인해 주세요.</li>
            <li>학습 오류: 사용 중인 기기(PC/모바일)와 브라우저도 알려 주시면 도움이 됩니다.</li>
          </ul>
        </div>
      </main>
    </>
  );
}
