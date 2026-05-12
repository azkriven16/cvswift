"use client";

import { Bot, Check, FileText, ShieldCheck, ScanLine } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FREE_RESUME_LIMIT } from "@/lib/config";
import { mockAudit, mockResumes, mockUser } from "@/lib/mock-data";
import { getUsageCopy } from "@/lib/services/rate-limit";
import { NumberTicker } from "@/components/number-ticker";
import { BorderBeam } from "@/components/border-beam";

const aiFeatures = [
  "AI resume audit",
  "Copilot editing",
  "Job tailoring",
  "Cover letter",
];

export function ResumeDashboard() {
  const usage = getUsageCopy(mockUser.plan, mockUser.resumeCount, mockUser.auditsUsedToday);
  const auditRef = useRef<HTMLElement>(null);
  const auditInView = useInView(auditRef, { once: true, margin: "-60px" });

  return (
    <section className="section dashboard-section" id="dashboard">
      <div className="section-heading">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Workspace preview
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          A resume builder with limits you can trust.
        </motion.h2>
      </div>
      <div className="dashboard-grid">

        {/* ── Main panel ── */}
        <div className="dashboard-panel dashboard-main">
          <BorderBeam duration={6} />
          <div className="dashboard-head">
            <div>
              <span>Free workspace</span>
              <h3>{usage.resumes}</h3>
            </div>
            <a className="button button-secondary" href="/login">
              Open app
            </a>
          </div>
          <div className="resume-list">
            {mockResumes.map((resume, i) => (
              <motion.article
                key={resume.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.09, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                <FileText size={18} />
                <div>
                  <strong>{resume.title}</strong>
                  <span>{resume.targetRole} · {resume.template} · {resume.updatedAt}</span>
                </div>
                <em><NumberTicker value={resume.score} /></em>
              </motion.article>
            ))}
          </div>
          <div className="limit-note">
            <ShieldCheck size={16} />
            All features free. No credit card required.
          </div>
        </div>

        {/* ── Audit panel ── */}
        <aside className="dashboard-panel audit-panel" ref={auditRef}>
          <span className="panel-kicker">{usage.audits}</span>
          <strong><NumberTicker value={mockAudit.score} /></strong>
          <p>{mockAudit.summary}</p>
          <div className="audit-bars">
            {mockAudit.categories.map((category, i) => (
              <div key={category.label}>
                <span>{category.label}</span>
                <div>
                  <motion.i
                    style={{ width: 0 }}
                    animate={auditInView ? { width: `${category.score}%` } : { width: 0 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.2 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── AI features panel ── */}
        <aside className="dashboard-panel ai-panel">
          <Bot size={20} />
          <h3>AI included free</h3>
          <p>Every AI feature is available without a credit card or plan upgrade.</p>
          <div className="ai-feature-list">
            {aiFeatures.map((f) => (
              <span key={f}>
                <Check size={13} />
                {f}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
