import type { Metadata, Viewport } from "next";
import { Chivo_Mono, Nunito } from "next/font/google";
import "./globals.css";

/* Clay: Nunito (rounded) for words, Chivo Mono for figures, dates and references. */
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const chivo = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fibr.example"),
  title: "fibr: see every dirham move",
  description:
    "Financial visibility for UAE holding groups. fibr pipes every transaction, invoice and receipt from every company's books into one view of the group. Read-only. Live in 4 weeks.",
  openGraph: {
    title: "fibr: see every dirham move",
    description:
      "Every source captured. Every number traceable to its invoice or receipt. Read-only by design. Live in 4 weeks.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef0f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${chivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
