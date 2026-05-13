import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { BentoFeatures } from "@/components/bento-features";
import { Workflow } from "@/components/workflow";
import { Proof } from "@/components/proof";
import { Pricing } from "@/components/pricing";
import { CommandPalette } from "@/components/command-palette";
import { ResumeDashboard } from "@/components/resume-dashboard";
import { IntegrationStack } from "@/components/integration-stack";
import { Footer } from "@/components/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CVSwift",
  url: "https://cv-swift.vercel.app",
  description:
    "Free, open-source AI resume builder. Get instant AI audits, job-specific tailoring, and ATS-ready PDF export. No credit card required.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Proof />
        <ResumeDashboard />
        <Workflow />
        <BentoFeatures />
        <IntegrationStack />
        <Pricing />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
