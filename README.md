# PASSmaster

국가기술자격·자격증 필기시험 **문제은행 학습 플랫폼**.
무료체험 → 3회차 반복학습 → 오답복습 → 6회 모의고사 → 오답복습 → 합격까지의 학습 여정을 제공합니다.

## ✨ 핵심 기능

- **무료체험 100문제** — 회원가입만으로 즉시 학습, 즉시 정오 피드백 + 해설
- **3회차 반복학습** — 1회차(읽기·이해, 타이머 X) → 2회차(50초) → 3회차(40초)
- **선택지 랜덤 셔플** — 문제 ID + 회차 번호 시드 기반(`lib/shuffle.ts`)으로 3배수 학습 효과
- **오답복습 시스템** — 반복학습 후 1회 + 모의고사 후 1회, 정답 시 자동 해결 처리
- **모의고사 6회** — 자격증별 실제 과목 비율 + 회차별 난이도 비율 반영(`lib/mock-generator.ts`)
- **단계별 잠금 해제** — 이전 단계 완료 시 다음 단계 활성화(`lib/progress.ts`)
- **결과 리포트** — 총점/정답률/과목별 정답률/오답 목록, 모의고사 합격 판정(60%)
- **관리자** — 대시보드, 수강·결제 승인, 문제 CRUD, 엑셀(TSV) 일괄 업로드, 회원/통계
- **핑크·레드 디자인 시스템** — 기획안 컬러 팔레트(`tailwind.config.ts`)

## 🛠 기술 스택

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- Prisma ORM · PostgreSQL (Neon / Vercel Postgres)
- 커스텀 JWT 쿠키 세션(`jose`) + `bcryptjs`

## 🚀 시작하기 (로컬)

1. PostgreSQL 연결 문자열을 준비합니다(무료: [Neon](https://neon.tech)).
2. `.env.example`을 복사해 `.env`를 만들고 값을 채웁니다.

```bash
cp .env.example .env      # DATABASE_URL, AUTH_SECRET 설정
npm install
npx prisma db push        # 스키마 → DB 반영
npx prisma db seed        # 4종 과정 + 샘플 문제 + 데모 계정
npm run dev               # http://localhost:3000
```

> `.env`의 `DATABASE_URL`에 Postgres 연결 문자열, `AUTH_SECRET`에 임의의 긴 문자열을 넣으세요.

## ☁️ 배포 (Vercel)

1. 이 저장소를 GitHub에 올립니다.
2. [Vercel](https://vercel.com)에서 **Import Git Repository**로 이 저장소를 선택합니다.
3. **Storage → Postgres(Neon)** 를 생성/연결하면 `DATABASE_URL`이 자동 주입됩니다.
4. 환경 변수에 `AUTH_SECRET`(임의의 긴 문자열)을 추가합니다.
5. 첫 배포 후 한 번만 스키마 반영 + 시드를 실행합니다(로컬에서 prod URL 사용):

```bash
# prod DATABASE_URL 로 한 번만 실행
npx prisma db push
npx prisma db seed
```

빌드 시 `prisma generate`가 자동 실행됩니다(`package.json`의 `build`/`postinstall`).

### 데모 계정

| 구분   | 이메일                    | 비밀번호   |
| ------ | ------------------------- | ---------- |
| 학생   | student@test.com          | test1234   |
| 관리자 | admin@passmaster.kr     | admin1234  |

> 학생 계정은 "미용사(일반)" 과정이 활성 상태로 등록되어 바로 학습할 수 있습니다.
> 새 계정으로 수강신청 시, 결제 안내 화면의 **"데모: 즉시 승인"** 버튼으로 학습을 체험할 수 있습니다.

## 📁 주요 구조

```
app/
  (공개)        page.tsx(랜딩) · login · signup
  enroll/       수강신청 → 결제안내 → 완료
  trial/        무료체험 + 결과
  dashboard/    내 학습 현황
  learn/[slug]/ 학습홈 · round/[n] · wrong/round · mock/[m] · wrong/mock (+ result)
  mypage/       내 정보 · 결제내역
  admin/        대시보드 · enrollments · questions · users · stats
  api/learn/    answer · progress · complete
components/quiz/ QuizRunner · QuizCard 요소(ProgressBar·TimerGauge·OptionButton·ExplanationBox) · ResultView
lib/            prisma · auth · access · courses · shuffle · mock-generator · quiz · progress · types
prisma/         schema.prisma · seed.ts
```

## 📝 참고

- 샘플 문제는 과목별 키워드 기반으로 자동 생성된 데모 데이터입니다. 실제 운영 시 관리자 페이지의 일괄 업로드로 기출/예상 문제를 등록하세요.
- 이메일 인증/결제(PG)/알림톡은 기획안의 Phase 2~3 항목으로, 현재는 계좌이체 안내 + 관리자 수동 승인(+데모 즉시 승인)으로 구현되어 있습니다.
