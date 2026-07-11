"use client";

import { useRouter } from "next/navigation";

type Props = {
  selectedDate: string;
  maxDate: string;
};

export default function ReferrerDatePicker({ selectedDate, maxDate }: Props) {
  const router = useRouter();

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const d = String(fd.get("refDate") || selectedDate);
        router.push(`/admin/stats?refDate=${d}`);
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-beauty-neutral">조회 날짜</span>
        <input
          type="date"
          name="refDate"
          defaultValue={selectedDate}
          max={maxDate}
          className="rounded-btn border border-primary-pale px-3 py-2 text-sm text-beauty-neutral"
        />
      </label>
      <button type="submit" className="btn-primary px-4 py-2 text-sm">
        조회
      </button>
    </form>
  );
}
