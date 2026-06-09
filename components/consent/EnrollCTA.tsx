"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConsentModal from "@/components/ConsentModal";
import { recordConsentAction } from "@/app/actions/consent";

export default function EnrollCTA({
  slug,
  examCategory,
  className = "btn-primary w-full",
  label = "수강신청",
}: {
  slug: string;
  examCategory?: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAgree = async () => {
    setSubmitting(true);
    try {
      await recordConsentAction("paid", examCategory);
    } catch {
      // 비로그인 등으로 기록이 실패해도 신청 흐름은 진행 (로그인 페이지로 유도됨)
    }
    setSubmitting(false);
    setOpen(false);
    // 결제(수강신청) 페이지로 이동
    router.push(`/enroll/${slug}`);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open && (
        <ConsentModal
          mode="paid"
          submitting={submitting}
          onAgree={handleAgree}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
