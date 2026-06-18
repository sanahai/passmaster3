"use client";

type Stat = { label: string; value: string | number; color?: string };

export default function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="b2b-card p-5">
          <p className="mb-1 text-xs text-slate-500">{s.label}</p>
          <p className="text-3xl font-bold" style={{ color: s.color || "#0F172A" }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
