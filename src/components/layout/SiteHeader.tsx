"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CtaButton, PRIMARY_CTA } from "../ui/CtaButton";
import { Wordmark } from "../ui/Wordmark";

const NAV = [
  { href: "#pipeline", label: "Pipeline" },
  { href: "#tour", label: "Product" },
  { href: "#roles", label: "Who it's for" },
  { href: "#uae", label: "Why now" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-canvas/85 shadow-[0_1px_0_var(--hairline)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-canvas/0"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <a href="#top" aria-label="fibr home" className="shrink-0">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-[0.875rem] font-medium text-ink-muted transition-colors hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <CtaButton size="sm" arrow={false}>
              {PRIMARY_CTA}
            </CtaButton>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-hairline-strong lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-canvas px-4 pb-10 pt-4 sm:px-6 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="display border-b border-hairline py-4 text-[2.25rem] text-ink"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-8" onClick={() => setOpen(false)}>
            <CtaButton className="w-full" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
