"use client";

import { Search } from "lucide-react";
import { openDemo } from "@/lib/openDemo";
import { Button } from "../ui/Button";
import { Wordmark } from "../ui/Wordmark";

const QUESTION = "Who owes us more than 90 days?";

/** Search-led bar: the wordmark, a visible Ask fibr pill that runs a real question, and the one action. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[var(--z-sticky-nav)] pt-[var(--space-sm)]">
      <div className="container">
        <div className="clay flex h-16 items-center justify-between gap-[var(--space-lg)] rounded-full pl-[var(--space-lg)] pr-[var(--space-xs)]">
        <a href="#top" aria-label="fibr, back to the top" className="shrink-0">
          <Wordmark />
        </a>
        <button
          type="button"
          onClick={() => openDemo({ moment: "ask", preset: "ar-90" })}
          className="clay-pressed hidden h-11 min-w-0 max-w-[30rem] flex-1 items-center gap-[var(--space-sm)] rounded-full px-[var(--space-md)] text-left text-sm font-medium lg:flex"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="truncate text-muted">Ask fibr:</span>
          <span className="truncate pr-[var(--space-xs)]">{QUESTION}</span>
        </button>
        <nav aria-label="Primary" className="hidden items-center gap-[var(--space-lg)] text-sm font-medium xl:flex">
          <a href="#product" className="underline-offset-4 hover:text-accent hover:underline">
            Product
          </a>
          <a href="#sources" className="underline-offset-4 hover:text-accent hover:underline">
            Security
          </a>
          <a href="#rollout" className="underline-offset-4 hover:text-accent hover:underline">
            Rollout
          </a>
        </nav>
        <Button className="max-sm:hidden" />
        </div>
      </div>
    </header>
  );
}
