import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Calculator } from "@/components/marketing/calculator";
import { Cta } from "@/components/marketing/cta";
import { MarketingFooter } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Calculator />
        <Cta />
      </main>
      <MarketingFooter />
    </div>
  );
}
