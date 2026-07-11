import ReferrerDatePicker from "@/components/admin/ReferrerDatePicker";
import {
  getReferrerStatsForDate,
  kstDateString,
  parseKstDateString,
} from "@/lib/referrer-analytics";

type Props = {
  searchDate?: string;
};

export default async function ReferrerStatsSection({ searchDate }: Props) {
  const today = kstDateString();
  const selected = parseKstDateString(searchDate) ?? parseKstDateString(today)!;
  const selectedStr = selected.toISOString().slice(0, 10);

  const { total, rows } = await getReferrerStatsForDate(selected);

  return (
    <div className="card mt-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-beauty-neutral">유입 경로 (일별)</h2>
          <p className="mt-1 text-sm text-beauty-gray">
            선택한 날짜에 사이트에 들어온 경로입니다. 도메인만 표시됩니다.
          </p>
        </div>
        <ReferrerDatePicker selectedDate={selectedStr} maxDate={today} />
      </div>

      <div className="mb-4 rounded-btn bg-primary-pale px-4 py-3 text-sm">
        <span className="font-semibold text-beauty-neutral">{selectedStr}</span>
        <span className="text-beauty-gray"> · 총 방문 </span>
        <span className="font-bold text-primary">{total.toLocaleString()}</span>
        <span className="text-beauty-gray">회</span>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-beauty-gray">
          해당 날짜의 유입 데이터가 없습니다. 사이트 방문이 발생하면 자동으로 집계됩니다.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-primary-pale text-beauty-gray">
                <th className="pb-3 pr-4 font-semibold">유입 도메인</th>
                <th className="pb-3 pr-4 font-semibold text-right">방문 수</th>
                <th className="pb-3 font-semibold text-right">비율</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.referrerDomain} className="border-b border-primary-pale/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-beauty-neutral">{row.referrerDomain}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-beauty-neutral">
                    {row.visitCount.toLocaleString()}
                  </td>
                  <td className="py-3 text-right tabular-nums text-beauty-gray">{row.sharePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
