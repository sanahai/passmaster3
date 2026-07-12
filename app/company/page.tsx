import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "회사정보 · 고객센터 · PASSmaster",
  description: "PASSmaster 운영사 회사정보와 고객센터 안내",
};

export default function CompanyPage() {
  return (
    <>
      <Header />
      <main className="bg-beauty-bg">
        {/* 상단 타이틀 */}
        <section className="bg-gradient-to-b from-primary-pale to-beauty-bg">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
              회사정보 · 고객센터
            </span>
            <h1 className="text-3xl font-extrabold text-beauty-neutral sm:text-4xl">
              PASSmaster를 소개합니다
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-beauty-gray">
              데이터 기반 학습과 AI 해설로 미용 국가자격증 필기 합격을 돕는 학습 플랫폼입니다.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <a href="#company" className="btn-outline px-5 py-2 text-sm">
                회사정보
              </a>
              <a href="#support" className="btn-primary px-5 py-2 text-sm">
                고객센터
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
          {/* 회사 소개 */}
          <section id="company" className="scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold text-beauty-neutral">회사 소개</h2>
            <div className="card space-y-4 text-sm leading-relaxed text-beauty-gray">
              <p>
                <strong className="text-beauty-neutral">PASSmaster</strong>는 국가기술자격·자격증 필기시험을
                준비하는 수험생을 위한 온라인 문제은행 서비스입니다. 단순히
                정답만 알려주는 학습이 아니라, AI가 수험생이 ‘왜 그 오답을 골랐는지’까지 진단하여
                같은 실수를 반복하지 않도록 돕습니다.
              </p>
              <p>
                선택지가 매번 섞이는 3배수 반복학습, 취약점만 모아 푸는 오답복습, 실전 비율을 반영한
                6회 모의고사를 통해 짧은 시간에 합격 점수에 도달하도록 설계되었습니다.
              </p>
              <p>
                우리는 “필기 합격의 가장 빠른 루트”라는 목표 아래, 공개된 출제 경향과 학습 자료를
                지속적으로 분석·반영하여 더 정확하고 효율적인 학습 경험을 제공합니다.
              </p>
            </div>
          </section>

          {/* 핵심 가치 / 서비스 특징 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-beauty-neutral">서비스 특징</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "🤖",
                  title: "AI 오개념 진단",
                  desc: "틀린 이유와 헷갈린 개념까지 짚어주는 해설",
                },
                {
                  icon: "🔁",
                  title: "반복·오답 학습",
                  desc: "선택지 셔플 3회독 + 취약 문제 집중 복습",
                },
                {
                  icon: "📝",
                  title: "실전 모의고사",
                  desc: "과목·난이도 비율을 반영한 6회 모의고사",
                },
              ].map((f) => (
                <div key={f.title} className="card">
                  <div className="mb-2 text-3xl">{f.icon}</div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">{f.title}</h3>
                  <p className="text-sm text-beauty-gray">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 사업자 정보 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-beauty-neutral">사업자 정보</h2>
            <div className="card overflow-hidden p-0">
              <dl className="divide-y divide-gray-100 text-sm">
                {[
                  ["상호명", "골든웨이브"],
                  ["서비스명", "PASSmaster"],
                  ["대표", "이동길"],
                  ["사업자등록번호", "326-58-00636"],
                  ["통신판매업 신고", "제2022-인천서구-1321호"],
                  ["주소", "인천광역시 서구 가재울로 20"],
                  ["개인정보보호책임자", "이태나"],
                  ["이메일", "support@passmaster.kr"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:gap-4">
                    <dt className="w-40 shrink-0 font-semibold text-beauty-neutral">{k}</dt>
                    <dd className="text-beauty-gray">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* 고객센터 */}
          <section id="support" className="scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold text-beauty-neutral">고객센터</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="card">
                <h3 className="mb-3 font-bold text-beauty-neutral">📮 문의 방법</h3>
                <ul className="space-y-2 text-sm text-beauty-gray">
                  <li>
                    이메일:{" "}
                    <a href="mailto:support@passmaster.kr" className="font-semibold text-primary">
                      support@passmaster.kr
                    </a>
                  </li>
                  <li>1:1 문의: 로그인 후 마이페이지에서 접수</li>
                  <li>결제·환불 문의: 이메일로 주문자명과 함께 접수</li>
                </ul>
              </div>
              <div className="card">
                <h3 className="mb-3 font-bold text-beauty-neutral">🕒 운영 시간</h3>
                <ul className="space-y-2 text-sm text-beauty-gray">
                  <li>평일 10:00 ~ 18:00 (점심 12:00 ~ 13:00)</li>
                  <li>주말·공휴일 휴무</li>
                  <li>문의는 24시간 접수 가능하며, 영업일 기준 순차 답변드립니다.</li>
                </ul>
              </div>
              <div className="card">
                <h3 className="mb-3 font-bold text-beauty-neutral">💳 결제·입금 안내</h3>
                <ul className="space-y-2 text-sm text-beauty-gray">
                  <li>수강 신청 후 안내되는 계좌로 무통장 입금</li>
                  <li>입금자명과 신청자명이 같아야 빠르게 확인됩니다.</li>
                  <li>입금 확인 후 학습 권한이 활성화됩니다.</li>
                </ul>
              </div>
              <div className="card">
                <h3 className="mb-3 font-bold text-beauty-neutral">❓ 자주 묻는 질문</h3>
                <p className="mb-3 text-sm text-beauty-gray">
                  수강 기간, 환불, 학습 방법 등 자주 묻는 질문은 메인 페이지 하단 FAQ에서 확인할 수
                  있습니다.
                </p>
                <Link href="/#faq" className="text-sm font-semibold text-primary">
                  FAQ 보러가기 →
                </Link>
              </div>
            </div>
          </section>

          {/* 관련 약관 링크 */}
          <section className="card flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-beauty-neutral">약관 및 정책</h3>
              <p className="text-sm text-beauty-gray">
                이용약관·개인정보처리방침·환불정책은 정책 페이지에서 확인하세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/policy#terms" className="btn-outline px-4 py-2 text-sm">
                이용약관
              </Link>
              <Link href="/policy#privacy" className="btn-outline px-4 py-2 text-sm">
                개인정보처리방침
              </Link>
              <Link href="/policy#refund" className="btn-outline px-4 py-2 text-sm">
                환불정책
              </Link>
            </div>
          </section>

          <div className="pt-4 text-center">
            <Link href="/" className="text-sm font-semibold text-primary">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
