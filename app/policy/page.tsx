import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "이용약관 · 개인정보처리방침 · 환불정책 · BEAUTYmaster",
  description: "BEAUTYmaster 이용약관, 개인정보처리방침, 환불정책 안내",
};

const NAV = [
  { id: "terms", label: "이용약관" },
  { id: "privacy", label: "개인정보처리방침" },
  { id: "refund", label: "환불정책" },
];

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-beauty-bg">
        {/* 타이틀 */}
        <section className="bg-gradient-to-b from-primary-pale to-beauty-bg">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center">
            <h1 className="text-3xl font-extrabold text-beauty-neutral sm:text-4xl">약관 및 정책</h1>
            <p className="mx-auto mt-3 max-w-2xl text-beauty-gray">
              아래 메뉴를 선택하면 해당 정책으로 이동합니다.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[220px_1fr]">
          {/* 좌측 목차 (이동 메뉴) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="card p-3">
              <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-beauty-gray">
                목차
              </p>
              <ul className="space-y-1">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      className="block rounded-btn px-3 py-2 text-sm font-semibold text-beauty-neutral hover:bg-primary-pale hover:text-primary"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* 본문 */}
          <div className="space-y-12">
            {/* 이용약관 */}
            <section id="terms" className="scroll-mt-24">
              <h2 className="mb-1 text-2xl font-bold text-beauty-neutral">이용약관</h2>
              <p className="mb-5 text-xs text-beauty-gray">시행일: 2026년 1월 1일</p>
              <div className="card space-y-5 text-sm leading-relaxed text-beauty-gray">
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제1조 (목적)</h3>
                  <p>
                    본 약관은 골든웨이브(이하 “회사”)이 운영하는 BEAUTYmaster(이하
                    “서비스”)의 이용과 관련하여 회사와 이용자(이하 “회원”)의 권리·의무 및 책임사항을
                    규정함을 목적으로 합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제2조 (정의)</h3>
                  <p>
                    1. “서비스”란 회사가 제공하는 미용 국가자격증 필기 학습용 문제은행·모의고사·해설
                    등 일체의 온라인 학습 서비스를 말합니다.
                    <br />
                    2. “회원”이란 본 약관에 동의하고 회사와 이용계약을 체결한 자를 말합니다.
                    <br />
                    3. “콘텐츠”란 서비스에서 제공되는 문제, 해설, 이미지, 텍스트 등 모든 자료를
                    말합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제3조 (약관의 게시와 개정)</h3>
                  <p>
                    회사는 본 약관을 회원이 쉽게 확인할 수 있도록 서비스 화면에 게시합니다. 회사는
                    관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용일자 및
                    개정 사유를 명시하여 최소 7일 전(회원에게 불리한 개정은 30일 전)부터 공지합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제4조 (이용계약의 성립)</h3>
                  <p>
                    이용계약은 회원이 되고자 하는 자가 약관에 동의하고 회사가 정한 가입 양식에 따라
                    회원정보를 기입한 후 가입을 신청하고, 회사가 이를 승낙함으로써 성립합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제5조 (서비스의 제공 및 변경)</h3>
                  <p>
                    회사는 회원에게 문제 풀이, 모의고사, 오답복습, AI 해설 등 학습 기능을 제공합니다.
                    회사는 운영상·기술상 필요한 경우 서비스의 전부 또는 일부를 변경할 수 있으며, 중요한
                    변경 사항은 사전에 공지합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제6조 (회원의 의무)</h3>
                  <p>
                    회원은 타인의 정보를 도용하거나, 서비스의 콘텐츠를 무단으로 복제·배포·판매하거나,
                    서비스 운영을 방해하는 행위를 하여서는 안 됩니다. 계정은 본인만 사용해야 하며,
                    계정 공유로 인한 불이익의 책임은 회원에게 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제7조 (콘텐츠의 저작권)</h3>
                  <p>
                    서비스에서 제공되는 모든 콘텐츠의 저작권은 회사 또는 정당한 권리자에게 있습니다.
                    회원은 학습 목적의 개인적 이용 범위를 넘어 콘텐츠를 이용할 수 없습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제8조 (면책)</h3>
                  <p>
                    서비스가 제공하는 문제는 공개된 출제 경향을 바탕으로 AI를 활용해 재구성한 학습용
                    자료로, 실제 시험 문항과 동일함을 보장하지 않으며 합격을 보장하지 않습니다. 회사는
                    천재지변, 회원의 귀책사유 등 회사의 책임이 없는 사유로 인한 손해에 대해 책임을
                    지지 않습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">제9조 (분쟁 해결 및 관할)</h3>
                  <p>
                    본 약관과 관련한 분쟁은 대한민국 법령에 따르며, 분쟁에 관한 소송은 민사소송법상의
                    관할 법원에 제기합니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 개인정보처리방침 */}
            <section id="privacy" className="scroll-mt-24">
              <h2 className="mb-1 text-2xl font-bold text-beauty-neutral">개인정보처리방침</h2>
              <p className="mb-5 text-xs text-beauty-gray">시행일: 2026년 1월 1일</p>
              <div className="card space-y-5 text-sm leading-relaxed text-beauty-gray">
                <p>
                  골든웨이브(이하 “회사”)은 「개인정보 보호법」 등 관련 법령을 준수하며,
                  이용자의 개인정보를 안전하게 보호하기 위해 다음과 같은 처리방침을 둡니다.
                </p>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">1. 수집하는 개인정보 항목</h3>
                  <p>
                    - 필수: 이메일, 비밀번호(암호화 저장), 이름
                    <br />
                    - 선택: 휴대전화번호
                    <br />
                    - 자동 수집: 학습 기록, 접속 로그, 결제 내역
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">2. 개인정보의 수집·이용 목적</h3>
                  <p>
                    회원 식별 및 본인 확인, 학습 서비스 제공 및 진도·성취도 관리, 결제 및 수강 권한
                    관리, 고객 문의 응대, 서비스 개선을 위한 통계 분석에 이용합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">3. 보유 및 이용 기간</h3>
                  <p>
                    회원 탈퇴 시 지체 없이 파기함을 원칙으로 합니다. 다만 관련 법령에 따라 보존이
                    필요한 경우 해당 기간 동안 보관합니다.
                    <br />- 계약·청약철회 기록: 5년 (전자상거래법)
                    <br />- 대금결제·재화공급 기록: 5년 (전자상거래법)
                    <br />- 소비자 불만·분쟁처리 기록: 3년 (전자상거래법)
                    <br />- 접속 로그 기록: 3개월 (통신비밀보호법)
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">4. 개인정보의 제3자 제공</h3>
                  <p>
                    회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 근거가
                    있거나 이용자가 사전에 동의한 경우에 한하여 제공할 수 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">5. 개인정보 처리의 위탁</h3>
                  <p>
                    회사는 안정적인 서비스 제공을 위해 결제 대행, 클라우드 인프라(데이터 저장) 등
                    일부 업무를 외부 전문 업체에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게
                    관리되도록 합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">6. 이용자의 권리</h3>
                  <p>
                    이용자는 언제든지 자신의 개인정보를 조회·수정하거나 처리정지·삭제(회원 탈퇴)를
                    요청할 수 있습니다. 요청은 고객센터를 통해 접수할 수 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">7. 개인정보의 안전성 확보 조치</h3>
                  <p>
                    비밀번호 암호화 저장, 접근 권한 관리, 접속 기록 보관 등 기술적·관리적 보호조치를
                    시행합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">8. 개인정보보호책임자</h3>
                  <p>
                    성명: 이태나
                    <br />
                    이메일:{" "}
                    <a href="mailto:support@beautymaster.kr" className="font-semibold text-primary">
                      support@beautymaster.kr
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* 환불정책 */}
            <section id="refund" className="scroll-mt-24">
              <h2 className="mb-1 text-2xl font-bold text-beauty-neutral">환불정책</h2>
              <p className="mb-5 text-xs text-beauty-gray">시행일: 2026년 1월 1일</p>
              <div className="card space-y-5 text-sm leading-relaxed text-beauty-gray">
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">1. 청약철회 (전액 환불)</h3>
                  <p>
                    결제일로부터 7일 이내이며 유료 콘텐츠(전체 문제·모의고사 등)를 이용하지 않은
                    경우, 전액 환불이 가능합니다. 무료체험만 이용한 경우는 콘텐츠 이용으로 보지
                    않습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">2. 이용 후 환불 (부분 환불)</h3>
                  <p>
                    학습을 시작한 이후의 환불은 아래 기준에 따릅니다.
                    <br />- 결제 후 7일 이내 &amp; 학습 진도 10% 이하: 결제금액의 90% 환불
                    <br />- 결제 후 7일 초과 또는 진도 10% 초과 ~ 50% 이하: 결제금액의 50% 환불
                    <br />- 진도 50% 초과: 환불 불가
                    <br />※ 진도는 해당 과정의 학습 진행률을 기준으로 산정합니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">3. 환불이 제한되는 경우</h3>
                  <p>
                    이벤트·프로모션으로 무상 제공된 콘텐츠, 수강 기간이 만료된 상품, 회원의 약관 위반
                    으로 이용이 정지된 경우에는 환불이 제한될 수 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">4. 환불 신청 방법</h3>
                  <p>
                    고객센터 이메일(
                    <a href="mailto:support@beautymaster.kr" className="font-semibold text-primary">
                      support@beautymaster.kr
                    </a>
                    )로 주문자명, 결제일, 환불 사유를 기재하여 접수해 주세요.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-beauty-neutral">5. 환불 처리 기간</h3>
                  <p>
                    환불 신청 접수 및 확인 후 영업일 기준 3~5일 이내에 결제 수단(또는 입금 계좌)으로
                    환불해 드립니다. 무통장 입금 결제의 경우 환불받을 계좌 정보가 필요합니다.
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-2 text-center">
              <Link href="/" className="text-sm font-semibold text-primary">
                ← 홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
