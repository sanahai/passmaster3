"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { subsitePath } from "@/lib/academy-subsite-paths";

const NAV = [
  { href: "/dashboard", label: "대시보드", icon: "🏠" },
  { href: "/practice", label: "문제 풀기", icon: "📖" },
  { href: "/wrong", label: "오답 복습", icon: "🔁" },
  { href: "/mock", label: "모의고사", icon: "📝" },
  { href: "/analysis", label: "성적 분석", icon: "📊" },
  { href: "/board", label: "공지·게시판", icon: "📌" },
  { href: "/mypage", label: "마이페이지", icon: "👤" },
];

type Props = {
  subdomain: string;
  academyName: string;
  streakDays?: number;
  daysLeft?: number | null;
};

export default function SidebarStudent({ subdomain, academyName, streakDays = 0, daysLeft }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-100 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">문제은행</p>
        <p className="truncate font-bold text-slate-800">{academyName}</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const href = subsitePath(subdomain, item.href);
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-sky-50 text-[var(--subsite-primary)]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-4 text-xs text-slate-500">
        {streakDays > 0 && <p className="mb-1">🔥 연속 학습 {streakDays}일</p>}
        {daysLeft != null && <p>수강 D-{daysLeft}</p>}
      </div>
    </aside>
  );
}

export const STUDENT_MOBILE_NAV = NAV;
