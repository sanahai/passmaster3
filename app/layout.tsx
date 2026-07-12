import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PASSmaster | 자격증 합격의 새로운 패러다임",
  description:
    "모든 자격증 합격에 필요한 합격 플랜에서 최단합격 플랜 및 수강신청 후 오답·낙찰·학습의 12주간 학습 전략으로 따라가면 됩니다.",
  keywords: [
    "자격증",
    "국가기술자격",
    "전기기능사",
    "지게차운전기능사",
    "제과기능사",
    "제빵기능사",
    "한식조리기능사",
    "미용사",
    "PASSmaster",
    "자격증 합격",
  ],
  openGraph: {
    title: "PASSmaster | 자격증 합격의 새로운 패러다임",
    description: "최단합격 플랜 · 집중학습 · 모의시험 · 합격 전략",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
