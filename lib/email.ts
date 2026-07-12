import { Resend } from "resend";
import { absoluteUrl } from "./site-url";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM || "PASSmaster <onboarding@resend.dev>";

export async function sendTeacherInviteEmail(opts: {
  to: string;
  academyName: string;
  setupUrl: string;
}) {
  const link = absoluteUrl(opts.setupUrl);
  const subject = `[PASSmaster] ${opts.academyName} 강사 초대`;
  const html = `
    <p>안녕하세요,</p>
    <p><strong>${opts.academyName}</strong>에서 PASSmaster B2B 강사 계정 초대가 도착했습니다.</p>
    <p>아래 링크에서 비밀번호를 설정해 주세요. (48시간 유효)</p>
    <p><a href="${link}">${link}</a></p>
    <p>— PASSmaster</p>
  `;

  if (!resend) {
    console.log("[email stub]", subject, "→", opts.to, link);
    return { ok: true, stub: true };
  }

  await resend.emails.send({ from: FROM, to: opts.to, subject, html });
  return { ok: true };
}

export async function sendOwnerWeeklyReportEmail(opts: {
  to: string;
  academyName: string;
  stats: { total: number; active7d: number; inactive7d: number; avgAccuracy: number };
  atRisk: { name: string; accuracy: number; status: string }[];
}) {
  const dashboard = absoluteUrl("/academy/dashboard");
  const subject = `[PASSmaster] ${opts.academyName} 주간 학습 리포트`;
  const atRiskHtml =
    opts.atRisk.length === 0
      ? "<p>주의 학생이 없습니다.</p>"
      : `<ul>${opts.atRisk
          .map((s) => `<li>${s.name} — 정답률 ${s.accuracy}% (${s.status})</li>`)
          .join("")}</ul>`;

  const html = `
    <h2>${opts.academyName} 주간 리포트</h2>
    <ul>
      <li>전체 학생: ${opts.stats.total}명</li>
      <li>7일 활성: ${opts.stats.active7d}명</li>
      <li>7일 미접속: ${opts.stats.inactive7d}명</li>
      <li>평균 정답률: ${opts.stats.avgAccuracy}%</li>
    </ul>
    <h3>주의 학생</h3>
    ${atRiskHtml}
    <p><a href="${dashboard}">대시보드에서 자세히 보기</a></p>
  `;

  if (!resend) {
    console.log("[email stub weekly]", subject, "→", opts.to);
    return { ok: true, stub: true };
  }

  await resend.emails.send({ from: FROM, to: opts.to, subject, html });
  return { ok: true };
}

export async function sendAcademyOwnerInviteEmail(opts: {
  to: string;
  academyName: string;
  setupUrl: string;
  code: string | null;
}) {
  const link = absoluteUrl(opts.setupUrl);
  const subject = `[PASSmaster] ${opts.academyName} 원장 계정 설정`;
  const html = `
    <p>${opts.academyName} B2B 학원이 개설되었습니다.</p>
    <p>원장 계정 설정: <a href="${link}">${link}</a></p>
    ${opts.code ? `<p>학생 학원 코드: <strong>${opts.code}</strong></p>` : ""}
  `;

  if (!resend) {
    console.log("[email stub owner]", subject, "→", opts.to);
    return { ok: true, stub: true };
  }

  await resend.emails.send({ from: FROM, to: opts.to, subject, html });
  return { ok: true };
}
