"use client";

import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

type Props = {
  academyName: string;
  logoUrl?: string | null;
  tier?: string;
};

export default function AcademyHeader({ academyName, logoUrl, tier }: Props) {
  return (
    <header className="flex items-center justify-between bg-b2b-primary px-6 py-4 text-white">
      <div className="flex items-center gap-3">
        <Link href="/academy/dashboard">
          <Image src="/logo.png" alt="BEAUTYmaster" width={120} height={36} className="h-8 w-auto brightness-0 invert" />
        </Link>
        {tier !== "basic" && logoUrl && (
          <>
            <span className="text-slate-500">|</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt={academyName} className="h-7 max-w-[80px] object-contain" />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-slate-300 sm:inline">{academyName}</span>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-slate-300 hover:text-white">
            로그아웃
          </button>
        </form>
      </div>
    </header>
  );
}
