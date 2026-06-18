"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type WeeklyPoint = { week: string; answers: number; active: number };
type AccuracyBucket = { range: string; count: number };

export default function AnalyticsCharts({
  weekly,
  accuracyBuckets,
}: {
  weekly: WeeklyPoint[];
  accuracyBuckets: AccuracyBucket[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="b2b-card">
        <h2 className="mb-4 font-bold text-b2b-primary">주간 학습 활동</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="answers" name="풀이 수" stroke="#E91E8C" strokeWidth={2} />
              <Line type="monotone" dataKey="active" name="활성 학생" stroke="#14B8A6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="b2b-card">
        <h2 className="mb-4 font-bold text-b2b-primary">정답률 분포</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accuracyBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="학생 수" fill="#0F172A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
