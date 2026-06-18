import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function WhiteLabelLandingPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const academy = await prisma.academy.findUnique({
    where: { subdomain: params.subdomain },
  });
  if (!academy || academy.activeUntil < new Date()) notFound();

  const brandColor = academy.primaryColor || "#0F172A";

  return (
    <main className="min-h-screen bg-b2b-light">
      <header
        className="px-4 py-6 text-white"
        style={{ backgroundColor: brandColor }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            {academy.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={academy.logoUrl} alt="" className="h-10 w-auto rounded" />
            ) : (
              <Image src="/logo.png" alt="BEAUTYmaster" width={120} height={36} className="h-8 w-auto brightness-0 invert" />
            )}
            <span className="text-xl font-bold">{academy.name}</span>
          </div>
          <Link href="/login" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30">
            로그인
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-b2b-primary md:text-4xl">
          {academy.name} × BEAUTYmaster
        </h1>
        <p className="mb-8 text-lg text-slate-600">
          미용사 국가기능사 필기 대비 — 학원 전용 학습 포털
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="b2b-btn-accent px-8 py-3 text-base">
            회원가입
          </Link>
          <Link
            href="/login"
            className="rounded-lg border-2 border-b2b-primary px-8 py-3 text-base font-semibold text-b2b-primary"
          >
            로그인
          </Link>
        </div>
        {academy.code && (
          <p className="mt-10 text-sm text-slate-500">
            가입 후 마이페이지에서 학원 코드 <strong className="font-mono text-b2b-accent">{academy.code}</strong>를 등록하세요.
          </p>
        )}
      </section>

      <footer className="border-t border-b2b-border py-6 text-center text-xs text-slate-400">
        Powered by BEAUTYmaster · 골든웨이브
      </footer>
    </main>
  );
}
