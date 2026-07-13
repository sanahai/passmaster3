import "./landing.css";
import { getSession } from "@/lib/auth";
import LandingHeader from "@/components/landing/LandingHeader";
import HomeLanding from "@/components/landing/HomeLanding";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <div className="floating left" />
      <div className="floating right" />
      <div className="container">
        <main className="landing">
          <LandingHeader />
          <HomeLanding isLoggedIn={!!session} />
        </main>
      </div>
    </>
  );
}