"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ConsentModal from "@/components/ConsentModal";
import { recordConsentAction } from "@/app/actions/consent";

export default function TrialConsentGate({
  needsConsent,
  children,
}: {
  needsConsent: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(!needsConsent);
  const [submitting, setSubmitting] = useState(false);

  if (agreed) return <>{children}</>;

  const handleAgree = async () => {
    setSubmitting(true);
    try {
      await recordConsentAction("trial");
    } catch {
      // 기록 실패해도 학습 진행은 막지 않음 (네트워크 오류 등)
    }
    setSubmitting(false);
    setAgreed(true);
  };

  return (
    <ConsentModal
      mode="trial"
      submitting={submitting}
      onAgree={handleAgree}
      onCancel={() => router.push("/dashboard")}
    />
  );
}
