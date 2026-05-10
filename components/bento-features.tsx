import { Activity, Braces, Gauge, MessageSquareText, ScanLine } from "lucide-react";

export function BentoFeatures() {
  return (
    <section className="section" id="features">
      <div className="section-heading">
        <p className="eyebrow">Product depth</p>
        <h2>Every claim is backed by an interface.</h2>
      </div>
      <div className="bento-grid">
        <article className="bento-card bento-wide">
          <div className="mini-roadmap" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <h3>Roadmaps with live confidence</h3>
          <p>Project health changes as code, blockers, agent output, and customer signals move underneath it.</p>
        </article>
        <article className="bento-card">
          <Gauge size={22} />
          <h3>Operating metrics</h3>
          <p>Velocity, cycle risk, and review load stay visible without building another dashboard.</p>
        </article>
        <article className="bento-card bento-dark">
          <Braces size={22} />
          <pre>{`orbit.workflow("beta")
  .route("risk")
  .ship("friday")`}</pre>
          <h3>Developer-native automation</h3>
        </article>
        <article className="bento-card bento-tall">
          <ScanLine size={22} />
          <div className="scan-card" aria-hidden="true">
            <span /><span /><span />
          </div>
          <h3>Readable on mobile</h3>
          <p>The dense desktop surface compresses into focused cards, not microscopic screenshots.</p>
        </article>
        <article className="bento-card">
          <MessageSquareText size={22} />
          <h3>Contextual asks</h3>
          <p>Slack threads, customer requests, and docs become scoped issues with suggested owners.</p>
        </article>
        <article className="bento-card bento-wide accent-card">
          <Activity size={22} />
          <h3>Motion is the demo</h3>
          <p>Animations explain state changes: work enters, agents act, risk drops, and the release becomes clearer.</p>
        </article>
      </div>
    </section>
  );
}
