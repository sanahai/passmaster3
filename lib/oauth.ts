import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site-url";
import { resolvePostLoginRedirect } from "@/lib/post-login-redirect";

const OAUTH_STATE_COOKIE = "oauth_state";
const OAUTH_REDIRECT_COOKIE = "oauth_redirect";

export type OAuthProvider = "google" | "kakao";

function providerConfig(provider: OAuthProvider) {
  if (provider === "google") {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scope: "openid email profile",
    };
  }
  return {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    authUrl: "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    scope: "profile_nickname account_email",
  };
}

export function isOAuthConfigured(provider: OAuthProvider): boolean {
  const cfg = providerConfig(provider);
  return Boolean(cfg.clientId && cfg.clientSecret);
}

export function getOAuthRedirectUri(provider: OAuthProvider): string {
  return `${getSiteUrl()}/api/auth/${provider}/callback`;
}

export function buildOAuthAuthorizeUrl(provider: OAuthProvider, redirectTo?: string): string | null {
  const cfg = providerConfig(provider);
  if (!cfg.clientId || !cfg.clientSecret) return null;

  const state = randomBytes(16).toString("hex");
  cookies().set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  if (redirectTo) {
    cookies().set(OAUTH_REDIRECT_COOKIE, redirectTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
  }

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: getOAuthRedirectUri(provider),
    response_type: "code",
    scope: cfg.scope,
    state,
  });
  if (provider === "kakao") params.set("prompt", "login");
  return `${cfg.authUrl}?${params.toString()}`;
}

async function exchangeCode(provider: OAuthProvider, code: string): Promise<string> {
  const cfg = providerConfig(provider);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: cfg.clientId!,
    client_secret: cfg.clientSecret!,
    redirect_uri: getOAuthRedirectUri(provider),
    code,
  });

  const res = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`${provider} token exchange failed`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error(`${provider} missing access_token`);
  return data.access_token;
}

async function fetchProfile(
  provider: OAuthProvider,
  accessToken: string
): Promise<{ email: string; name: string }> {
  if (provider === "google") {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("google profile fetch failed");
    const data = (await res.json()) as { email?: string; name?: string };
    if (!data.email) throw new Error("google email not granted");
    return { email: data.email.toLowerCase(), name: data.name || data.email.split("@")[0] };
  }

  const res = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("kakao profile fetch failed");
  const data = (await res.json()) as {
    kakao_account?: { email?: string; profile?: { nickname?: string } };
  };
  const email = data.kakao_account?.email;
  const name = data.kakao_account?.profile?.nickname || "카카오 사용자";
  if (!email) throw new Error("kakao_email_required");
  return { email: email.toLowerCase(), name };
}

async function findOrCreateOAuthUser(email: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(randomBytes(24).toString("hex")),
      emailVerified: true,
    },
  });
}

export async function handleOAuthCallback(
  provider: OAuthProvider,
  code: string | null,
  state: string | null
) {
  const savedState = cookies().get(OAUTH_STATE_COOKIE)?.value;
  const redirectTo = cookies().get(OAUTH_REDIRECT_COOKIE)?.value || "/dashboard";
  cookies().set(OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
  cookies().set(OAUTH_REDIRECT_COOKIE, "", { path: "/", maxAge: 0 });

  if (!code || !state || !savedState || state !== savedState) {
    redirect("/login?error=oauth_state");
  }

  try {
    const accessToken = await exchangeCode(provider, code);
    const profile = await fetchProfile(provider, accessToken);
    const user = await findOrCreateOAuthUser(profile.email, profile.name);
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    redirect(resolvePostLoginRedirect(user.role, redirectTo));
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    const msg = e instanceof Error ? e.message : "oauth_failed";
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }
}
