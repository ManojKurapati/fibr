import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Close } from "@/components/sections/Close";
import { Hero } from "@/components/sections/Hero";
import { Product } from "@/components/sections/Product";
import { Rollout } from "@/components/sections/Rollout";
import { Sources } from "@/components/sections/Sources";
import { UaeRules } from "@/components/sections/UaeRules";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BeforeAfter />
        <Product />
        <Sources />
        <UaeRules />
        <Rollout />
        <Close />
      </main>
      <SiteFooter />
    </>
  );
}
