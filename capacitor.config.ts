import type { CapacitorConfig } from "@capacitor/cli";

// 인앱웹(WebView) 래퍼 설정.
// Next.js는 서버 렌더링 앱이라 정적 번들이 불가능하므로,
// 배포된 Vercel 주소를 네이티브 WebView에 그대로 로드한다(원격 URL 방식).
// → 웹을 수정/배포하면 앱도 자동으로 최신 상태가 된다.
const config: CapacitorConfig = {
  appId: "kr.beautymaster.app",
  appName: "BEAUTYmaster",
  webDir: "capacitor-shell",
  backgroundColor: "#ffffff",
  server: {
    url: "https://beautymaster.vercel.app",
    cleartext: false,
  },
  ios: {
    contentInset: "always",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
