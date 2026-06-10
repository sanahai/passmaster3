import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/access";
import { logoutAction } from "@/app/actions/auth";

const NAV = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/enrollments", label: "수강·결제 관리", icon: "💳" },
  { href: "/admin/questions", label: "문제 관리", icon: "📚" },
  { href: "/admin/questions/upload", label: "문제 일괄 업로드", icon: "⬆️" },
  { href: "/admin/free-questions", label: "무료체험 문제 관리", icon: "🎁" },
  { href: "/admin/free-questions/upload", label: "무료체험 일괄 업로드", icon: "🆓" },
  { href: "/admin/reports", label: "오류 신고", icon: "🚩" },
  { href: "/admin/users", label: "회원 관리", icon: "👥" },
  { href: "/admin/stats", label: "통계", icon: "📈" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-beauty-bg">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-primary-pale bg-white p-4 md:block">
          <Link href="/" className="mb-6 flex items-center px-2">
            <Image src="/logo.png" alt="BEAUTYmaster" width={439} height={217} className="h-8 w-auto" />
          </Link>
          <p className="mb-2 px-2 text-xs font-bold uppercase text-beauty-gray">관리자</p>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2 rounded-btn px-3 py-2 text-sm font-semibold text-beauty-neutral hover:bg-primary-pale hover:text-primary"
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-6">
            <button className="w-full rounded-btn px-3 py-2 text-left text-sm font-semibold text-beauty-gray hover:text-primary">
              로그아웃
            </button>
          </form>
        </aside>
        <div className="flex-1 px-4 py-8 md:px-8">
          {/* 모바일 상단 네비 */}
          <nav className="mb-6 flex flex-wrap gap-2 md:hidden">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-beauty-neutral shadow-card"
              >
                {n.icon} {n.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}
