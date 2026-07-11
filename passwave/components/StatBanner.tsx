export default function StatBanner() {
  return (
    <section className="border-y border-orange-100 bg-brand px-4 py-12">
      <p className="text-center text-base font-semibold text-white sm:text-lg md:text-xl">
        총 <span className="font-extrabold text-orange-100">20,000+</span> 문항 ·{" "}
        <span className="font-extrabold text-orange-100">20개 이상</span>의 자격증 · 누적 학습자{" "}
        <span className="font-extrabold text-orange-100">10,000+</span>명
      </p>
    </section>
  );
}
