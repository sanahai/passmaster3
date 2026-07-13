"use client";

import { usePathname } from "next/navigation";
import LandingFooter from "@/components/landing/LandingFooter";

/** 학원 서브사이트는 자체 푸터 사용 */
const HIDE_PREFIXES = ["/a/"];

export default function SiteFooter() {
  const pathname = usePathname() ?? "";
  if (HIDE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <div className="site-footer-shell">
      <LandingFooter />
    </div>
  );
}
