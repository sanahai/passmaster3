import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import PassmasterLogo from "@/components/PassmasterLogo";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-[#ebf0fa] bg-white/[0.94] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <PassmasterLogo priority />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          {session ? (
            <>
              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden rounded-btn px-3 py-2 text-sm font-semibold text-beauty-neutral hover:text-primary sm:inline"
                >
                  관리자
                </Link>
              )}
              <Link
                href="/dashboard"
                className="rounded-btn px-3 py-2 text-sm font-semibold text-beauty-neutral hover:text-primary"
              >
                내 학습
              </Link>
              <Link
                href="/mypage"
                className="hidden rounded-btn px-3 py-2 text-sm font-semibold text-beauty-neutral hover:text-primary sm:inline"
              >
                마이페이지
              </Link>
              <span className="hidden text-sm text-beauty-gray md:inline">
                {session.name}님
              </span>
              <form action={logoutAction}>
                <button className="rounded-btn px-3 py-2 text-sm font-semibold text-beauty-gray hover:text-primary">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-btn px-3 py-2 text-sm font-semibold text-beauty-neutral hover:text-primary"
              >
                로그인
              </Link>
              <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
                무료 시작하기
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
