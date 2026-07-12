import Link from "next/link";
import PassmasterLogo from "@/components/PassmasterLogo";

export default function LandingHeader() {
  return (
    <header className="header">
      <Link className="logo-wrap" href="/">
        <PassmasterLogo className="landing-logo" priority />
      </Link>
      <nav className="nav">
        <Link href="/enroll">수강신청</Link>
        <a href="/#cert-courses">자격증</a>
        <a href="/#cert-courses">최단합격 플랜</a>
        <a href="/#learning-roadmap">학습로드맵</a>
        <Link href="/login">학습 시작</Link>
        <a href="/#reviews">수강후기</a>
        <Link href="/support">고객센터</Link>
      </nav>
      <div className="auth">
        <Link className="btn btn-ghost" href="/login">로그인</Link>
        <Link className="btn btn-primary" href="/signup">회원가입</Link>
      </div>
    </header>
  );
}
