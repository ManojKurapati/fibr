import type { ReactNode } from "react";

/**
 * Landscape iPad Pro: anodised space-black aluminium rim, glass bezel, landscape front camera,
 * top-edge buttons, screen glare and a layered contact shadow. The screen is a CSS
 * container-query host so the app inside adapts to the device size, not the viewport.
 */
export function IpadFrame({ children, className = "", tone = "light" }: { children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  return (
    <div className={`relative isolate ${className}`}>
      {/* Contact + ambient shadow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-[6%] -bottom-6 -z-10 h-24 rounded-[50%] blur-2xl ${tone === "dark" ? "bg-black/70" : "bg-[#0b1221]/25"}`}
      />
      {/* Top-edge buttons (landscape: volume + top button sit on the long top edge) */}
      <div aria-hidden className="absolute -top-[2px] right-[13%] hidden h-[4px] w-[5.5%] rounded-t-[3px] bg-gradient-to-b from-[#6a6e75] to-[#2b2d31] sm:block" />
      <div aria-hidden className="absolute -top-[2px] right-[20%] hidden h-[4px] w-[5.5%] rounded-t-[3px] bg-gradient-to-b from-[#6a6e75] to-[#2b2d31] sm:block" />
      <div aria-hidden className="absolute -top-[2px] left-[9%] hidden h-[4px] w-[4%] rounded-t-[3px] bg-gradient-to-b from-[#6a6e75] to-[#2b2d31] sm:block" />

      {/* Aluminium rim */}
      <div
        className={`rounded-[26px] bg-[linear-gradient(150deg,#6b6f76_0%,#2f3136_18%,#1a1b1f_52%,#3a3c41_82%,#5d6168_100%)] p-[2px] sm:rounded-[44px] sm:p-[3px] ${
          tone === "dark"
            ? "shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]"
            : "shadow-[0_2px_2px_rgba(11,18,33,0.06),0_24px_48px_-18px_rgba(11,18,33,0.35),0_60px_120px_-40px_rgba(11,18,33,0.35)]"
        }`}
      >
        {/* Glass bezel */}
        <div className="relative rounded-[24px] bg-[#070708] p-[7px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:rounded-[41px] sm:p-[15px]">
          {/* Landscape front camera */}
          <div aria-hidden className="absolute left-1/2 top-[2px] hidden size-[6px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#3a4a5c,#0d1218_70%)] ring-1 ring-white/5 sm:top-[5px] sm:block" />
          {/* Screen */}
          <div className="@container relative overflow-hidden rounded-[18px] bg-app sm:rounded-[27px]">
            {children}
            {/* Glass glare */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[60] bg-[linear-gradient(118deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_22%,rgba(255,255,255,0)_38%)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
