import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { resolvePostLoginRedirect } from "@/lib/post-login-redirect";
import LoginForm from "@/components/auth/LoginForm";
import PassmasterLogo from "@/components/PassmasterLogo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const session = await getSession();
  if (session) {
    redirect(resolvePostLoginRedirect(session.role, searchParams.redirect));
  }

  const redirectTo = searchParams.redirect || "/dashboard";
  const oauthError = searchParams.error;
  const oauthErrorMsg =
    oauthError === "google_not_configured" || oauthError === "kakao_not_configured"
      ? "소셜 로그인 설정이 아직 완료되지 않았습니다. 이메일로 로그인해 주세요."
      : oauthError === "kakao_email_required"
        ? "카카오 계정 이메일 제공 동의가 필요합니다."
        : oauthError
          ? "소셜 로그인에 실패했습니다. 다시 시도해 주세요."
          : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-beauty-bg px-4 py-12">
      <Link href="/" className="mb-8 flex items-center">
        <PassmasterLogo className="h-12 w-auto" priority />
      </Link>
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-beauty-neutral">로그인</h1>
        <p className="mb-6 text-sm text-beauty-gray">
          이메일 또는 카카오·구글 계정으로 로그인할 수 있습니다.
        </p>
        {oauthErrorMsg && (
          <p className="mb-4 rounded-btn bg-amber-50 px-4 py-2 text-sm text-amber-800">{oauthErrorMsg}</p>
        )}
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
