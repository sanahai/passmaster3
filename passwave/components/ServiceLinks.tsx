import { SERVICES, COLOR_STYLES } from "@/lib/services";
import ServiceButton from "@/components/ServiceButton";

type Props = {
  id?: string;
  showHeading?: boolean;
};

export default function ServiceLinks({ id, showHeading = false }: Props) {
  return (
    <section id={id} className={`px-4 ${showHeading ? "bg-white py-20 md:py-28" : ""}`}>
      <div className="mx-auto max-w-6xl">
        {showHeading && (
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-4xl">AI 문제은행 서비스</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
              준비 중인 자격증에 맞는 서비스를 선택하세요.
            </p>
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {SERVICES.map((s) => {
            const c = COLOR_STYLES[s.color];
            return (
              <article
                key={s.id}
                className={`flex flex-col items-center text-center ${showHeading ? `rounded-3xl border bg-white p-8 shadow-card ${c.border}` : ""}`}
              >
                {showHeading && (
                  <div className={`mb-6 h-1.5 w-16 rounded-full bg-gradient-to-r ${c.gradient}`} />
                )}
                <ServiceButton service={s} size="xl" className="w-full max-w-md" />
                <h3 className="mt-6 text-xl font-extrabold text-slate-900 md:text-2xl">{s.name}</h3>
                <span
                  className={`mt-3 inline-flex rounded-full px-4 py-1.5 text-sm font-bold md:text-base ${c.badge}`}
                >
                  {s.certs}
                </span>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600 md:text-lg">{s.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
