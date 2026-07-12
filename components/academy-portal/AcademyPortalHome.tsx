import Link from "next/link";
import { COURSES } from "@/lib/courses";
import { academySignupUrl, type AcademyPortal } from "@/lib/academy-portal";
import { tierAtLeast } from "@/lib/academy";

type Props = {
  academy: AcademyPortal;
  subdomain: string;
};

export default function AcademyPortalHome({ academy, subdomain }: Props) {
  const brand = academy.primaryColor || "#0F172A";
  const signupHref = academySignupUrl(academy.code);
  const studentPortalHref = `/a/${subdomain}/dashboard`;
  const adminPortalHref = `/a/${subdomain}/admin`;
  const hasPremium = tierAtLeast(academy.tier, "premium");

  const flow = [
    { icon: "🎁", title: "무료체험", desc: "100문제 체험" },
    { icon: "📖", title: "반복학습 3회", desc: "읽기→50초→40초" },
    { icon: "🔁", title: "오답복습", desc: "취약점 집중" },
    { icon: "📝", title: "모의고사 6회", desc: "실전 대비" },
    { icon: "📊", title: "학습 분석", desc: "학원 연동" },
    { icon: "🏆", title: "합격", desc: "60점 이상" },
  ];

  const faqs = [
    {
      q: "학원 코드는 어디서 입력하나요?",
      a: `회원가입 시 코드를 입력하거나, 가입 후 마이페이지에서 ${academy.code ?? "학원"} 코드를 등록하면 ${academy.name} 학습 현황이 연동됩니다.`,
    },
    {
      q: "수강 기간은 얼마나 되나요?",
      a: "결제일 기준 1개월간 무제한 이용 가능합니다. 반복학습·모의고사를 횟수 제한 없이 풀 수 있습니다.",
    },
    {
      q: "학원에서 학습 현황을 볼 수 있나요?",
      a: "학원 코드 등록 후 원장·강사님이 PASSmaster B2B 대시보드에서 정답률, 접속 현황, 모의고사 이력을 확인할 수 있습니다.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 py-20 text-white"
        style={{ background: `linear-gradient(135deg, ${brand} 0%, ${brand}dd 50%, #E91E8C99 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-300 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            {academy.name} × PASSmaster 제휴학원
          </span>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            미용사 국가기능사 필기,
            <br />
            {academy.name}과 함께 합격하세요
          </h1>
          <p className="mb-8 text-lg text-white/90">
            AI 문제은행 6,648문항 · 3단계 반복학습 · 6회 모의고사
            <br className="hidden sm:inline" />
            학원 전용 학습 관리 시스템 연동
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={signupHref} className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-lg hover:bg-white/95">
              무료체험 · 회원가입
            </Link>
            <Link href={studentPortalHref} className="rounded-xl border-2 border-white/80 px-8 py-4 text-lg font-semibold hover:bg-white/10">
              수강생 포털
            </Link>
            <Link href={adminPortalHref} className="rounded-xl border-2 border-white/60 px-6 py-4 text-sm font-semibold hover:bg-white/10">
              관리자 포털
            </Link>
            <Link href="/trial" className="rounded-xl border-2 border-white/80 px-8 py-4 text-lg font-semibold hover:bg-white/10">
              100문제 체험
            </Link>
          </div>
          {academy.code && (
            <p className="mt-8 text-sm text-white/80">
              학원 코드 <strong className="font-mono text-xl text-white">{academy.code}</strong>
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-b2b-border bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center md:grid-cols-4">
          {[
            { num: "6,648+", label: "AI 문제은행" },
            { num: "5종", label: "국가기능사" },
            { num: "6회", label: "모의고사" },
            { num: "3단계", label: "반복학습" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-b2b-accent">{s.num}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Academy benefits */}
      <section className="bg-b2b-light py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-b2b-primary">
            {academy.name} 수강생 전용 혜택
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🏫",
                title: "학원 학습 연동",
                desc: "학원 코드 등록 시 원장·강사님이 내 학습 현황을 실시간으로 확인합니다.",
              },
              {
                icon: "📈",
                title: "맞춤 학습 관리",
                desc: "정답률·접속·모의고사 이력을 학원에서 관리해 합격까지 함께합니다.",
              },
              ...(hasPremium
                ? [
                    {
                      icon: "📝",
                      title: "학원 자체 문제",
                      desc: "학원에서 제공하는 추가 문제를 학습 화면에서 풀 수 있습니다.",
                    },
                  ]
                : []),
            ].map((b) => (
              <div key={b.title} className="b2b-card text-center">
                <div className="mb-3 text-4xl">{b.icon}</div>
                <h3 className="mb-2 font-bold text-b2b-primary">{b.title}</h3>
                <p className="text-sm text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning flow */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-b2b-primary">합격 학습 로드맵</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {flow.map((step, i) => (
              <div key={step.title} className="b2b-card relative text-center">
                <span className="absolute -top-2 left-3 rounded-full bg-b2b-accent px-2 py-0.5 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="mb-2 text-3xl">{step.icon}</div>
                <p className="font-bold text-b2b-primary">{step.title}</p>
                <p className="mt-1 text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="bg-b2b-section py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-b2b-primary">자격증 과정</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.filter((c) => !c.comingSoon).map((c) => (
              <div key={c.slug} className="b2b-card">
                <div className="mb-2 text-3xl">{c.icon}</div>
                <h3 className="font-bold text-b2b-primary">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{c.description}</p>
                <p className="mt-3 text-lg font-bold text-b2b-accent">
                  {c.price.toLocaleString()}원
                  <span className="ml-1 text-sm font-normal text-slate-500">/ 1개월</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to start */}
      <section id="guide" className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-b2b-primary">시작 방법</h2>
          <ol className="space-y-6">
            {[
              { step: "1", title: "회원가입", desc: "아래 버튼으로 PASSmaster 계정을 만듭니다." },
              {
                step: "2",
                title: "학원 코드 등록",
                desc: academy.code
                  ? `가입 시 또는 마이페이지에서 코드 ${academy.code}를 입력합니다.`
                  : "마이페이지에서 학원 코드를 입력합니다.",
              },
              { step: "3", title: "학습 시작", desc: "무료체험 100문제 또는 수강 신청 후 반복학습을 시작하세요." },
            ].map((item) => (
              <li key={item.step} className="flex gap-4 b2b-card">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: brand }}
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-b2b-primary">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-b2b-light py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-b2b-primary">자주 묻는 질문</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="b2b-card group">
                <summary className="cursor-pointer font-semibold text-b2b-primary">{f.q}</summary>
                <p className="mt-3 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ backgroundColor: brand }}>
        <div className="mx-auto max-w-2xl text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">지금 시작하세요</h2>
          <p className="mb-8 text-white/90">{academy.name}과 PASSmaster가 함께 합격을 응원합니다.</p>
          <Link href={signupHref} className="inline-block rounded-xl bg-white px-10 py-4 text-lg font-bold text-slate-900">
            회원가입 · 학원 코드 {academy.code ?? "등록"}
          </Link>
        </div>
      </section>
    </>
  );
}
