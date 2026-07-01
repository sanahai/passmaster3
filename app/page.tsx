import Link from "next/link";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import { AIExplanationSection } from "@/components/HeroAndAIExplanation_1";
import EnrollCTA from "@/components/consent/EnrollCTA";
import { COURSES, PACKAGE_PRICE, MONTHLY_PRICE } from "@/lib/courses";
import { getSession } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getSession();

  const flow = [
    { icon: "🎁", title: "무료체험", desc: "100문제 무제한" },
    { icon: "📖", title: "반복학습 3회차", desc: "읽기→50초→40초" },
    { icon: "🔁", title: "오답복습①", desc: "취약점 집중" },
    { icon: "📝", title: "모의고사 6회", desc: "실전 비율 반영" },
    { icon: "🔁", title: "오답복습②", desc: "최종 점검" },
    { icon: "🏆", title: "합격", desc: "60점 이상" },
  ];

  const reviews = [
    { name: "이○○", course: "미용사 일반", stars: 5, tag: "3회차 반복으로 정답 암기 탈출", text: "선택지가 매번 섞여서 정답 위치를 외우는 습관이 사라졌어요. 3회차 돌고 나니 진짜 외워졌습니다." },
    { name: "박○○", course: "피부 미용사", stars: 5, tag: "오답복습으로 시간 단축", text: "오답복습 기능이 최고예요. 틀린 문제만 모아서 다시 푸니 시간이 확 줄었어요. 한 번에 합격!" },
    { name: "최○○", course: "네일 미용사", stars: 4, tag: "실전 같은 모의고사", text: "모의고사 난이도가 실제 시험이랑 비슷해서 실전 감각 잡는 데 큰 도움이 됐습니다." },
    { name: "정○○", course: "메이크업 미용사", stars: 5, tag: "출퇴근 자투리 시간 합격", text: "직장 다니면서 출퇴근 시간에 폰으로 풀었어요. 짧게 자주 푸는 구조라 부담 없이 합격했습니다." },
    { name: "김○○", course: "미용사 일반", stars: 3, tag: "AI 해설로 책 없이 끝", text: "해설이 자세해서 따로 책을 볼 필요가 없었어요. 틀린 이유를 바로 이해하니 같은 실수를 안 하게 됐습니다." },
    { name: "한○○", course: "피부 미용사", stars: 5, tag: "모의고사 6회로 84점 합격", text: "모의고사 6회를 다 풀고 나니 실제 시험이 오히려 쉽게 느껴졌어요. 84점으로 합격했습니다!" },
    { name: "윤○○", course: "네일 미용사", stars: 5, tag: "단계별 잠금으로 길 안 잃음", text: "단계별로 잠금이 풀려서 뭘 해야 할지 헷갈리지 않았어요. 시키는 대로만 했더니 합격이네요." },
    { name: "장○○", course: "메이크업 미용사", stars: 5, tag: "2회 탈락 후 3주 만에 합격", text: "두 번 떨어졌다가 여기서 3주 공부하고 붙었어요. 반복학습 알고리즘이 진짜 효과 있습니다." },
  ];

  const faqs = [
    {
      q: "결제 후 바로 학습할 수 있나요?",
      a: "무료체험은 회원가입 즉시 100문제를 풀 수 있습니다. 유료 과정은 입금 확인(또는 데모 자동승인) 후 바로 전체 문제와 모의고사가 열립니다.",
    },
    {
      q: "수강 기간은 얼마나 되나요?",
      a: "단일 자격증·패키지 모두 결제일 기준 1개월간 무제한으로 이용할 수 있습니다. 기간 내에는 반복학습과 모의고사를 횟수 제한 없이 풀 수 있습니다.",
    },
    {
      q: "반복학습 3회차는 어떻게 진행되나요?",
      a: "1회차는 정답·해설을 보며 읽고, 2회차는 50초, 3회차는 40초 제한으로 풀이합니다. 선택지가 매번 섞여 정답 위치 암기를 방지하고 실제 이해도를 높입니다.",
    },
    {
      q: "오답복습은 무엇인가요?",
      a: "반복학습과 모의고사에서 틀린 문제만 자동으로 모아 다시 풀게 해주는 기능입니다. 취약한 부분만 집중 공략해 학습 시간을 크게 줄일 수 있습니다.",
    },
    {
      q: "환불은 가능한가요?",
      a: "학습 이력이 없는 경우 결제일로부터 7일 이내 전액 환불이 가능합니다. 자세한 사항은 support@beautymaster.kr로 문의해 주세요.",
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-pale to-beauty-bg">
          {/* 움직이는 배경 장식 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-16 top-10 h-64 w-64 animate-pulse rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-72 w-72 animate-pulse rounded-full bg-primary-accent/20 blur-3xl [animation-delay:1s]" />
            <div className="absolute bottom-0 left-1/3 h-56 w-56 animate-pulse rounded-full bg-rose-300/20 blur-3xl [animation-delay:2s]" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <span className="mb-5 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
                미용사 자격증 필기 합격 플랫폼
              </span>
              <h1 className="mb-5 text-4xl font-extrabold leading-tight text-beauty-neutral sm:text-5xl">
                &quot;또 떨어지면 어떡하지?&quot;
                <br />
                그 불안, <span className="text-primary">AI가 이유부터</span> 알려드립니다
              </h1>
              <p className="mb-9 max-w-2xl text-lg text-beauty-gray lg:mx-0">
                문제집은 답만 알려주지만, 뷰티마스터는{" "}
                <span className="font-bold text-red-600">&quot;왜 틀렸는지&quot;</span>까지 분석합니다.
                미용사 일반·피부·네일·메이크업·이용사, 총 5종류의 국가기능사 자격증, 총 6,648개 이상의 AI가 만들어낸 문제은행
                문제로 필기시험에 합격하세요.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href={session ? "/trial" : "/signup"}
                  className="btn-accent w-full px-8 py-4 text-lg sm:w-auto"
                >
                  무료체험 시작하기
                </Link>
                {session ? (
                  <Link
                    href={session.role === "admin" ? "/admin" : "/dashboard"}
                    className="btn-outline w-full px-8 py-4 text-lg sm:w-auto"
                  >
                    내 학습
                  </Link>
                ) : (
                  <Link href="/login" className="btn-outline w-full px-8 py-4 text-lg sm:w-auto">
                    로그인
                  </Link>
                )}
              </div>
            </div>

            <div className="h-72 w-full sm:h-96 lg:h-[26rem]">
              <HeroCarousel />
            </div>
          </div>
        </section>

        {/* 수치 배너 */}
        <section className="border-y border-primary-pale bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center md:grid-cols-4">
            {[
              { num: "6,648문항", label: "기출·예상 문제" },
              { num: "6회", label: "실전 모의고사" },
              { num: "3단계", label: "반복학습" },
              { num: "합격률 ↑", label: "오답복습 시스템" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-primary">{s.num}</div>
                <div className="mt-1 text-sm text-beauty-gray">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 공감 트리거 */}
        <section className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h2 className="mb-8 text-2xl font-bold text-beauty-neutral sm:text-3xl">
            이런 적 있으신가요?
          </h2>
          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {[
              "문제집 3바퀴 돌렸는데 시험만 보면 새 유형이 나온다",
              "비슷한 보기 두 개 사이에서 헷갈려서 틀린다",
              "틀린 문제 다시 봐도 또 틀린다",
              "이론은 봤는데 막상 문제로 나오면 막힌다",
              "공부할 시간이 부족해 핵심만 빠르게 보고 싶다",
              "무엇부터 어떤 순서로 공부해야 할지 막막하다",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-card bg-white p-5 shadow-card">
                <span className="text-2xl">😩</span>
                <p className="font-medium text-beauty-neutral">{item}</p>
              </div>
            ))}
          </div>
          <a href="#ai-explanation" className="btn-accent inline-flex px-8 py-4 text-lg">
            그 이유, AI가 30초 안에 알려드립니다 →
          </a>
        </section>

        {/* 자격증 목록 */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">국가 자격증 과정</h2>
          <p className="mb-10 text-center text-beauty-gray">원하는 자격증을 선택해 시작하세요.</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((c) => (
              <div
                key={c.slug}
                className={`card group flex flex-col transition-shadow hover:shadow-cardHover ${
                  c.comingSoon ? "opacity-80" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-5xl">{c.icon}</span>
                  {c.comingSoon && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-beauty-gray">
                      준비 중
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-lg font-bold text-beauty-neutral">{c.name}</h3>
                <p className="mb-4 text-sm text-beauty-gray">{c.description}</p>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {c.comingSoon ? "오픈 예정" : `${c.price.toLocaleString()}원`}
                  </span>
                  {!c.comingSoon && <span className="text-xs text-beauty-gray">1개월</span>}
                </div>
                {c.comingSoon ? (
                  <button
                    type="button"
                    disabled
                    className="mt-auto w-full cursor-not-allowed rounded-btn bg-gray-200 px-4 py-2.5 text-sm font-bold text-beauty-gray"
                  >
                    오픈 준비 중
                  </button>
                ) : (
                  <EnrollCTA
                    slug={c.slug}
                    examCategory={c.slug}
                    className="btn-primary mt-auto w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AI 해설 차별점 (히어로와 학습 플로우 사이) */}
        <AIExplanationSection />

        {/* 학습 플로우 */}
        <section className="bg-primary-pale/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">합격까지 학습 플로우</h2>
            <p className="mb-10 text-center text-beauty-gray">단계별 잠금 해제 방식으로 빠짐없이 학습합니다.</p>
            <div className="flex flex-wrap items-stretch justify-center gap-3">
              {flow.map((f, i) => (
                <div key={f.title} className="flex items-center gap-3">
                  <div className="w-32 rounded-card bg-white p-4 text-center shadow-card">
                    <div className="mb-1 text-3xl">{f.icon}</div>
                    <div className="text-sm font-bold text-beauty-neutral">{f.title}</div>
                    <div className="text-xs text-beauty-gray">{f.desc}</div>
                  </div>
                  {i < flow.length - 1 && (
                    <span className="hidden text-2xl text-primary sm:inline">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 가격 안내 */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">가격 안내</h2>
          <p className="mb-10 text-center text-beauty-gray">합리적인 가격으로 합격까지.</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card text-center">
              <h3 className="text-lg font-bold text-beauty-neutral">무료 체험</h3>
              <div className="my-4 text-4xl font-extrabold text-primary">0원</div>
              <p className="mb-6 text-sm text-beauty-gray">100문제 무제한 반복</p>
              <Link href="/signup" className="btn-outline w-full">시작하기</Link>
            </div>
            <div className="card relative border-2 border-primary text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-accent px-3 py-1 text-xs font-bold text-white">
                인기
              </span>
              <h3 className="text-lg font-bold text-beauty-neutral">단일 자격증</h3>
              <div className="my-4 text-4xl font-extrabold text-primary">{MONTHLY_PRICE.toLocaleString()}원</div>
              <p className="mb-6 text-sm text-beauty-gray">1종 전체 문제 · 1개월</p>
              <Link href="/enroll" className="btn-primary w-full">수강신청하기</Link>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-bold text-beauty-neutral">미용사 패키지</h3>
              <div className="my-4 text-4xl font-extrabold text-primary">
                {PACKAGE_PRICE.toLocaleString()}원
              </div>
              <p className="mb-6 text-sm text-beauty-gray">4종 전체 · 1개월</p>
              <Link href="/enroll" className="btn-outline w-full">수강신청하기</Link>
            </div>
          </div>
        </section>

        {/* 문제 제공 배너 */}
        <section className="bg-primary py-10 text-center">
          <p className="text-2xl font-bold text-white sm:text-3xl">
            지금까지 총{" "}
            <span className="font-extrabold text-yellow-300">6,648문제</span>를 제공하고 있습니다.
          </p>
        </section>

        {/* 후기 */}
        <section className="bg-primary-pale/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">
              3주 만에 합격한 사람들의 공통점
            </h2>
            <p className="mb-10 text-center text-beauty-gray">먼저 합격한 수강생들의 생생한 후기입니다.</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reviews.map((r) => (
                <div key={r.name} className="card">
                  <span className="mb-2 inline-block rounded-full bg-primary-pale px-3 py-1 text-xs font-bold text-primary">
                    {r.tag}
                  </span>
                  <div className="mb-3 text-primary-accent">
                    {"★".repeat(r.stars)}
                    <span className="text-gray-300">{"★".repeat(5 - r.stars)}</span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-beauty-neutral">“{r.text}”</p>
                  <div className="text-sm font-semibold text-beauty-gray">
                    {r.name} · {r.course}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16">
          <h2 className="mb-2 text-center text-3xl font-bold text-beauty-neutral">자주 묻는 질문</h2>
          <p className="mb-10 text-center text-beauty-gray">궁금한 점을 빠르게 확인하세요.</p>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-beauty-neutral">
                  <span>
                    <span className="mr-2 text-primary">Q.</span>
                    {f.q}
                  </span>
                  <span className="text-primary transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-beauty-gray">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-primary">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">지금 무료로 시작하세요</h2>
            <p className="mb-8 text-primary-pale">회원가입 후 100문제를 바로 풀어볼 수 있습니다.</p>
            <Link href="/signup" className="inline-flex rounded-btn bg-white px-8 py-4 text-lg font-bold text-primary transition hover:bg-primary-pale">
              무료체험 시작하기
            </Link>
          </div>
        </section>

        {/* 문제·학습 자료 관련 안내 */}
        <section className="bg-beauty-bg">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="mb-6 text-2xl font-bold text-beauty-neutral">
              문제·학습 자료 관련 안내
            </h2>
            <div className="space-y-4 rounded-card border border-primary/15 bg-primary-pale/40 p-6 text-sm leading-relaxed text-beauty-gray">
              <p>
                본 사이트는 큐넷(Q-Net), 한국산업인력공단 또는 국가자격시험 시행기관과 제휴·운영
                관계가 없는 민간 학습 서비스이며, 국가자격증 필기시험 준비를 위한 학습용 문제은행입니다.
                제공되는 문제는 해당 기관이 공식적으로 배포하는 정식 기출문제 원문이 아닙니다.
              </p>
              <p>
                문제는 공개된 출제 경향·과목 구성·문제 유형과 시험 범위를 참고하여 AI를 활용해
                재구성한 학습용 예상·복습 문항입니다. 지문·선택지·해설은 학습 편의를 위해 본 사이트
                형식에 맞게 편집될 수 있으며 실제 시험문과 동일하지 않을 수 있습니다.
              </p>
              <p>
                실제 시험에 동일 문항이 출제된다는 보장은 없으며, 출제 범위·방식·법령·기준 개정
                등과 차이가 날 수 있습니다. 학습 자료는 보조 목적이며 합격을 보장하지 않습니다.
              </p>
              <p>
                시험 접수, 출제기준, 일정, 합격 기준 등 공식 정보는 반드시 큐넷(Q-Net) 또는 해당
                자격시험 시행기관의 공지를 확인해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
