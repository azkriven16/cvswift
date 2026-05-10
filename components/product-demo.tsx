"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, CheckCircle2, CircleDot, GitBranch, Inbox, Radio, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const stages = [
  {
    label: "Draft",
    icon: Inbox,
    title: "Resume draft imported",
    detail: "CVSwift finds weak bullets, missing metrics, and role mismatch.",
    velocity: "81%",
    risk: "62",
    agents: "3",
    cards: [
      { id: "EXP-01", title: "Built reusable React components for dashboards", tag: "Weak", state: "Needs metric" },
      { id: "ATS-04", title: "Missing Next.js and accessibility keywords", tag: "ATS", state: "Flagged" },
      { id: "SUM-02", title: "Summary reads too junior for target role", tag: "Tone", state: "Open" },
    ],
    terminal: ["parsed 1 resume draft", "found 8 improvement areas", "audit score set to 62"],
  },
  {
    label: "Audit",
    icon: Bot,
    title: "Free audit generated",
    detail: "Two daily audits are included before Pro unlocks higher limits.",
    velocity: "88%",
    risk: "78",
    agents: "1/2",
    cards: [
      { id: "AUD-18", title: "Impact score is below senior frontend benchmark", tag: "Impact", state: "82" },
      { id: "ATS-11", title: "React, TypeScript, and performance keywords matched", tag: "ATS", state: "89" },
      { id: "CLR-07", title: "Section hierarchy is readable for recruiters", tag: "Clarity", state: "91" },
    ],
    terminal: ["ran free audit 1 of 2", "scored 4 categories", "saved audit history"],
  },
  {
    label: "AI Rewrite",
    icon: GitBranch,
    title: "Pro rewrite preview",
    detail: "AI rewrite and job tailoring are gated behind the $5 Pro tier.",
    velocity: "94%",
    risk: "86",
    agents: "$5",
    cards: [
      { id: "AI-21", title: "Improved onboarding conversion 18% by rebuilding React flow", tag: "Rewrite", state: "Pro" },
      { id: "JOB-08", title: "Tailor resume against pasted Senior Frontend role", tag: "JD", state: "Locked" },
      { id: "VER-05", title: "Create version for design engineering applications", tag: "Version", state: "Pro" },
    ],
    terminal: ["mocked OpenAI rewrite", "checked subscription entitlement", "upgrade CTA prepared"],
  },
  {
    label: "Export",
    icon: Rocket,
    title: "Resume ready to export",
    detail: "Free users export basic PDFs; Pro gets premium templates and more versions.",
    velocity: "97%",
    risk: "91",
    agents: "5/5",
    cards: [
      { id: "PDF-10", title: "Export clean ATS-readable PDF", tag: "PDF", state: "Ready" },
      { id: "LIM-05", title: "Resume limit reached on free plan", tag: "Limit", state: "Upgrade" },
      { id: "TMP-12", title: "Premium template unlocked with Pro", tag: "Template", state: "$5" },
    ],
    terminal: ["rendered resume preview", "checked 5 resume limit", "export ready"],
  },
];

export function ProductDemo() {
  const [activeStage, setActiveStage] = useState(0);
  const reduceMotion = useReducedMotion();
  const stage = stages[activeStage];
  const StageIcon = stage.icon;

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % stages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <motion.div
      className="product-stage"
      initial={{ opacity: 0, y: 30, rotateX: 6, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 4, rotateY: -7 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      id="product"
    >
      <div className="product-shell">
        <aside className="product-sidebar">
          <div className="traffic"><span /><span /><span /></div>
          <div className="workspace">
            <span>O</span>
            <div>
              <strong>CVSwift</strong>
              <small>Free workspace</small>
            </div>
          </div>
          {["Builder", "Audits", "Templates", "AI", "Billing"].map((item, index) => (
            <button className={index === 0 ? "side-link side-link-active" : "side-link"} key={item} type="button">
              <CircleDot size={13} />
              {item}
            </button>
          ))}
        </aside>

        <section className="product-main">
          <div className="product-toolbar">
            <div>
              <span>{stage.title}</span>
              <h2>Senior Frontend Resume</h2>
            </div>
            <button className="command-chip command-open" type="button">
              Ask CVSwift <kbd>⌘K</kbd>
            </button>
          </div>

          <div className="stage-rail" aria-label="Animated product workflow">
            {stages.map(({ label, icon: Icon }, index) => (
              <button
                className={index === activeStage ? "stage-step stage-step-active" : "stage-step"}
                key={label}
                type="button"
                onClick={() => setActiveStage(index)}
              >
                <span><Icon size={14} /></span>
                {label}
              </button>
            ))}
          </div>

          <div className="metrics">
            <article><span>Match</span><strong>{stage.velocity}</strong><small>target role fit</small></article>
            <article><span>Score</span><strong>{stage.risk}</strong><small>{stage.detail}</small></article>
            <article><span>Usage</span><strong>{stage.agents}</strong><small>free/pro limit signal</small></article>
          </div>

          <div className="work-surface">
            <AnimatePresence mode="popLayout">
              <motion.div
                className="issue-stack"
                key={stage.label}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                {stage.cards.map((card, index) => (
                  <motion.article
                    className="issue-card"
                    key={card.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.32 }}
                  >
                    <small>{card.id}</small>
                    <strong>{card.title}</strong>
                    <div><span>{card.tag}</span><em>{card.state}</em></div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="agent-panel">
              <div className="agent-head">
                <span><StageIcon size={16} /></span>
                <div>
                  <strong>{stage.title}</strong>
                  <small>{stage.detail}</small>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  className="terminal-lines"
                  key={`${stage.label}-terminal`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24 }}
                >
                  {stage.terminal.map((line, index) => (
                    <motion.span
                      key={line}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {index === 0 && <GitBranch size={13} />}
                      {index === 1 && <Sparkles size={13} />}
                      {index === 2 && <CheckCircle2 size={13} />}
                      {line}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
              <div className="pulse-line"><Radio size={14} /> {stage.label} pulse synced just now</div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
