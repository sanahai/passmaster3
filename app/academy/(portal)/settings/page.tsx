import { requireAcademyOwner } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import { updateAcademySettingsAction } from "@/app/actions/academy";
import UpgradeBanner from "@/components/academy/UpgradeBanner";

export default async function AcademySettingsPage() {
  const ctx = await requireAcademyOwner();
  if (!tierAtLeast(ctx.academy.tier, "standard")) return <UpgradeBanner />;

  const { academy } = ctx;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-b2b-primary">학원 설정</h1>
      <form action={updateAcademySettingsAction} className="max-w-lg space-y-4 b2b-card">
        <div>
          <label className="mb-1 block text-sm font-semibold">학원명</label>
          <input
            name="name"
            defaultValue={academy.name}
            className="w-full rounded-lg border border-b2b-border px-4 py-2.5 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">로고 URL</label>
          <input
            name="logoUrl"
            defaultValue={academy.logoUrl ?? ""}
            placeholder="https://..."
            className="w-full rounded-lg border border-b2b-border px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">브랜드 컬러</label>
          <input
            name="primaryColor"
            type="color"
            defaultValue={academy.primaryColor}
            className="h-10 w-full rounded-lg border border-b2b-border"
          />
        </div>
        <div className="rounded-lg bg-b2b-section p-3 text-sm text-slate-600">
          <p>플랜: {academy.tier.toUpperCase()}</p>
          <p>학생 정원: {academy.maxStudents}명</p>
          <p>이용 기간: ~{academy.activeUntil.toLocaleDateString("ko-KR")}</p>
          {academy.subdomain && <p>화이트레이블: /a/{academy.subdomain}</p>}
        </div>
        <button type="submit" className="b2b-btn-accent w-full">
          저장
        </button>
      </form>
    </div>
  );
}
