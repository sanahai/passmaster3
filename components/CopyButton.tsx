"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  className = "",
  label = "복사",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 미지원 환경 무시
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={className || "rounded-btn bg-white/20 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/30"}
    >
      {copied ? "✓ 복사됨" : `📋 ${label}`}
    </button>
  );
}
