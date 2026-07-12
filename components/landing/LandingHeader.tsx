import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { resolvePostLoginRedirect } from "@/lib/post-login-redirect";
import PassmasterLogo from "@/components/PassmasterLogo";

export default async function LandingHeader() {
  const session = await getSession();
  const learnHref = session ? resolvePostLoginRedirect(session.role) : "/login";

  return (
    <header className="header">
      <Link className="logo-wrap" href="/">
        <PassmasterLogo className="landing-logo" priority />
      </Link>
      <nav className="nav">
        <Link href="/enroll">수강신청</Link>
        <a href="/#cert-courses">자격증</a>
        <a href="/#roadmap-overview">합격 로드맵</a>
        <a href="/#learning-roadmap">학습로드맵</a>
        <Link href={learnHref}>학습 시작</Link>
        <a href="/#reviews">수강후기</a>
        <Link href="/support">고객센터</Link>
      </nav>
      <div className="auth">
        {session ? (
          <>
            <span className="landing-user-label">{session.name}님</span>
            <Link className="btn btn-ghost" href={learnHref}>
              {session.role === "admin" ? "관리자" : "내 학습"}
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-primary">
                로그아웃
              </button>
            </form>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" href="/login">
              로그인
            </Link>
            <Link className="btn btn-primary" href="/signup">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
