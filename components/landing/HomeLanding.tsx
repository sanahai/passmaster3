"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import LandingFooter from "@/components/landing/LandingFooter";

const CERTS = [
  { slug: "forklift", title: "지게차운전기능사", img: "/certs/forklift.png" },
  { slug: "cookkr", title: "한식조리기능사", img: "/certs/cookkr.png" },
  { slug: "cookwest", title: "양식조리기능사", img: "/certs/cookwest.png" },
  { slug: "cookjp", title: "일식조리기능사", img: "/certs/cookjp.png" },
  { slug: "cookcn", title: "중식조리기능사", img: "/certs/cookcn.png" },
  { slug: "confection", title: "제과기능사", img: "/certs/confection.png" },
  { slug: "bakery", title: "제빵기능사", img: "/certs/bakery.png" },
  { slug: "electric", title: "전기기능사", img: "/certs/electric.png" },
  { slug: "beautician", title: "미용사(일반)", img: "/certs/beautician.png" },
  { slug: "skin", title: "피부미용사", img: "/certs/skin.png" },
  { slug: "nail", title: "네일미용사", img: "/certs/nail.png" },
  { slug: "makeup", title: "메이크업미용사", img: "/certs/makeup.png" },
  { slug: "barber", title: "이용사", img: "/certs/barber.png" },
];

const PURPOSE_PILLARS = [
  "실제 자격증 시험과 동일한 방식의 CBT방식으로 운영",
  "기출문제들을 분석하여 AI가 실제 자격증 필기시험과 동일한 방식으로 문제 출제",
  "3번에 걸친 반복 학습을 통해 합격의 로드맵 제공",
  "AI가 학습과 오답을 분석해서 빠른 합격 로드맵 제공",
  "6차례의 실제 시험과 동일한 방식의 모의고사 제공",
  "학습과 오답분석, 모의고사를 통해 AI가 틀린 부분들을 집중 분석해서 빠른 합격 로드맵 제공",
];

const ROADMAP = [
  { num: 1, title: "회원가입/로그인", desc: "학습을 진행하시기 위해서는 회원가입 및 로그인을 하셔야 합니다." },
  { num: 2, title: "무료체험학습", desc: "각 자격증별로 100문제의 무료 체험 학습을 하실 수 있습니다." },
  { num: 3, title: "1차 집중학습", desc: "AI가 만든 문제들을 눈에 익히는 학습 단계입니다." },
  { num: 4, title: "2차 집중학습", desc: "1차 집중학습을 통해서 익힌 문제들을 직접 풀어보는 단계입니다." },
  { num: 5, title: "3차 집중학습", desc: "1차와 2차를 통해서 학습한 내용들을 직접 풀어보고 정답을 확인하는 단계입니다." },
  { num: 6, title: "1차 오답분석", desc: "2차와 3차의 집중학습을 통해 틀린 문제들을 AI가 분석하고 문제들을 재구성해서 재학습을 실시합니다." },
  { num: 7, title: "1차 모의고사", desc: "실제 시험과 동일한 형식과 방식으로 쉬운 난이도의 60문제를 50분 안에 풀어보고 성적을 체크합니다." },
  { num: 8, title: "2차 모의고사", desc: "실제 시험과 동일한 형식과 방식으로 중간 난이도의 60문제를 50분 안에 풀어보고 성적을 체크합니다." },
  { num: 9, title: "3차 모의고사", desc: "실제 시험과 동일한 형식과 방식으로 어려운 난이도의 60문제를 50분 안에 풀어보고 성적을 체크합니다." },
  { num: 10, title: "4차 모의고사", desc: "실제 시험과 동일한 형식과 방식으로 난이도를 섞어서 60문제를 50분 안에 풀어보고 성적을 체크합니다." },
  { num: 11, title: "5차 모의고사", desc: "실제 시험과 동일한 형식과 방식으로 난이도를 섞어서 60문제를 40분 안에 풀어보고 성적을 체크합니다." },
  { num: 12, title: "6차 모의고사", desc: "실제 시험과 동일한 형식과 방식으로 난이도를 섞어서 60문제를 30분 안에 풀어보고 성적을 체크합니다." },
  { num: 13, title: "2차 오답분석", desc: "1차~6차에 걸친 모의고사를 통해서 틀린 문제들을 AI가 분석하여 리포트를 해줍니다. 이를 통해서 수강생의 부족한 부분들을 좀 더 학습할 수 있습니다." },
];

