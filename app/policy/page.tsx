import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "이용약관 · 개인정보처리방침 · 환불정책 · PASSmaster",
  description: "PASSmaster 이용약관, 개인정보처리방침, 환불정책 안내",
};

const NAV = [
  { id: "terms", label: "이용약관" },
  { id: "privacy", label: "개인정보처리방침" },
  { id: "refund", label: "환불정책" },
];

const EFFECTIVE_DATE = "2026년 6월 1일";

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1 font-bold text-beauty-neutral">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

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
            {/* 사업자 정보 요약 */}
            <div className="card text-sm leading-relaxed text-beauty-gray">
              <p className="mb-1 font-bold text-beauty-neutral">사업자 정보</p>
              <p>
                상호: 골든웨이브 · 대표: 이동길 · 사업자등록번호: 326-58-00636
                <br />
                통신판매업 신고: 제2022-인천서구-1321호 · 주소: 인천광역시 서구 가재울로 20
                <br />
                서비스명: PASSmaster · 고객센터:{" "}
                <a href="mailto:support@passmaster.kr" className="font-semibold text-primary">
                  support@passmaster.kr
                </a>
              </p>
            </div>

            {/* 이용약관 */}
            <section id="terms" className="scroll-mt-24">
              <h2 className="mb-1 text-2xl font-bold text-beauty-neutral">이용약관</h2>
              <p className="mb-5 text-xs text-beauty-gray">시행일: {EFFECTIVE_DATE}</p>
              <div className="card space-y-5 text-sm leading-relaxed text-beauty-gray">
                <Clause title="제1조 (목적)">
                  <p>
                    이 약관은 골든웨이브(이하 “회사”)가 운영하는 PASSmaster(이하 “서비스”)의
                    이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을
                    규정함을 목적으로 합니다.
                  </p>
                </Clause>

                <Clause title="제2조 (정의)">
                  <p>1. “서비스”란 회사가 제공하는 국가기술자격·자격증 필기시험 대비 온라인 문제은행 및 관련 학습 콘텐츠 일체를 말합니다.</p>
                  <p>2. “이용자”란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</p>
                  <p>3. “회원”이란 서비스에 가입하여 아이디(ID)를 부여받은 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속 이용할 수 있는 자를 말합니다.</p>
                  <p>4. “콘텐츠”란 회사가 서비스에서 제공하는 문제, 해설, 모의고사, 학습 자료 등 디지털 형태의 정보 또는 자료를 말합니다.</p>
                </Clause>

                <Clause title="제3조 (약관의 게시와 개정)">
                  <p>1. 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면 또는 연결 화면에 게시합니다.</p>
                  <p>2. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                  <p>3. 약관을 개정할 경우 적용일자 및 개정사유를 명시하여 적용일자 7일 전부터 공지합니다. 다만 이용자에게 불리한 개정의 경우에는 30일 전부터 공지하고, 개별 통지합니다.</p>
                  <p>4. 이용자가 개정약관의 적용일까지 거부 의사를 표시하지 않으면 개정약관에 동의한 것으로 봅니다.</p>
                </Clause>

                <Clause title="제4조 (서비스의 내용)">
                  <p>1. 회사가 제공하는 서비스는 국가기술자격·자격증 필기시험 대비를 위한 학습용 문제은행 및 모의고사, 오답복습 등 부가 학습 기능입니다.</p>
                  <p>
                    2. 서비스에서 제공되는 문제는 큐넷(Q-Net), 한국산업인력공단 또는 자격시험 시행기관이
                    공식적으로 배포하는 정식 기출문제 원문이 아니며, 공개된 출제 경향·과목 구성·시험
                    범위를 참고하여 인공지능(AI)을 활용해 재구성한 학습용 예상·복습 문항입니다.
                  </p>
                  <p>3. 서비스는 텍스트 기반 문항을 중심으로 제공하며, 그림·사진·도표 등 이미지 기반 문항은 제공되지 않을 수 있습니다.</p>
                  <p>4. 회사는 학습 보조 자료를 제공할 뿐 합격을 보장하지 않으며, 실제 시험의 출제 범위·방식·법령·기준 개정 등과 차이가 있을 수 있습니다.</p>
                  <p>5. 시험 접수, 출제기준, 일정, 합격 기준 등 공식 정보는 이용자가 큐넷(Q-Net) 또는 해당 시행기관의 공지를 통해 직접 확인하여야 합니다.</p>
                </Clause>

                <Clause title="제5조 (회원가입)">
                  <p>1. 이용자는 회사가 정한 양식에 따라 회원정보를 기입하고 이 약관에 동의함으로써 회원가입을 신청합니다.</p>
                  <p>2. 회사는 다음 각 호에 해당하지 않는 한 회원가입을 승낙합니다.</p>
                  <p className="pl-3">
                    - 가입신청자가 이전에 회원자격을 상실한 적이 있는 경우
                    <br />- 타인의 명의를 도용하는 등 허위 정보를 기재한 경우
                    <br />- 기타 회원으로 등록하는 것이 회사의 운영에 현저히 지장이 있다고 판단되는 경우
                  </p>
                </Clause>

                <Clause title="제6조 (이용계약의 성립 및 콘텐츠 제공)">
                  <p>1. 유료 콘텐츠 이용계약은 이용자가 이용을 신청하고 회사가 이를 승낙하여 결제(또는 회사가 정한 입금 확인·승인 절차)가 완료된 때에 성립합니다.</p>
                  <p>2. 회사는 결제 완료 또는 승인 절차 완료 후 해당 콘텐츠 및 학습 기능을 이용자에게 제공합니다.</p>
                  <p>3. 유료 콘텐츠의 이용 기간은 결제일을 기준으로 회사가 정한 기간(과정별 수강기간)으로 하며, 해당 기간 내 무제한으로 이용할 수 있습니다.</p>
                </Clause>

                <Clause title="제7조 (이용자의 의무)">
                  <p>1. 이용자는 다음 행위를 하여서는 안 됩니다.</p>
                  <p className="pl-3">
                    - 회사가 제공하는 콘텐츠를 무단으로 복제, 캡처, 배포, 전송, 출판하거나 제3자에게 제공하는 행위
                    <br />- 타인의 계정을 도용하거나 결제 정보를 부정하게 이용하는 행위
                    <br />- 서비스의 정상적 운영을 방해하는 행위
                  </p>
                  <p>
                    2. 콘텐츠에 대한 저작권 및 지식재산권은 회사에 귀속되며, 이용자는 개인적·비상업적
                    학습 목적으로만 콘텐츠를 이용할 수 있습니다. 이를 위반하여 발생하는 모든 책임은
                    이용자에게 있습니다.
                  </p>
                </Clause>

                <Clause title="제8조 (회사의 의무)">
                  <p>1. 회사는 관련 법령과 이 약관을 준수하며, 안정적이고 지속적으로 서비스를 제공하기 위해 노력합니다.</p>
                  <p>2. 회사는 이용자의 개인정보를 본인의 동의 없이 제3자에게 제공하지 않으며, 개인정보처리방침에 따라 이를 보호합니다.</p>
                </Clause>

                <Clause title="제9조 (서비스의 중단)">
                  <p>1. 회사는 시스템 점검·보수·교체, 통신 두절, 천재지변 등 부득이한 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</p>
                  <p>2. 회사의 고의 또는 중대한 과실 없이 발생한 서비스 중단에 대하여 회사는 책임을 지지 않습니다.</p>
                </Clause>

                <Clause title="제10조 (책임의 제한)">
                  <p>1. 회사는 학습 콘텐츠를 제공할 뿐이며, 이용자의 시험 합격 여부에 대하여 책임지지 않습니다.</p>
                  <p>2. 회사는 콘텐츠의 정확성을 위해 노력하나, 법령 개정·출제기준 변경 등으로 인한 내용의 차이에 대하여 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.</p>
                </Clause>

                <Clause title="제11조 (분쟁의 해결 및 관할)">
                  <p>이 약관과 관련하여 발생한 분쟁에 대해서는 대한민국 법령을 적용하며, 분쟁에 관한 소송은 민사소송법상의 관할 법원에 제기합니다.</p>
                </Clause>

                <p className="border-t border-gray-100 pt-3 text-xs text-beauty-gray">
                  부칙 — 이 약관은 {EFFECTIVE_DATE}부터 시행합니다.
                </p>
              </div>
            </section>

            {/* 개인정보처리방침 */}
            <section id="privacy" className="scroll-mt-24">
              <h2 className="mb-1 text-2xl font-bold text-beauty-neutral">개인정보처리방침</h2>
              <p className="mb-5 text-xs text-beauty-gray">시행일: {EFFECTIVE_DATE}</p>
              <div className="card space-y-5 text-sm leading-relaxed text-beauty-gray">
                <p>
                  골든웨이브(이하 “회사”)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의
                  개인정보를 안전하게 보호하기 위해 다음과 같은 처리방침을 둡니다.
                </p>

                <Clause title="제1조 (수집하는 개인정보 항목)">
                  <p>
                    - 필수: 이메일 주소, 비밀번호(암호화 저장), 이름
                    <br />- 선택: 휴대전화번호, (결제 시) 결제 정보
                    <br />- 자동 수집: 접속 로그, 쿠키, 학습 이용 기록
                  </p>
                </Clause>

                <Clause title="제2조 (개인정보의 수집 및 이용 목적)">
                  <p>
                    - 회원 관리 및 본인 확인
                    <br />- 유료 콘텐츠 제공 및 결제·환불 처리
                    <br />- 학습 기록 분석을 통한 서비스 개선 및 맞춤형 학습 제공
                    <br />- 고객 문의 응대 및 공지사항 전달
                  </p>
                </Clause>

                <Clause title="제3조 (개인정보의 보유 및 이용기간)">
                  <p>
                    회원 탈퇴 시 지체 없이 파기함을 원칙으로 합니다. 다만 관련 법령에 따라 보존이
                    필요한 경우 해당 기간 동안 보관합니다.
                    <br />- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
                    <br />- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)
                    <br />- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)
                    <br />- 접속 로그 기록: 3개월 (통신비밀보호법)
                  </p>
                </Clause>

                <Clause title="제4조 (개인정보의 제3자 제공)">
                  <p>
                    회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 결제 처리를
                    위한 결제대행사 등 법령에 근거하거나 서비스 제공에 필요한 최소한의 범위는 예외로
                    합니다.
                  </p>
                </Clause>

                <Clause title="제5조 (개인정보 처리의 위탁)">
                  <p>
                    회사는 안정적인 서비스 제공을 위해 결제 대행, 클라우드 인프라(데이터 저장) 등 일부
                    업무를 외부 전문 업체에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게
                    관리되도록 합니다.
                  </p>
                </Clause>

                <Clause title="제6조 (이용자의 권리)">
                  <p>
                    이용자는 언제든지 자신의 개인정보를 조회·수정하거나 처리정지·삭제(회원 탈퇴)를
                    요청할 수 있으며, 요청은 고객센터를 통해 접수할 수 있습니다.
                  </p>
                </Clause>

                <Clause title="제7조 (개인정보의 안전성 확보 조치)">
                  <p>
                    비밀번호 암호화 저장, 접근 권한 관리, 접속 기록 보관 등 기술적·관리적 보호조치를
                    시행합니다.
                  </p>
                </Clause>

                <Clause title="제8조 (개인정보보호책임자)">
                  <p>
                    성명: 이태나
                    <br />
                    이메일:{" "}
                    <a href="mailto:support@passmaster.kr" className="font-semibold text-primary">
                      support@passmaster.kr
                    </a>
                  </p>
                </Clause>

                <p className="border-t border-gray-100 pt-3 text-xs text-beauty-gray">
                  부칙 — 이 방침은 {EFFECTIVE_DATE}부터 시행합니다.
                </p>
              </div>
            </section>

            {/* 환불정책 */}
            <section id="refund" className="scroll-mt-24">
              <h2 className="mb-1 text-2xl font-bold text-beauty-neutral">환불정책</h2>
              <p className="mb-5 text-xs text-beauty-gray">시행일: {EFFECTIVE_DATE}</p>
              <div className="card space-y-5 text-sm leading-relaxed text-beauty-gray">
                <Clause title="제1조 (목적)">
                  <p>
                    이 정책은 「전자상거래 등에서의 소비자보호에 관한 법률」(이하 “전자상거래법”) 및
                    관련 법령에 따라 PASSmaster 유료 콘텐츠의 청약철회 및 환불 기준을 정함을 목적으로
                    합니다.
                  </p>
                </Clause>

                <Clause title="제2조 (청약철회)">
                  <p>1. 이용자는 유료 콘텐츠 결제일로부터 7일 이내에 청약철회를 할 수 있습니다.</p>
                  <p>
                    2. 다만 디지털 콘텐츠의 제공이 개시된 경우에는 전자상거래법 제17조 제2항에 따라
                    청약철회가 제한될 수 있습니다. 본 서비스에서 “제공의 개시”란 이용자가 결제 후 유료
                    콘텐츠(문제 풀이, 모의고사 등)의 학습을 시작한 시점을 의미합니다.
                  </p>
                  <p>
                    3. 회사는 청약철회가 제한되는 콘텐츠에 대하여 그 사실을 결제 단계에서 명확히
                    고지하고 이용자의 동의를 받습니다. 또한 무료체험을 통해 이용자가 구매 전 콘텐츠를
                    충분히 확인할 수 있도록 합니다.
                  </p>
                </Clause>

                <Clause title="제3조 (환불 기준)">
                  <div className="overflow-x-auto">
                    <table className="mt-1 w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-primary-pale/40 text-left text-beauty-neutral">
                          <th className="border border-gray-200 px-3 py-2">구분</th>
                          <th className="border border-gray-200 px-3 py-2">환불 기준</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 px-3 py-2">결제 후 7일 이내 + 학습 이력 없음</td>
                          <td className="border border-gray-200 px-3 py-2">전액 환불</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-3 py-2">결제 후 7일 이내 + 학습 이력 있음</td>
                          <td className="border border-gray-200 px-3 py-2">디지털 콘텐츠 제공 개시로 환불 제한(제4조 참조)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-3 py-2">결제 후 7일 경과</td>
                          <td className="border border-gray-200 px-3 py-2">원칙적으로 환불 불가(제4조의 예외 적용 가능)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-3 py-2">회사의 귀책 사유(서비스 하자·중대한 오류 등)</td>
                          <td className="border border-gray-200 px-3 py-2">전액 환불 또는 이용기간 연장</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2">1. “학습 이력 없음”이란 결제 후 유료 콘텐츠의 문제를 단 1문항도 풀지 않은 상태를 말합니다.</p>
                  <p>2. 회사의 시스템 오류, 콘텐츠의 중대한 하자 등 회사의 귀책으로 정상적인 이용이 불가능한 경우, 이용자는 기간과 무관하게 환불 또는 이용기간 연장을 요청할 수 있습니다.</p>
                </Clause>

                <Clause title="제4조 (이용 개시 후 환불)">
                  <p>1. 학습이 일부 진행된 경우라도, 회사는 소비자 보호를 위하여 이용 기간 및 이용 정도를 고려하여 합리적 범위에서 부분 환불을 검토할 수 있습니다.</p>
                  <p>2. 부분 환불 시 이미 제공된 콘텐츠에 상당하는 금액 및 이용일수에 해당하는 금액을 공제할 수 있습니다. 다만 회사는 전자상거래법에 따라 청약철회와 관련하여 부당한 위약금이나 손해배상을 청구하지 않습니다.</p>
                </Clause>

                <Clause title="제5조 (환불 절차)">
                  <p>
                    1. 환불을 원하는 이용자는 고객센터(
                    <a href="mailto:support@passmaster.kr" className="font-semibold text-primary">
                      support@passmaster.kr
                    </a>
                    )로 주문자명, 결제일, 환불 사유를 기재하여 환불을 요청합니다.
                  </p>
                  <p>2. 회사는 환불 요청을 접수한 날부터 3영업일 이내에 환불 사유를 확인하고, 환불이 결정된 경우 결제 수단에 따라 환급 절차를 진행합니다.</p>
                  <p>3. 결제 수단별로 환급 소요 기간은 다를 수 있으며, 무통장 입금 결제의 경우 환불받을 계좌 정보가 필요합니다.</p>
                </Clause>

                <Clause title="제6조 (환불 제한)">
                  <p>다음의 경우 환불이 제한되거나 거절될 수 있습니다.</p>
                  <p className="pl-3">
                    - 이용자가 콘텐츠를 부정하게 복제·배포한 사실이 확인된 경우
                    <br />- 이벤트·프로모션을 통해 무상 또는 특별 할인으로 제공받은 콘텐츠로서 환불 불가 조건이 사전 고지된 경우
                    <br />- 기타 관련 법령에 따라 환불이 제한되는 경우
                  </p>
                </Clause>

                <p className="border-t border-gray-100 pt-3 text-xs text-beauty-gray">
                  부칙 — 이 환불정책은 {EFFECTIVE_DATE}부터 시행합니다.
                </p>
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
