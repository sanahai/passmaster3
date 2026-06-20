"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { subsitePath } from "@/lib/academy-subsite-paths";
import { tierAtLeast, type AcademyTier } from "@/lib/academy";

const NAV: { href: string; label: string; icon: string; min?: AcademyTier }[] = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/students", label: "학생 관리", icon: "👥" },
  { href: "/admin/questions", label: "문제 관리", icon: "📚", min: "premium" },
  { href: "/admin/grades", label: "성적 관리", icon: "📈", min: "standard" },
  { href: "/admin/board", label: "공지·게시판", icon: "📌", min: "standard" },
  { href: "/admin/settings", label: "학원 설정", icon: "⚙️", min: "standard" },
];

type Props = {
  subdomain: string;
  tier: string;
  studentCount: number;
};

export default function SidebarAdmin({ subdomain, tier, studentCount }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-slate-950 text-white lg:flex">
      <div className="border-b border-slate-800 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">학원 관리</p>
        <p className="text-sm text-slate-300">수강생 {studentCount}명</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const locked = item.min && !tierAtLeast(tier, item.min);
          const href = subsitePath(subdomain, item.href);
          const active =
            pathname === href ||
            (item.href !== "/admin" && pathname.startsWith(`${href}/`)) ||
            (item.href === "/admin" && pathname === href);
          return (
            <Link
              key={item.href}
              href={locked ? subsitePath(subdomain, "/admin") : href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              } ${locked ? "opacity-40" : ""}`}
            >
              <span>{item.icon}</span>
              {item.label}
              {locked && <span className="ml-auto text-xs">🔒</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <Link
          href="/academy/dashboard"
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          B2B 전체 관리 →
        </Link>
      </div>
    </aside>
  );
}

export const ADMIN_MOBILE_NAV = NAV.filter((n) => !n.min || true).slice(0, 5);