const REVIEWS = [
  { cert: "지게차운전기능사", title: "합격 후기 최초 합격", body: "후기 올리기가 너무 좋아요. 덕분에 짧은 시간 3달 공부했는데 한번에 합격했어요.", meta: "김OO · 직장인 · 2026.04.11" },
  { cert: "전기기능사", title: "합격 후기 완벽한 성공", body: "오답 복습이 탁월합니다. 어디서도 한번 더 보니 수많은 저도 합격 했어요.", meta: "박뷤O · 주부 · 2026.03.28" },
  { cert: "한식조리기능사", title: "합격 후기 단기 합격", body: "한식 조리 이론이 방대했는데 AI 오답 분석 덕분에 핵심만 집중해서 2달 만에 합격했습니다.", meta: "정OO · 요리학원 수강생 · 2026.03.15" },
  { cert: "일식조리기능사", title: "합격 후기 1년만에 성공", body: "일식·양식 공부가 어려운데 덕분에 정말 합격 후기 공부가 시작됐어요, 문제의 합격이 마지막 합격까지 않습니다.", meta: "최O · 요리사 · 2026.02.19" },
  { cert: "중식조리기능사", title: "합격 후기 완벽", body: "짧은 시간에서 다양한 어려운 경우 해서 덕분에 합격 횟수가 정확하게 이용했어요.", meta: "이쏰O · 직장인 · 2026.02.02" },
  { cert: "제과기능사", title: "합격 완벽 도전", body: "합격 최단기 합격이 아마도 덕분에 실제 시험에서도 문제 복습이 예상돼요.", meta: "오뷤O · 주부 · 2026.01.26" },
  { cert: "미용사(일반)", title: "합격 후기 헤어 집중", body: "미용사 일반 필기를 헤어 위주로 공부했는데 모의고사 6회가 실전과 비슷해서 시험장에서 당황하지 않았어요.", meta: "한OO · 미용실 직원 · 2026.01.22" },
  { cert: "메이크업미용사", title: "합격 후기 실수 성공", body: "모의 시험이 없었다면 후기만 진행하는 정말 시간이 걸렸고, 짧은 재도 있습니다.", meta: "짵O · 미용사 수강생 · 2026.01.18" },
];

const FAQS = [
  { q: "수강 신청은 언제부터 가능한가요?", a: "상시 신청 가능합니다. 원하는 자격증의 무료체험을 먼저 진행해 보신 뒤 수강 신청하시면 됩니다." },
  { q: "수강신청만 하면 바로 학습을 시작하나요?", a: "아닙니다. 수강신청을 하시고, 수강비를 입금하시면 관리자가 확인 후 승인을 하면 바로 학습을 하실 수 있습니다." },
  { q: "13단계 학습 로드맵은 어떻게 따라가나요?", a: "관리자의 승인 이후에는 제공하는 로드맵에 따라서 집중학습, 복습, 오답학습, 모의고사의 순서로 진행이 됩니다. 학습 로드맵에 따라 가시면 합격 하실 수 있습니다." },
  { q: "기존의 자격증 문제집들과의 차이점은 무엇인가요?", a: "PASSmaster의 문제들은 모두 AI가 직접 기출문제들과 학습 내용을 분석해서 문제들을 만들었기 때문에 기존의 자격증 문제집들보다 최신의 정보와 문제들을 제공하고 있습니다." },
  { q: "수강신청 및 결제는 언제 처리가 되나요?", a: "당일 기준 1~2시간 이내 처리를 목표로 하며, 주말·공휴일·연휴는 6시간 이내의 확인·처리를 진행합니다. (공식·연휴 일정에 따라 약소 차이가 있을 수 있습니다.)" },
  { q: "수강 현황은 어디에서 확인하나요?", a: "로그인 후 마이페이지에서 신청 현황, 승인 여부, 학습 진행을 한눈에 확인하실 수 있습니다." },
  { q: "별도의 수업내용이나 문제집을 제공하나요?", a: "저희 PASSmaster는 온라인 시험 문제은행 기반이기 때문에 별도의 학습 요약이나 문제집은 제공하고 있지 않습니다." },
  { q: "환불/로그인 문의는 어떻게 하나요?", a: "고객센터 문의 또는 로그인 후 1:1 문의하기 버튼을 사용해 주세요. 빠른 문의 및 1:1로 도와드리겠습니다." },
  { q: "모바일에서도 학습이 가능한가요?", a: "네, 모바일과 PC 모두 지원합니다. 학습 로드맵에 따라 단계별로 진행하실 수 있습니다." },
];

const ROADMAP_VISUALS = [
  { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80", alt: "AI 기반 합격 학습" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", alt: "CBT 방식 모의고사" },
];

