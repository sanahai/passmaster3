import Logo from "@/components/Logo";
import ServiceLinks from "@/components/ServiceLinks";

function WaveBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-orange-200/40 blur-3xl" />
      <svg className="absolute bottom-0 left-0 w-full text-brand-light" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path
          fill="currentColor"
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-light/30 to-white px-4 pb-20 pt-12 md:pb-28 md:pt-16">
      <WaveBg />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Logo className="mb-10 h-44 w-auto sm:h-52 md:h-60" />
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm font-semibold text-brand shadow-sm md:text-base">
            <span className="inline-block h-2 w-2 rounded-full bg-brand" />
            AI 국가자격증 문제은행 허브
          </p>
          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            국가자격증 합격,
            <br />
            <span className="text-brand">AI 문제은행</span>으로 끝낸다
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
            PASSWAVE는 BEAUTYmaster, COOKmaster, PASSmaster 세 가지 AI 문제은행을 하나로 연결하는
            국가자격증 학습 허브입니다.
          </p>

          <div className="mt-14 w-full">
            <ServiceLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
