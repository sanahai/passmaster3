export default function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-2 text-center text-xs leading-relaxed text-slate-500 md:text-sm">
        <p>
          <span className="font-semibold text-slate-700">패스웨이브 (PASSwave)</span>
          {" · "}대표: 이동길 · 사업자등록번호: 326-58-00636
        </p>
        <p>주소: 인천광역시 미추홀구 석정로140번길 29</p>
        <p>
          고객문의:{" "}
          <a href="mailto:support@passwave.kr" className="hover:text-brand hover:underline">
            support@passwave.kr
          </a>
          {" · "}운영시간: 평일 10:00 ~ 16:00 (주말·공휴일 휴무)
          {" · "}이용약관 (준비 중) · 개인정보처리방침 (준비 중)
        </p>
        <p className="pt-1 text-slate-400">© 2026 PASSwave. All rights reserved.</p>
      </div>
    </footer>
  );
}
