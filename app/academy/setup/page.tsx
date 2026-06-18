import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AcademySetupForm from "@/components/academy/AcademySetupForm";

export default async function AcademySetupPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-b2b-light p-4">
        <p className="text-slate-600">유효하지 않은 초대 링크입니다.</p>
      </main>
    );
  }

  const invite = await prisma.academyInvite.findUnique({
    where: { token },
    include: { academy: true },
  });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-b2b-light p-4">
        <p className="text-slate-600">만료되었거나 이미 사용된 초대 링크입니다.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-b2b-light px-4 py-12">
      <Link href="/" className="mb-8">
        <Image src="/logo.png" alt="BEAUTYmaster" width={160} height={48} className="h-10 w-auto" />
      </Link>
      <div className="b2b-card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-b2b-primary">학원 관리자 설정</h1>
        <p className="mb-6 text-sm text-slate-500">
          {invite.academy.name} · {invite.role === "owner" ? "원장" : invite.role === "teacher" ? "강사" : "관리자"} 계정
        </p>
        <AcademySetupForm token={token} />
        <p className="mt-4 text-center text-xs text-slate-400">
          이메일: {invite.email}
        </p>
      </div>
    </main>
  );
}
