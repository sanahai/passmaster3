"use client";

export default function TimerGauge({
  seconds,
  total,
}: {
  seconds: number;
  total: number;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? seconds / total : 0;
  const offset = circumference * (1 - ratio);
  const danger = seconds <= 10;
  const color = danger ? "#C62828" : "#236BFF";

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#E8F1FF" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-lg font-extrabold ${
          danger ? "text-beauty-danger" : "text-primary"
        }`}
      >
        {seconds}
      </span>
    </div>
  );
}
