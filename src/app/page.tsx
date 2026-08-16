import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Portals } from "@/components/marketing/portals";
import { Cta } from "@/components/marketing/cta";
import { MarketingFooter } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Portals />
        <Cta />
      </main>
      <MarketingFooter />
    </div>
  );
}
