import { redirect } from "next/navigation";
import { buildOAuthAuthorizeUrl } from "@/lib/oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = buildOAuthAuthorizeUrl("google", searchParams.get("redirect") || undefined);
  if (!url) redirect("/login?error=google_not_configured");
  redirect(url);
}
