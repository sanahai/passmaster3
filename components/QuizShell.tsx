import Link from "next/link";
import PassmasterLogo from "@/components/PassmasterLogo";

export default function QuizShell({
  exitHref,
  children,
}: {
  exitHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#ebf0fa] bg-white/[0.94] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <PassmasterLogo className="h-7 w-auto" />
          </Link>
          <Link
            href={exitHref}
            className="rounded-btn px-3 py-1.5 text-sm font-semibold text-beauty-gray hover:text-primary"
          >
            ✕ 나가기
          </Link>
        </div>
      </header>
      <main className="px-4 py-8">{children}</main>
    </div>
  );
}
