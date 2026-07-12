import { handleOAuthCallback } from "@/lib/oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  await handleOAuthCallback("google", searchParams.get("code"), searchParams.get("state"));
}
