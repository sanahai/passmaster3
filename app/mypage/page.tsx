import Link from "next/link";
import Header from "@/components/Header";
import AcademyCodeForm from "@/components/academy/AcademyCodeForm";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export default async function MyPage() {
  const session = await requireSession("/mypage");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true },
  });
  const enrollCount = await prisma.enrollment.count({
    where: { userId: session.userId, status: "active" },
  });
  const answered = await prisma.userAnswer.count({ where: { userId: session.userId } });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold text-beauty-neutral">마이페이지</h1>

        <div className="card mb-6">
          <h2 className="mb-4 text-lg font-bold text-beauty-neutral">내 정보</h2>
          <dl className="space-y-3 text-sm">
            <Row label="이름" value={user?.name || "-"} />
            <Row label="이메일" value={user?.email || "-"} />
            <Row label="연락처" value={user?.phone || "미등록"} />
            <Row label="가입일" value={user?.createdAt.toLocaleDateString("ko-KR") || "-"} />
          </dl>
        </div>

        {user?.role === "student" && (
          <div className="mb-6">
            <AcademyCodeForm currentAcademy={user.academy?.name} />
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-extrabold text-primary">{enrollCount}</div>
            <div className="mt-1 text-xs text-beauty-gray">수강 중 과정</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-extrabold text-primary">{answered.toLocaleString()}</div>
            <div className="mt-1 text-xs text-beauty-gray">누적 푼 문제</div>
          </div>
        </div>

        <Link href="/mypage/history" className="btn-outline w-full">
          결제·수강 내역 보기
        </Link>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
      <dt className="text-beauty-gray">{label}</dt>
      <dd className="font-semibold text-beauty-neutral">{value}</dd>
    </div>
  );
}
