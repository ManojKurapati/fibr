import type { MomentId } from "@/data/content";

export interface OpenDemoDetail {
  moment: MomentId;
  preset?: string;
}

/** Asks the product switcher to show a moment (and optionally run an Ask fibr preset). */
export function openDemo(detail: OpenDemoDetail) {
  window.dispatchEvent(new CustomEvent<OpenDemoDetail>("fibr:open", { detail }));
  document.getElementById("product")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
