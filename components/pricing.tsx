import { Check } from "lucide-react";

const freeItems = ["5 resumes", "2 free audits daily", "Basic templates", "PDF export"];
const selfHostItems = ["Use your own Supabase project", "Bring your own OpenRouter key", "Fork and customize", "No CVSwift account required"];

export function Pricing() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="section-heading">
        <p className="eyebrow">Free and open source</p>
        <h2>Hosted demo stays free. Self-hosting stays yours.</h2>
      </div>
      <div className="pricing-grid">
        <article className="pricing-card">
          <div>
            <span>Free</span>
            <strong>$0</strong>
            <p>for the hosted portfolio app</p>
          </div>
          <ul>
            {freeItems.map((item) => (
              <li key={item}><Check size={17} /> {item}</li>
            ))}
          </ul>
          <a className="button button-secondary button-large" href="/login">
            Start free
          </a>
        </article>
        <article className="pricing-card pricing-card-pro">
          <div>
            <span>Self-host</span>
            <strong>$0</strong>
            <p>use your own free-tier services</p>
          </div>
          <ul>
            {selfHostItems.map((item) => (
              <li key={item}><Check size={17} /> {item}</li>
            ))}
          </ul>
          <a className="button button-primary button-large" href="#stack">
            View stack
          </a>
        </article>
      </div>
    </section>
  );
}
