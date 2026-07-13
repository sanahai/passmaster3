import Link from "next/link";
import "../../landing.css";
import "../../subpage.css";
import LandingHeader from "@/components/landing/LandingHeader";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "PASSmaster | FAQ",
  description: "PASSmaster 자주 묻는 질문 — 수강신청, 결제, 환불, 학습 안내",
};

const FAQ_ITEMS = [
  {
    q: "수강 신청은 언제까지 가능한가요?",
    a: (
      <>
        <strong>항상 신청 가능</strong>합니다. 미리 무료 체험으로 문제 풀이와 학습 환경을 확인해 보신 뒤, 바로
        수강 신청하실 수 있습니다.
      </>
    ),
  },
  {
    q: "결제/입금 확인은 얼마나 걸리나요?",
    a: (
      <>
        <strong>평일</strong> 기준 <strong>1~2시간 이내</strong> 처리를 목표로 하며,
        <strong> 야간·주말·공휴일</strong>에는 <strong>6시간 이내</strong>에 순차 확인·처리합니다. (금융·시스템
        사정에 따라 다소 지연될 수 있습니다.)
      </>
    ),
  },
  {
    q: "수강현황은 어디에서 확인하나요?",
    a: "로그인 후 마이페이지의 수강현황 메뉴에서 신청 상태, 승인 여부, 진행률을 실시간으로 확인할 수 있습니다.",
  },
  {
    q: "계정/로그인 문제는 어떻게 해결하나요?",
    a: (
      <>
        고객센터 문의 또는 로그인 후 <strong>비밀번호 변경</strong>(마이페이지) 기능을 이용해 주세요. 본인 인증 후 1:1로 빠르게 도와드립니다.
      </>
    ),
  },
  {
    q: "모바일에서도 수강이 가능한가요?",
    a: "네, 모바일/태블릿/PC 모두 지원합니다. 동일 계정으로 기기 전환 시 학습 진도도 자동 연동됩니다.",
  },
  {
    q: "강의 자료나 교재도 제공되나요?",
    a: (
      <>
        PASSmaster는 <strong>문제은행식</strong> 과정입니다. 따라서 별도의 강의 영상·강의자료·교재 패키지는
        제공하지 않으며, 문제 풀이·오답·모의고사 등 학습 화면 안에서 학습하게 됩니다.
      </>
    ),
  },
  {
    q: "환불 규정은 어떻게 되나요?",
    a: (
      <>
        전자상거래법 및 내부 약관을 기준으로 진행률/이용기간에 따라 환불 금액이 산정됩니다.{" "}
        <Link href="/legal#refund">환불정책</Link>에서 상세 확인이 가능합니다.
      </>
    ),
  },
  {
    q: "수료 후 재수강 혜택이 있나요?",
    a: "일부 과정은 수료 후 30일 복습 기간이 제공되며, 재수강 할인 쿠폰도 지급됩니다.",
  },
];

export default async function SupportFaqPage() {
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
            <h1>FAQ</h1>
            <p className="subpage-summary">
              수강 신청·결제·환불·학습 진행 안내입니다. 추가 도움이 필요하면 FAQ 다음에 <strong>로그인 후</strong>
              1:1 문의를 이용해 주세요.
            </p>

            <section className="subpage-card">
              <h2>자주 묻는 질문</h2>
              {FAQ_ITEMS.map((item) => (
                <div className="faq-entry" key={item.q}>
                  <h3>{item.q}</h3>
                  <p className="legal-detail">{item.a}</p>
                </div>
              ))}
            </section>

            <div className="subpage-cta-row">
              <Link className="btn btn-ghost" href="/support">고객센터 홈</Link>
              {session ? (
                <Link className="btn btn-primary" href="/support/inquiries">1:1 문의 내역</Link>
              ) : (
                <Link className="btn btn-primary" href="/login?redirect=%2Fsupport%2Finquiries">
                  1:1 문의(로그인 필요)
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
