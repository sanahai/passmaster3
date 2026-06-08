import type { Metadata } from "next";
import "./globals.css";

// 모든 라우트를 요청 시 렌더링(동적)으로 강제 → 빌드 단계에서 DB 접속/프리렌더 방지
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BEAUTYmaster · 미용사 자격증 필기 문제은행",
  description:
    "미용사(일반·피부·네일·메이크업) 자격증 필기시험 대비 문제은행. 무료체험 100문제 + 3회차 반복학습 + 6회 모의고사 + 오답복습으로 합격까지.",
  keywords: [
    "미용사필기",
    "미용사자격증",
    "미용사일반 기출문제",
    "피부미용사 필기",
    "네일 자격증",
    "메이크업 자격증",
  ],
  openGraph: {
    title: "BEAUTYmaster · 미용사 자격증 필기 문제은행",
    description: "무료체험 → 반복학습 → 오답복습 → 모의고사 → 합격",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
