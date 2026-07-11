import Hero from "@/components/Hero";
import Features from "@/components/Features";
import StatBanner from "@/components/StatBanner";
import ServiceLinks from "@/components/ServiceLinks";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <StatBanner />
        <ServiceLinks id="services" showHeading />
      </main>
      <Footer />
    </>
  );
}
