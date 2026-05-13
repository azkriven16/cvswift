import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk, EB_Garamond, DM_Sans, Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "CVSwift - Open-source AI resume builder",
  description:
    "Open-source resume builder with free audits, Supabase auth, Stripe Pro billing, and mock-ready AI services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    geist.variable,
    spaceGrotesk.variable,
    jetBrainsMono.variable,
    ebGaramond.variable,
    dmSans.variable,
    playfairDisplay.variable,
    raleway.variable,
  ].join(" ");

  return (
    <html lang="en">
      <body className={fontVars}>{children}</body>
    </html>
  );
}
