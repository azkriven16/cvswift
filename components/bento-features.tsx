"use client";

import { CheckCircle2, FileDown, Gauge, MessageSquareText, FileText } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SpotlightCard } from "@/components/spotlight-card";

const auditBars = [
  { label: "Impact",    score: 82 },
  { label: "ATS Match", score: 89 },
  { label: "Clarity",   score: 91 },
  { label: "Seniority", score: 78 },
];

const card = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function BentoFeatures() {
  const auditRef = useRef<HTMLDivElement>(null);
  const auditInView = useInView(auditRef, { once: true, margin: "-60px" });

  return (
    <section className="section" id="features">
      <div className="section-heading">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Product depth
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Every claim is backed by an interface.
        </motion.h2>
      </div>

      <div className="bento-grid">
        {/* AI audit — wide */}
        <motion.div className="bento-wide" {...card(0)}>
          <SpotlightCard className="bento-card" spotlightColor="rgba(16, 185, 129, 0.1)">
            <div className="mini-audit" aria-hidden="true" ref={auditRef}>
              {auditBars.map((bar, i) => (
                <div key={bar.label}>
                  <span>{bar.label}</span>
                  <motion.i
                    style={{ width: 0 }}
                    animate={auditInView ? { width: `${bar.score}%` } : { width: 0 }}
                    transition={{ duration: 0.85, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </div>
            <h3>AI audit in seconds</h3>
            <p>Score your resume across Impact, ATS match, Clarity, and Seniority. Two free AI requests every day.</p>
          </SpotlightCard>
        </motion.div>

        {/* AI copilot */}
        <motion.div {...card(0.08)}>
          <SpotlightCard className="bento-card" spotlightColor="rgba(16, 185, 129, 0.1)">
            <MessageSquareText size={22} />
            <h3>AI copilot</h3>
            <p>Chat with your resume. Tell the AI what to fix and watch changes apply in real time.</p>
          </SpotlightCard>
        </motion.div>

        {/* Terminal — dark */}
        <motion.div {...card(0.14)}>
          <SpotlightCard className="bento-card bento-dark" spotlightColor="rgba(255, 255, 255, 0.06)">
            <Gauge size={22} />
            <pre>{`> Rewrite bullets with impact\n✓ Rewrote 3 bullets\n> Tighten the summary\n✓ 42 words → 28`}</pre>
            <h3>Measurable improvements</h3>
          </SpotlightCard>
        </motion.div>

        {/* Templates — tall */}
        <motion.div className="bento-tall" {...card(0.07)}>
          <SpotlightCard className="bento-card" spotlightColor="rgba(16, 185, 129, 0.1)">
            <FileText size={22} />
            <div className="template-stack" aria-hidden="true">
              <span>ATS Clean</span>
              <span>Harvard</span>
              <span>Executive</span>
              <span>Sidebar</span>
            </div>
            <h3>Professional templates</h3>
            <p>ATS Clean layout available now. Harvard, Executive, and Sidebar templates coming soon.</p>
          </SpotlightCard>
        </motion.div>

        {/* Job tailoring */}
        <motion.div {...card(0.14)}>
          <SpotlightCard className="bento-card" spotlightColor="rgba(16, 185, 129, 0.1)">
            <CheckCircle2 size={22} />
            <h3>Job-specific tailoring</h3>
            <p>Paste a job posting and get a version of your resume matched to that role.</p>
          </SpotlightCard>
        </motion.div>

        {/* ATS PDF — wide accent */}
        <motion.div className="bento-wide" {...card(0.21)}>
          <SpotlightCard className="bento-card accent-card" spotlightColor="rgba(255, 255, 255, 0.12)">
            <FileDown size={22} />
            <h3>ATS PDF export and public link</h3>
            <p>Download a clean ATS-ready PDF or share a public resume link — no login required to view.</p>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
