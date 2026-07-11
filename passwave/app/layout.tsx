import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PASSWAVE — AI 국가자격증 문제은행",
  description:
    "BEAUTYmaster, COOKmaster, PASSmaster — AI 문제은행으로 국가자격증 필기 시험을 준비하세요.",
  openGraph: {
    title: "PASSWAVE — AI 국가자격증 문제은행",
    description: "AI 문제은행 허브 — BEAUTYmaster · COOKmaster · PASSmaster",
    url: "https://passwave.kr",
    siteName: "PASSWAVE",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
