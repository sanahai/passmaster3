import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { resolvePostLoginRedirect } from "@/lib/post-login-redirect";
import { isTrialPath } from "@/lib/trial-access";
import AuthGuideInfo from "@/components/auth/AuthGuideInfo";
import SignupForm from "@/components/auth/SignupForm";
import PassmasterLogo from "@/components/PassmasterLogo";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { redirect?: string; academyCode?: string };
}) {
  const session = await getSession();
  if (session) {
    redirect(resolvePostLoginRedirect(session.role, searchParams.redirect));
  }

  const redirectTo = searchParams.redirect || "/enroll";
  const trialFlow = isTrialPath(redirectTo);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center">
        <PassmasterLogo className="h-12 w-auto" priority />
      </Link>
      <div className="w-full max-w-md">
        <div className="card w-full">
          <h1 className="mb-1 text-2xl font-bold text-beauty-neutral">회원가입</h1>
          <p className="mb-6 text-sm text-beauty-gray">
            {trialFlow ? (
              <>
                무료체험은 <span className="font-semibold text-primary">회원가입 후 로그인</span>한
                회원만 이용할 수 있습니다. 가입 후 바로 체험을 시작하세요.
              </>
            ) : (
              <>
                가입하면 <span className="font-semibold text-primary">무료체험 100문제</span>를 바로
                풀어볼 수 있어요.
              </>
            )}
          </p>
          <Suspense fallback={<p className="text-sm text-beauty-gray">로딩 중...</p>}>
            <SignupForm redirectTo={redirectTo} />
          </Suspense>
        </div>
        <AuthGuideInfo variant="signup" />
      </div>
    </main>
  );
}
