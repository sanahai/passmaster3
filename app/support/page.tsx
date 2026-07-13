import Link from "next/link";
import "../landing.css";
import "../subpage.css";
import LandingHeader from "@/components/landing/LandingHeader";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "PASSmaster | 고객센터",
  description: "PASSmaster 고객센터 — FAQ, 결제·환불 안내, 1:1 문의",
};

export default async function SupportPage() {
  const session = await getSession();

  return (
    <>
      <div className="floating left" />
      <div className="floating right" />
      <div className="container">
        <div className="subpage-wrap">
          <LandingHeader />
          <main className="subpage-main">
            <p className="subpage-pill">User Flow</p>
            <h1>고객센터</h1>
            <p className="subpage-summary">
              FAQ는 누구나 이용할 수 있습니다. <strong>1:1 문의</strong> 등 티켓 기능은 로그인한 회원에게만
              제공됩니다.
            </p>

            <section className="subpage-card">
              <h2>FAQ (비회원 가능)</h2>
              <p className="legal-detail">결제·환불·약관 등 안내는 아래에서 확인하세요.</p>
              <div className="subpage-cta-row" style={{ margin: 0 }}>
                <Link className="btn btn-ghost" href="/support/faq">자주 묻는 질문</Link>
                <Link className="btn btn-ghost" href="/legal#refund">환불정책</Link>
              </div>
            </section>

            <section className="subpage-card">
              <h2>1:1 문의{session ? "" : " · 로그인 필요"}</h2>
              <p className="legal-detail">
                {session ? (
                  <>
                    문의 접수와 내역 확인은 <strong>문의 내역</strong> 페이지에서 할 수 있습니다.
                  </>
                ) : (
                  <>
                    문의 접수·내역 확인은 <strong>회원 로그인</strong> 후 이용할 수 있습니다. 아직 계정이 없다면
                    회원가입을 진행해 주세요.
                  </>
                )}
              </p>
              <div className="subpage-cta-row" style={{ margin: 0 }}>
                {session ? (
                  <Link className="btn btn-primary" href="/support/inquiries">문의 내역</Link>
                ) : (
                  <>
                    <Link className="btn btn-primary" href="/login?redirect=%2Fsupport%2Finquiries">로그인</Link>
                    <Link className="btn btn-ghost" href="/signup">회원가입</Link>
                  </>
                )}
              </div>
            </section>

            <section className="subpage-card">
              <h2>회원 · 학습·수강 문의</h2>
              <p className="legal-detail">로그인 후 마이페이지에서 수강 현황을 확인하거나 문의를 접수할 수 있습니다.</p>
              <div className="subpage-cta-row" style={{ margin: 0 }}>
                <Link className="btn btn-ghost" href="/mypage">마이페이지</Link>
                <Link className="btn btn-ghost" href="/dashboard">내 학습 현황</Link>
              </div>
            </section>

            <section className="subpage-card">
              <h2>약관 및 정책</h2>
              <p className="legal-detail">이용약관, 개인정보처리방침, 환불정책은 법적 고지 페이지에서 확인할 수 있습니다.</p>
              <div className="subpage-cta-row" style={{ margin: 0 }}>
                <Link className="btn btn-ghost" href="/legal#terms">이용약관</Link>
                <Link className="btn btn-ghost" href="/legal#privacy">개인정보처리방침</Link>
                <Link className="btn btn-ghost" href="/legal#company">회사정보</Link>
              </div>
            </section>

            <div className="subpage-cta-row">
              <Link className="btn btn-ghost" href="/">메인으로</Link>
              <Link className="btn btn-primary" href="/support/faq">FAQ 보기</Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
