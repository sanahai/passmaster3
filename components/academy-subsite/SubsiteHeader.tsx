"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import type { BrandConfig } from "@/lib/brand";
import { subsitePath } from "@/lib/academy-subsite-paths";

type Props = {
  subdomain: string;
  academyName: string;
  logoUrl?: string | null;
  brand: BrandConfig;
  role: "student" | "admin";
  userName: string;
};

export default function SubsiteHeader({ subdomain, academyName, logoUrl, brand, role, userName }: Props) {
  const isAdmin = role === "admin";

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        isAdmin ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={subsitePath(subdomain, isAdmin ? "/admin" : "/dashboard")} className="flex shrink-0 items-center gap-2">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={academyName} className="h-8 max-w-[100px] object-contain" />
            ) : (
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={32}
                className={`h-7 w-auto ${isAdmin ? "brightness-0 invert" : ""}`}
              />
            )}
            <span className="hidden truncate text-sm font-bold sm:inline">
              {brand.name} for {academyName}
            </span>
          </Link>
          {isAdmin && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
              관리자 모드
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {!isAdmin && (
            <Link
              href={subsitePath(subdomain, "/practice")}
              className="hidden rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 md:inline-flex"
            >
              문제 풀기
            </Link>
          )}
          <span className="hidden text-sm text-slate-500 sm:inline">{userName}님</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                isAdmin ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function SubsiteMobileNav({
  subdomain,
  items,
}: {
  subdomain: string;
  items: { href: string; label: string; icon: string }[];
}) {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-slate-200 bg-white lg:hidden">
      {items.slice(0, 5).map((item) => {
        const href = subsitePath(subdomain, item.href);
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
              active ? "text-[var(--subsite-primary)]" : "text-slate-500"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
