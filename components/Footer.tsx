import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-beauty-neutral text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xl font-bold text-white">BEAUTYmaster</p>
            <p className="mt-1 text-sm text-white/60">
              필기 합격의 가장 빠른 루트, 데이터 기반 학습 플랫폼
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
            <Link href="/company#company" className="hover:text-primary-accent">회사정보</Link>
            <Link href="/policy#terms" className="hover:text-primary-accent">이용약관</Link>
            <Link href="/policy#privacy" className="hover:text-primary-accent">개인정보처리방침</Link>
            <Link href="/policy#refund" className="hover:text-primary-accent">환불정책</Link>
            <Link href="/company#support" className="hover:text-primary-accent">고객센터</Link>
          </nav>
        </div>

        <div className="mt-6 space-y-1 text-xs text-white/60">
          <p>
            <span className="font-semibold text-white/80">골든웨이브</span> · 대표 이동길 ·
            사업자등록번호 326-58-00636
          </p>
          <p>통신판매업 신고 제2022-인천서구-1321호 · 인천광역시 서구 가재울로 20</p>
          <p>
            서비스명 BEAUTYmaster · 개인정보보호책임자 이태나 · 무통장 입금 계좌 등은 수강·결제
            안내를 따릅니다.
          </p>
        </div>

        <div className="mt-6 rounded-card bg-white/5 px-4 py-3 text-xs text-white/70">
          본 사이트는 큐넷(Q-Net) 및 한국산업인력공단의 공식 사이트가 아니며, 제공되는 문제는 AI를
          활용해 재구성한 학습용 문제입니다.
        </div>

        <p className="mt-6 text-xs text-white/40">
          © 2026 골든웨이브. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
