export default function UpgradeBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E3A5F] p-8 text-center text-white">
      <p className="mb-2 text-2xl font-bold">상위 플랜 기능입니다</p>
      <p className="mb-6 text-slate-300">반 관리, 강사 계정, 리포트 등 추가 기능을 이용할 수 있습니다.</p>
      <a
        href="mailto:support@beautymaster.kr?subject=플랜 업그레이드 문의"
        className="inline-block rounded-lg bg-b2b-accent px-8 py-3 font-semibold text-white"
      >
        업그레이드 문의하기
      </a>
    </div>
  );
}
