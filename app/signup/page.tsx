import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import SignupForm from "@/components/auth/SignupForm";
import PassmasterLogo from "@/components/PassmasterLogo";

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-beauty-bg px-4 py-12">
      <Link href="/" className="mb-8 flex items-center">
        <PassmasterLogo className="h-12 w-auto" priority />
      </Link>
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-beauty-neutral">회원가입</h1>
        <p className="mb-6 text-sm text-beauty-gray">
          가입하면 <span className="font-semibold text-primary">무료체험 100문제</span>를 바로 풀어볼 수 있어요.
        </p>
        <Suspense fallback={<p className="text-sm text-beauty-gray">로딩 중...</p>}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}
