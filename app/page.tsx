import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { BentoFeatures } from "@/components/bento-features";
import { Workflow } from "@/components/workflow";
import { Proof } from "@/components/proof";
import { Pricing } from "@/components/pricing";
import { CommandPalette } from "@/components/command-palette";
import { ResumeDashboard } from "@/components/resume-dashboard";
import { IntegrationStack } from "@/components/integration-stack";

export default function Home() {
  return (
    <>
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
      <CommandPalette />
    </>
  );
}
