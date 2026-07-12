import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { resolvePostLoginRedirect } from "@/lib/post-login-redirect";
import LoginForm from "@/components/auth/LoginForm";
import PassmasterLogo from "@/components/PassmasterLogo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const session = await getSession();
  if (session) {
    redirect(resolvePostLoginRedirect(session.role, searchParams.redirect));
  }

  const redirectTo = searchParams.redirect || "/dashboard";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-beauty-bg px-4 py-12">
      <Link href="/" className="mb-8 flex items-center">
        <PassmasterLogo className="h-12 w-auto" priority />
      </Link>
      <div className="card w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-beauty-neutral">로그인</h1>
        <p className="mb-6 text-sm text-beauty-gray">자격증 합격, 지금 시작하세요.</p>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}
