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
  title: {
    default: "CVSwift — Free AI Resume Builder",
    template: "%s — CVSwift",
  },
  description:
    "Free, open-source AI resume builder. Get instant AI audits, job-specific tailoring, and ATS-ready PDF export. No credit card required.",
  metadataBase: new URL("https://cv-swift.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "CVSwift",
    title: "CVSwift — Free AI Resume Builder",
    description:
      "Free, open-source AI resume builder. Get instant AI audits, job-specific tailoring, and ATS-ready PDF export. No credit card required.",
    url: "https://cv-swift.vercel.app",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CVSwift — Free AI Resume Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVSwift — Free AI Resume Builder",
    description:
      "Free, open-source AI resume builder. Get instant AI audits, job-specific tailoring, and ATS-ready PDF export. No credit card required.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
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
