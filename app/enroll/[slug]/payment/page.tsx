import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import CopyButton from "@/components/CopyButton";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";

const BANK = {
  name: "카카오뱅크",
  account: "3333-37-436928",
  holder: "이동길",
};

export default async function PaymentPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await requireSession();
  const course = await prisma.course.findUnique({ where: { slug: params.slug } });
  if (!course) redirect("/enroll");

  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 24);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">결제 안내 (계좌이체)</h1>
        <p className="mb-8 text-beauty-gray">
          아래 계좌로 입금해 주세요. <strong className="text-beauty-neutral">관리자 입금 확인 후 승인</strong>되면
          학습을 시작할 수 있습니다.
        </p>

        {/* 결제 금액 */}
        <div className="mb-5 rounded-card bg-white p-6 text-center shadow-card">
          <p className="text-sm text-beauty-gray">결제 금액</p>
          <p className="mt-1 text-4xl font-extrabold text-primary">
            {course.price.toLocaleString()}
            <span className="ml-1 text-2xl">원</span>
          </p>
          <p className="mt-2 text-sm text-beauty-neutral">{course.name} · {course.durationDays}일</p>
        </div>

        {/* 입금 계좌 카드 (이미지 카드 형식) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light p-6 text-white shadow-cardHover">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">입금 계좌</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">BEAUTYmaster</span>
            </div>

            <div className="mb-1 text-sm text-white/70">은행</div>
            <div className="mb-4 text-2xl font-extrabold tracking-wide">{BANK.name}</div>

            <div className="mb-1 text-sm text-white/70">계좌번호</div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-3xl font-extrabold tracking-wider">{BANK.account}</span>
              <CopyButton text={BANK.account.replace(/-/g, "")} label="계좌복사" />
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="mb-1 text-sm text-white/70">예금주</div>
                <div className="text-xl font-bold">{BANK.holder}</div>
              </div>
              <div className="text-right">
                <div className="mb-1 text-sm text-white/70">입금자명</div>
                <div className="text-xl font-bold">{session.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 입금 기한 강조 */}
        <div className="mt-5 flex items-center justify-between rounded-card border border-primary/20 bg-primary-pale/40 px-5 py-4">
          <span className="text-sm font-semibold text-beauty-neutral">입금 기한</span>
          <span className="text-lg font-extrabold text-primary">
            {deadline.toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}까지
          </span>
        </div>

        {/* 안내 */}
        <div className="mt-6 rounded-card bg-white p-5 text-sm shadow-card">
          <p className="font-bold text-beauty-neutral">📌 입금 시 유의사항</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-beauty-gray">
            <li>
              반드시 <strong className="text-beauty-neutral">입금자명을 가입자명({session.name})과 동일</strong>하게
              입금해 주세요.
            </li>
            <li>관리자가 입금을 확인하고 승인하면 학습이 활성화됩니다.</li>
            <li>입금 기한 내 미입금 시 신청이 자동 취소될 수 있습니다.</li>
            <li>승인 현황은 대시보드 또는 마이페이지에서 확인할 수 있습니다.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-primary flex-1 text-center">
            입금 완료 · 대시보드로 이동
          </Link>
          <Link href="/mypage/history" className="btn-outline flex-1 text-center">
            신청 내역 보기
          </Link>
        </div>
      </main>
    </>
  );
}
