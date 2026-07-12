"use client";
import "./landing.css";
import Link from "next/link";
import { useEffect, useRef } from "react";
import LandingFooter from "@/components/landing/LandingFooter";

const CERTS = [
  { slug: "forklift", title: "지게차운전기능사", img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80" },
  { slug: "cookkr", title: "한식조리기능사", img: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80" },
  { slug: "cookwest", title: "양식조리기능사", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80" },
  { slug: "cookjp", title: "일식조리기능사", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80" },
  { slug: "cookcn", title: "중식조리기능사", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80" },
  { slug: "confection", title: "제과기능사", img: "https://images.unsplash.com/photo-1558961363-fa893d6d5b4e?auto=format&fit=crop&w=800&q=80" },
  { slug: "bakery", title: "제빵기능사", img: "https://images.unsplash.com/photo-1509440159598-924e33e385ea?auto=format&fit=crop&w=800&q=80" },
  { slug: "electric", title: "전기기능사", img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80" },
  { slug: "beautician", title: "미용사(일반)", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80" },
  { slug: "skin", title: "피부미용사", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" },
  { slug: "nail", title: "네일미용사", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80" },
  { slug: "makeup", title: "메이크업미용사", img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80" },
  { slug: "barber", title: "이용사", img: "https://images.unsplash.com/photo-1585747860715-d9af4b84bdf0?auto=format&fit=crop&w=800&q=80" },
];

const ROADMAP = [
  { num: 1, title: "학습 시작", desc: "자격증 정보에서 합격 확인 후 최단합격 플랜 또는 수강신청으로 시작" },
  { num: 2, title: "최단합격플랜(무료학습)", desc: "약 100문제·오답 놀이 형태로 서비스 UX 확인" },
  { num: 3, title: "40일 집중학습", desc: "이론 핵심·오답, 반복복습순환식으로 시작 약 5주간 진행" },
  { num: 4, title: "전체 모의 시험", desc: "30일간 오답, 모의 핵심·오답; 복습·복습날짜 약 5주간" },
  { num: 5, title: "1회 핵심 복습", desc: "3·4주간 시작·복습·복습날짜 집중 복습(합격을 위해 필수)" },
  { num: 6, title: "모의시험 1회", desc: "60문제·문제당 30초 내외·오답 랜덤으로 핵심" },
  { num: 7, title: "모의시험 2회", desc: "매일 풀이 집중 전체 진행" },
  { num: 8, title: "모의시험 3회", desc: "60점 기준 자격·합격생들의 평균 합격 시행" },
  { num: 9, title: "모의시험 4회", desc: "실제 복습·복습날짜로 계획 입력" },
  { num: 10, title: "모의시험 5회", desc: "전체 시험지 정리" },
  { num: 11, title: "모의시험 6회", desc: "6회 완료 후 오답·합격생들도 합격 최종 정리" },
  { num: 12, title: "최종 복습·합격", desc: "합격 복습 기출에서 합격 후 집중학습·문제 시작, 최종 도약" },
];

const REVIEWS = [
  { cert: "지게차운전기능사", title: "합격 후기 최초 합격", body: "후기 올리기가 너무 좋아요. 덕분에 짧은 시간 3달 공부했는데 한번에 합격했어요.", meta: "김OO · 직장인 · 2026.04.11" },
  { cert: "전기기능사", title: "합격 후기 완벽한 성공", body: "오답 복습이 탁월합니다. 어디서도 한번 더 보니 수많은 저도 합격 했어요.", meta: "박뷤O · 주부 · 2026.03.28" },
  { cert: "일식조리기능사", title: "합격 후기 1년만에 성공", body: "일식·양식 공부가 어려운데 덕분에 정말 합격 후기 공부가 시작됐어요, 문제의 합격이 마지막 합격까지 않습니다.", meta: "최O · 요리사 · 2026.02.19" },
  { cert: "중식조리기능사", title: "합격 후기 완벽", body: "짧은 시간에서 다양한 어려운 경우 해서 덕분에 합격 횟수가 정확하게 이용했어요.", meta: "이쏰O · 직장인 · 2026.02.02" },
  { cert: "제과기능사", title: "합격 완벽 도전", body: "합격 최단기 합격이 아마도 덕분에 실제 시험에서도 문제 복습이 예상돼요.", meta: "오뷤O · 주부 · 2026.01.26" },
  { cert: "메이크업미용사", title: "합격 후기 실수 성공", body: "모의 시험이 없었다면 후기만 진행하는 정말 시간이 걸렸고, 짧은 재도 있습니다.", meta: "짵O · 미용사 수강생 · 2026.01.18" },
];

const FAQS = [
  { q: "수강 신청은 언제부터 가능한가요?", a: "상시 신청 가능합니다. 원하는 최단합격 플랜으로 문제 및 학습 현황을 확인한 뒤 바로 수강 신청하시면 됩니다." },
  { q: "수강신청만 하면 바로 학습을 시작하나요?", a: "다릅니다. 안내는 수강생 낙찰 확인 전까지 이루어지며, 낙찰 확인 후 이용자 낙찰이 완료되어야 즉시 합격 학습(주차별 문제 풀기)을 시작하게 됩니다. 진행 현황은 마이페이지에서 확인합니다." },
  { q: "12주간 학습 로드맵은 어떻게 따라가나요?", a: "로그인 완료 후 즉시 합격생에서 시작 주차를 안내합니다. 무료학습과 집중(오답)·전체 모의 및 복습, 그리고 이후 단계에서 모의시험 최종 복습·합격 도약으로 따라가게 됩니다. 합격생으로 이동하면 문제·기출 로드맵 학습·문제 결과 따라갑니다. 자세한 시험지는 학습로드맵을 참고하세요." },
  { q: "기존 온라인 문제집보다 시험 시간이 달라지나요?", a: "답변은 점수로만 학습하는 학습은 필요합니다. 문제 기준 그대로 먹고 선택지 번호가 섞이며, 핵심 선택지 옵션 학습으로 이루어집니다. 기존 답 및 실제 답변은 공부하지 않도록 하는 것이 실제 도움이 됩니다." },
  { q: "결제/낙찰 확인은 어디에서 하나요?", a: "당일 기준 1~2시간 이내 처리를 목표로 하며, 주말·공휴일·연휴는 6시간 이내의 시작 확인·처리합니다. (공식·연휴 일정에 따라 약소 차이가 있을 수 있습니다.)" },
  { q: "수강 현황은 어디에서 확인하나요?", a: "로그인 후 마이페이지에서 신청 현황, 낙찰 여부, 진행을 한 눈에 확인하실 수 있습니다." },
  { q: "환불/로그인 문의는 어떻게 하나요?", a: "고객센터 문의 또는 로그인 후 1:1 문의하기 버튼을 사용해주세요. 빠른 문의 및 1:1로 도와드리겠습니다." },
  { q: "모바일에서도 학습이 가능한가요?", a: "네, 모바일과 PC 모두 지원합니다. 매일 정해진 시간 진행 학습 로드맵도 자동 진행됩니다." },
];

export default function Home() {
  const fadeRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).style.animationPlayState = "running"; }),
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach((el) => { if (el) { el.style.animationPlayState = "paused"; observer.observe(el); } });
    return () => observer.disconnect();
  }, []);

  const addFade = (el: HTMLElement | null) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <>
      <div className="floating left" />
      <div className="floating right" />
      <div className="container">
        <main className="landing">
          {/* 헤더 */}
          <header className="header">
            <Link className="logo-wrap" href="/">
              <span className="logo-icon">P</span>
              <span className="logo">PASSmaster</span>
            </Link>
            <nav className="nav">
              <Link href="/enroll">수강신청</Link>
              <a href="#cert-courses">자격증</a>
              <a href="#cert-courses">최단합격 플랜</a>
              <a href="#learning-roadmap">학습로드맵</a>
              <Link href="/login">학습 시작</Link>
              <a href="#reviews">수강후기</a>
              <Link href="/support">고객센터</Link>
            </nav>
            <div className="auth">
              <Link className="btn btn-ghost" href="/login">로그인</Link>
              <Link className="btn btn-primary" href="/signup">회원가입</Link>
            </div>
          </header>

          {/* 히어로 */}
          <section className="hero fade" ref={addFade}>
            <article className="hero-main">
              <span className="hero-badge">자격 취득의 새로운 패러다임</span>
              <h1>자격증 합격,<br />PASSmaster로 더 빠르게 앞서갑니다.</h1>
              <p>
                모든 자격증 합격에 필요한 <strong>합격 플랜에서 최단합격 플랜 및 수강신청 후 오답·낙찰·학습의 12주간
                학습 전략</strong>으로 따라가면 됩니다. 문제 기출 합격하고 <strong>선택지 번호만 바꾼 방식</strong> 학습
                로드맵이 기다리는 학습을 이미 이루고 있습니다.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="/enroll">지금 수강 신청</Link>
                <a className="btn btn-ghost" href="#cert-courses">합격생별 최단합격 플랜</a>
              </div>
            </article>
            <aside className="hero-panel">
              <img className="hero-image" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" alt="학습 이미지" />
              <h2>수강 신청 6단계</h2>
              <ol className="step-list">
                <li>1. 회원가입 후 기본정보 등록</li>
                <li>2. 로그인 후 학습 현황에 접속</li>
                <li>3. 원하는 자격증 합격 플랜 선택</li>
                <li>4. 신청에 입력 및 낙찰 플랜 확인</li>
                <li>5. 낙찰 및 낙찰확인 이메일</li>
                <li>6. 이용자 낙찰 후 학습·학습로드맵 이용</li>
              </ol>
              <p className="hero-note">
                <strong>수강신청만으로는 학습을 시작하지 않습니다.</strong> 낙찰확인 이메일 후 이용자 낙찰이
                완료되어야 즉시 합격 학습을 시작하게 됩니다.
              </p>
            </aside>
          </section>

          {/* 비전 */}
          <section className="section fade" id="vision" ref={addFade}>
            <div className="section-head"><h2>PASSmaster의 목적과 미래 전망</h2></div>
            <div className="purpose-showcase">
              <h3>목적</h3>
              <p className="purpose-lead">
                복잡한 문제를 보다 쉽게 보는 방식으로 따라가고, <strong>핵심 시작·복습·집중학습·계획 합격</strong>으로
                합격하는 학습전략을 안내합니다. 실제 시험에 가장 문제를 따라 시작·주차·집중·계획 방식으로 이루어지는
                전체 역량이에 따라 진행됩니다.
              </p>
              <ul className="purpose-pillars">
                {["실제 시험과 관련된 문제의 적합성", "집중 학습에 따른 적합한 계획 효율화", "복습 이상 보완", "주차별 학습 이루어짐", "집중학습을 따른 전체 역량 결합", "계획 시험 및 합격점 구분"].map((txt, i) => (
                  <li key={i}><span className="purpose-idx">{i + 1}</span><span>{txt}</span></li>
                ))}
              </ul>
            </div>
            <div className="vision-grid">
              <article className="vision-card">
                <div className="vision-media"><img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80" alt="미래 학습" /></div>
                <h3>미래</h3>
                <p>신청한 학습, 복습, 합격으로 이루어지는 최선의 합격에서 학습 학습로드맵을 따르고 합격 경험을 이루게 됩니다.</p>
              </article>
              <article className="vision-card">
                <div className="vision-media"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="미래 전망" /></div>
                <h3>전망</h3>
                <p>이제 시대와 모든 자격증 합격 학습 방법으로 이루어진 이러한 기술의 새로운 방식으로 자격증을 이루게 될 수 있는 학습 적합성이 남습니다.</p>
              </article>
            </div>
          </section>

          {/* 자격증 과정 */}
          <section className="section fade" id="cert-courses" ref={addFade}>
            <div className="section-head"><h2>국가자격증 수강신청</h2></div>
            <p className="landing-cert-q-hint">현재 문제는 원하는 학습 시간별로 제공됩니다. 관련된 원하는 자격에 대한 <a href="#question-source-notice">문제·학습 관련 이용 안내</a>를 참고해주세요.</p>
            <div className="course-grid">
              {CERTS.map((c) => (
                <article className="course-card" key={c.slug}>
                  <div className="course-thumb"><img src={c.img} alt={c.title} /></div>
                  <h3>{c.title}</h3>
                  <div className="course-actions">
                    <Link className="course-btn primary" href={`/trial/${c.slug}`}>무료체험</Link>
                    <Link className="course-btn ghost" href={`/enroll?cert=${c.slug}`}>수강신청</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 학습 로드맵 */}
          <section className="section fade" id="learning-roadmap" ref={addFade}>
            <div className="section-head"><h2>합격 학습 12주간 로드맵</h2></div>
            <p className="section-lead">안내는 학습 기준 시작 방향입니다. 각각 주차를 완료하면 다음 주차로 이어서 합격생들로 따라가면 문제·기출 학습·시험 패턴 결과들은 자동으로 진행됩니다.</p>
            <div className="twelve-grid">
              {ROADMAP.map((r) => (
                <article className="twelve-chip" key={r.num}>
                  <span className="twelve-num">{r.num}</span>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* 수강 후기 */}
          <section className="section fade" id="reviews" ref={addFade}>
            <div className="section-head"><h2>수강 후기</h2></div>
            <div className="review-grid">
              {REVIEWS.map((r, i) => (
                <article className="review-card" key={i}>
                  <strong>{r.cert} {r.title}</strong>
                  <p>{r.body}</p>
                  <p className="review-meta">{r.meta}</p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="section fade" id="faq" ref={addFade}>
            <div className="section-head"><h2>자주 묻는 질문</h2></div>
            <div className="faq">
              {FAQS.map((f, i) => (
                <article className="faq-item" key={i} onClick={(e) => {
                  const item = e.currentTarget;
                  const wasActive = item.classList.contains("active");
                  document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("active"));
                  if (!wasActive) item.classList.add("active");
                }}>
                  <button className="faq-trigger" type="button">
                    {f.q}<span className="faq-icon">+</span>
                  </button>
                  <div className="faq-content">{f.a}</div>
                </article>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <section className="footer-cta fade" ref={addFade}>
            <strong>합격으로 가장 빠르게 준비를 시작하고 있습니다. 지금 등록하시고 바로 학습을 시작하세요!</strong>
            <Link className="btn btn-primary" href="/enroll">수강 신청 바로가기</Link>
          </section>

          {/* 법적 고지 */}
          <section className="section fade" id="question-source-notice" ref={addFade}>
            <div className="section-head"><h2>문제·학습 관련 이용 안내</h2></div>
            <div className="legal-notice-shell">
              <p>본 웹사이트는 큐넷(Q-Net), 한국산업인력공단 또는 모든 자격시험 시행기관 및 공식·실제 이용에 관련된 어떠한 학습 웹사이트도 모든 자격증 합격에 관한 학습은 문제로 이루어집니다. 제공되는 문제는 해당 학습에 원하는 합격으로 제공하는 학습 문제 시간별로 제공됩니다.</p>
              <p>문제의 원하는 최단기 합격이·합격 기준·합격 방식·합격 시험에 AI를 이용해서 이루어진 학습의 공식·복습 문제입니다. 기출·오답 학습 방식을 위해 본 웹사이트는 원하는 학습이 아닌 실제 시험과 관련해 이루어지는 학습 방식과 이루어지지 않을 수 있습니다.</p>
              <p>실제 시험과 실제 문제에 최단기를 이루게 되면 이루어진 합격기간·형태·방식·학습 기준 결과 차이가 있을 수 있습니다. 학습 관련은 합격 목적이지 자격의 이루어지지 않습니다.</p>
              <p>시험 횟수, 최단기간, 방식, 합격 학습 및 원하는 정보는 큐넷(Q-Net) 또는 해당 자격시험 시행기관에 원하는 정보를 확인하시기 바랍니다.</p>
            </div>
          </section>

          {/* 푸터 */}
          <LandingFooter />
        </main>
      </div>
    </>
  );
}
