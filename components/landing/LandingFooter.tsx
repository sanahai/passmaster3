import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <strong>PASSmaster</strong>
          <p>필기 합격의 가장 빠른 루트, 데이터 기반 학습 플랫폼</p>
        </div>
        <div className="footer-links">
          <Link href="/legal#company">회사정보</Link>
          <Link href="/legal#terms">이용약관</Link>
          <Link href="/legal#privacy">개인정보처리방침</Link>
          <Link href="/legal#refund">환불정책</Link>
          <Link href="/support">고객센터</Link>
        </div>
      </div>
      <div className="footer-company">
        <p>
          <strong>주식회사 모든코퍼레이션</strong> · 대표이사 이동길 · 사업자등록번호 402-86-15931
        </p>
        <p>통신판매업 신고 제2022-인천서구-1321호 · 인천광역시 서구 가재울로 20</p>
        <p>
          서비스명 PASSmaster · 개인정보보호책임자 이태나 · 무통장 입금 계좌 등은 수강·결제 안내를 따릅니다.
        </p>
      </div>
      <p className="footer-disclaimer-short" role="note">
        본 사이트는 큐넷(Q-Net) 및 한국산업인력공단의 공식 사이트가 아니며, 제공되는 문제는 AI를 활용해 재구성한 학습용 문제입니다.
      </p>
      <div className="footer-bottom">
        <span>© 2026 주식회사 모든코퍼레이션. All rights reserved.</span>
      </div>
    </footer>
  );
}
