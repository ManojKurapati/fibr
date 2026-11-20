import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CommercialFaq } from "@/components/sections/CommercialFaq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { PilotTimeline } from "@/components/sections/PilotTimeline";
import { ProductTour } from "@/components/sections/ProductTour";
import { RoleSwitcher } from "@/components/sections/RoleSwitcher";
import { SecurityPillars } from "@/components/sections/SecurityPillars";
import { StatusQuo } from "@/components/sections/StatusQuo";
import { WhyNowUAE } from "@/components/sections/WhyNowUAE";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <StatusQuo />
        <ProductTour />
        <RoleSwitcher />
        <WhyNowUAE />
        <SecurityPillars />
        <PilotTimeline />
        <CommercialFaq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
