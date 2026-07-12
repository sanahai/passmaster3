/** 카카오/Solapi 알림톡 — API 키 없으면 로그만 남김 */
export async function sendWeeklyAlimtalk(opts: {
  phone: string;
  academyName: string;
  inactiveCount: number;
  atRiskCount: number;
}) {
  const apiKey = process.env.ALIMTALK_API_KEY;
  const senderKey = process.env.ALIMTALK_SENDER_KEY;
  const templateId = process.env.ALIMTALK_WEEKLY_TEMPLATE_ID;

  const message = `[${opts.academyName}] 주간리포트: 미접속 ${opts.inactiveCount}명, 주의학생 ${opts.atRiskCount}명. PASSmaster 대시보드를 확인하세요.`;

  if (!apiKey || !senderKey || !templateId) {
    console.log("[alimtalk stub]", opts.phone, message);
    return { ok: true, stub: true };
  }

  // Solapi / NHN 등 공통 REST 패턴 (환경별 URL 설정)
  const url = process.env.ALIMTALK_API_URL || "https://api.solapi.com/messages/v4/send";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      senderKey,
      templateId,
      recipientList: [{ recipientNo: opts.phone.replace(/\D/g, ""), templateParameter: { message } }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[alimtalk error]", text);
    return { ok: false, error: text };
  }
  return { ok: true };
}
