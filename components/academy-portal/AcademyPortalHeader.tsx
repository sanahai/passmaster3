import Link from "next/link";
import type { AcademyPortal } from "@/lib/academy-portal";
import { academySignupUrl } from "@/lib/academy-portal";
import PassmasterLogo from "@/components/PassmasterLogo";

type Props = {
  academy: AcademyPortal;
  subdomain: string;
};

export default function AcademyPortalHeader({ academy, subdomain }: Props) {
  const signupHref = academySignupUrl(academy.code);
  const loginHref = `/login?redirect=${encodeURIComponent(`/a/${subdomain}/dashboard`)}`;
  const adminLoginHref = `/login?redirect=${encodeURIComponent(`/a/${subdomain}/admin`)}`;

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 shadow-sm"
      style={{ backgroundColor: academy.primaryColor || "#0F172A" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/a/${subdomain}`} className="flex items-center gap-3">
          {academy.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={academy.logoUrl} alt={academy.name} className="h-9 w-auto rounded object-contain" />
          ) : (
            <PassmasterLogo className="h-8 w-auto rounded bg-white/95 px-1" />
          )}
          <span className="text-lg font-bold text-white">{academy.name}</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href={`/a/${subdomain}#courses`} className="hidden text-sm text-white/80 hover:text-white sm:inline">
            과정
          </Link>
          <Link href={`/a/${subdomain}#guide`} className="hidden text-sm text-white/80 hover:text-white sm:inline">
            시작하기
          </Link>
          <Link href={loginHref} className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
            로그인
          </Link>
          <Link href={adminLoginHref} className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 sm:inline">
            관리자
          </Link>
          <Link
            href={signupHref}
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-white/90"
          >
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
