"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AcademyTier } from "@/lib/academy";
import { tierAtLeast } from "@/lib/academy";

const NAV = [
  { href: "/academy/dashboard", label: "개요", icon: "📊", min: "basic" as AcademyTier },
  { href: "/academy/dashboard?tab=students", label: "학생", icon: "👥", min: "basic" as AcademyTier },
  { href: "/academy/groups", label: "반 관리", icon: "🏫", min: "standard" as AcademyTier },
  { href: "/academy/teachers", label: "강사", icon: "👨‍🏫", min: "standard" as AcademyTier },
  { href: "/academy/report", label: "리포트", icon: "📄", min: "standard" as AcademyTier },
  { href: "/academy/branches", label: "지점", icon: "🏢", min: "premium" as AcademyTier },
  { href: "/academy/analytics", label: "분석", icon: "📈", min: "premium" as AcademyTier },
  { href: "/academy/questions", label: "문제", icon: "📝", min: "premium" as AcademyTier },
  { href: "/academy/settings", label: "설정", icon: "⚙️", min: "standard" as AcademyTier },
];

export default function AcademySidebar({ tier }: { tier: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 bg-b2b-primary p-4 lg:block">
      <nav className="space-y-1">
        {NAV.map((item) => {
          const locked = !tierAtLeast(tier, item.min);
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={locked ? `/academy/dashboard?error=upgrade&from=${item.href}` : item.href}
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                active
                  ? "bg-b2b-accent/20 font-semibold text-white"
                  : "text-slate-300 hover:bg-white/10"
              } ${locked ? "opacity-50" : ""}`}
            >
              <span>{item.icon}</span>
              {item.label}
              {locked && <span className="ml-auto text-xs">🔒</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