export default function HomeLanding() {
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
      <section className="hero fade" ref={addFade}>
        <article className="hero-main">
          <span className="hero-badge">자격 취득의 새로운 패러다임</span>
          <h1>국가자격증 합격,<br />이제 AI를 기반으로 하는 PASSmaster에서 단기간 당신의 합격을 도와 드립니다.</h1>
          <p>
            모든 자격증 합격에 필요한 <strong>합격 플랜에서 최단합격 플랜 및 수강신청 후 오답·승인·학습의 13단계 학습전략</strong>으로
            따라가면 됩니다. AI가 분석한 <strong>CBT 방식 문제와 오답 분석</strong>으로 합격까지 안내합니다.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/enroll">지금 수강 신청</Link>
            <a className="btn btn-ghost" href="#cert-courses">무료체험 바로가기</a>
          </div>
        </article>
        <aside className="hero-panel">
          <img className="hero-image" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" alt="학습 이미지" />
          <h2>수강 신청 6단계</h2>
          <ol className="step-list">
            <li>1. 회원 가입 및 로그인</li>
            <li>2. 원하는 자격증 무료체험 학습</li>
            <li>3. 자격증 수강신청 및 수강비 입금</li>
            <li>4. 관리자 수강 신청내역 및 입금 확인</li>
            <li>5. 관리자 수강신청 승인</li>
            <li>6. 학습 시작</li>
          </ol>
        </aside>
      </section>

      <section className="section fade" id="roadmap-overview" ref={addFade}>
        <div className="section-head"><h2>PASSmaster가 제공하는 합격 로드맵</h2></div>
        <div className="roadmap-visual-grid">
          {ROADMAP_VISUALS.map((img) => (
            <div className="roadmap-visual" key={img.src}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
        <div className="purpose-showcase">
          <h3>목적</h3>
          <p className="purpose-lead">
            복잡한 문제를 보다 쉽게 보는 방식으로 따라가고, <strong>핵심 시작·복습·집중학습·계획 합격</strong>으로
            합격하는 학습전략을 안내합니다.
          </p>
          <ul className="purpose-pillars">
            {PURPOSE_PILLARS.map((txt, i) => (
              <li key={i}><span className="purpose-idx">{i + 1}</span><span>{txt}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section fade" id="cert-courses" ref={addFade}>
        <div className="section-head"><h2>국가자격증 수강신청</h2></div>
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

      <section className="section fade" id="learning-roadmap" ref={addFade}>
        <div className="section-head"><h2>13단계의 합격 학습 로드맵</h2></div>
        <p className="section-lead">
          안내는 학습 시작 기준 방향입니다. 각각의 학습 단계를 완료하시면 다음 단계로 이어서 학습을 진행하실 수 있습니다.
        </p>
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

      <section className="footer-cta fade" ref={addFade}>
        <strong>합격으로 가장 빠르게 준비를 시작하고 있습니다. 지금 등록하시고 바로 학습을 시작하세요!</strong>
        <Link className="btn btn-primary" href="/enroll">수강 신청 바로가기</Link>
      </section>

      <section className="section fade" id="question-source-notice" ref={addFade}>
        <div className="section-head"><h2>문제·학습 관련 이용 안내</h2></div>
        <div className="legal-notice-shell">
          <p>본 웹사이트는 큐넷(Q-Net), 한국산업인력공단 또는 모든 자격시험 시행기관 및 공식·실제 이용에 관련된 어떠한 학습 웹사이트도 모든 자격증 합격에 관한 학습은 문제로 이루어집니다. 제공되는 문제는 해당 학습에 원하는 합격으로 제공하는 학습 문제 시간별로 제공됩니다.</p>
          <p>문제의 원하는 최단기 합격이·합격 기준·합격 방식·합격 시험에 AI를 이용해서 이루어진 학습의 공식·복습 문제입니다. 기출·오답 학습 방식을 위해 본 웹사이트는 원하는 학습이 아닌 실제 시험과 관련해 이루어지는 학습 방식과 이루어지지 않을 수 있습니다.</p>
          <p>실제 시험과 실제 문제에 최단기를 이루게 되면 이루어진 합격기간·형태·방식·학습 기준 결과 차이가 있을 수 있습니다. 학습 관련은 합격 목적이지 자격의 이루어지지 않습니다.</p>
          <p>시험 횟수, 최단기간, 방식, 합격 학습 및 원하는 정보는 큐넷(Q-Net) 또는 해당 자격시험 시행기관에 원하는 정보를 확인하시기 바랍니다.</p>
        </div>
      </section>

      <LandingFooter />
    </>
  );
}
