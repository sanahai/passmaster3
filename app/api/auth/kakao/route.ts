import { redirect } from "next/navigation";
import { buildOAuthAuthorizeUrl } from "@/lib/oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = buildOAuthAuthorizeUrl("kakao", searchParams.get("redirect") || undefined);
  if (!url) redirect("/login?error=kakao_not_configured");
  redirect(url);
}
