import Link from "next/link";
import Header from "@/components/Header";
import ConfirmButton from "@/components/ConfirmButton";
import { requireSession } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { cancelMyEnrollmentAction, deleteMyEnrollmentAction } from "@/app/actions/my-enroll";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  active: { text: "수강중", cls: "bg-[#E8F5E9] text-beauty-success" },
  pending: { text: "입금대기", cls: "bg-primary-pale text-primary" },
  paid: { text: "결제완료", cls: "bg-[#E8F5E9] text-beauty-success" },
  expired: { text: "만료", cls: "bg-gray-100 text-beauty-gray" },
  cancelled: { text: "취소", cls: "bg-gray-100 text-beauty-gray" },
};

export default async function HistoryPage() {
  const session = await requireSession("/mypage/history");
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-12">
        <Link href="/mypage" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
          ← 마이페이지
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-beauty-neutral">결제·수강 내역</h1>
        <p className="mb-8 text-sm text-beauty-gray">
          신청 내역을 취소하거나 삭제할 수 있습니다. 취소·삭제 후에도 기록은 목록에 보존됩니다.
        </p>

        {enrollments.length === 0 ? (
          <div className="card text-center text-beauty-gray">신청 내역이 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((e) => {
              const s = STATUS_LABEL[e.status] || { text: e.status, cls: "bg-gray-100" };
              const canCancel = !e.userDeleted && ["pending", "active"].includes(e.status);
              return (
                <div
                  key={e.id}
                  className={`card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
                    e.userDeleted ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-beauty-neutral">{e.course.name}</p>
                    <p className="text-sm text-beauty-gray">
                      {e.createdAt.toLocaleDateString("ko-KR")} · {e.amount.toLocaleString()}원
                      {e.expiresAt && ` · ~${e.expiresAt.toLocaleDateString("ko-KR")}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {e.userDeleted ? (
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-beauty-gray">
                        삭제됨
                      </span>
                    ) : (
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>
                        {s.text}
                      </span>
                    )}

                    {canCancel && (
                      <form action={cancelMyEnrollmentAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <ConfirmButton
                          message="이 수강신청을 취소하시겠습니까? 취소 후에도 내역은 남습니다."
                          className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-danger hover:text-beauty-danger"
                        >
                          취소
                        </ConfirmButton>
                      </form>
                    )}

                    {!e.userDeleted && (
                      <form action={deleteMyEnrollmentAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <ConfirmButton
                          message="이 내역을 삭제하시겠습니까? 목록에는 '삭제됨'으로 남습니다."
                          className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-beauty-danger hover:text-beauty-danger"
                        >
                          삭제
                        </ConfirmButton>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
