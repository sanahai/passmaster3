import "./landing.css";
import LandingHeader from "@/components/landing/LandingHeader";
import HomeLanding from "@/components/landing/HomeLanding";

export default function Home() {
  return (
    <>
      <div className="floating left" />
      <div className="floating right" />
      <div className="container">
        <main className="landing">
          <LandingHeader />
          <HomeLanding />
        </main>
      </div>
    </>
  );
}
