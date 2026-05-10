import { ArrowUpRight, Bot, FileText, Gauge, Terminal } from "lucide-react";
import { ProductDemo } from "@/components/product-demo";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Open-source AI resume workspace</p>
        <h1>Build resumes that survive the first screen.</h1>
        <p className="hero-lede">
          CVSwift gives job seekers a polished resume builder, two free daily audits, and a $5 Pro tier for AI rewrites
          and job-specific tailoring.
        </p>
        <div className="hero-actions">
          <a className="button button-primary button-large" href="/login">
            Start free
            <ArrowUpRight size={17} />
          </a>
          <button className="button button-secondary button-large command-open" type="button">
            <Terminal size={17} />
            Open AI command
          </button>
        </div>
        <div className="signal-row" aria-label="Product signals">
          <span>
            <FileText size={15} /> 5 free resumes
          </span>
          <span>
            <Gauge size={15} /> 2 audits daily
          </span>
          <span>
            <Bot size={15} /> Pro AI for $5/mo
          </span>
        </div>
      </div>

      <ProductDemo />
    </section>
  );
}
