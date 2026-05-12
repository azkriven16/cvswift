"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bot, Download, FileUp, Crosshair, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SpotlightCard } from "@/components/spotlight-card";

const steps = [
  {
    icon: FileUp,
    label: "Import",
    text: "Upload a PDF or Word resume, or paste it as text. CVSwift reads it in under a second.",
    tags: ["PDF / Word / text", "Parsed instantly", "Auto-structured"],
  },
  {
    icon: ScanLine,
    label: "Audit",
    text: "Get a free AI score across Impact, ATS match, Clarity, and Seniority.",
    tags: ["Impact score", "ATS keywords", "Seniority check"],
  },
  {
    icon: Bot,
    label: "Edit",
    text: "Use the AI copilot to rewrite bullets, sharpen tone, and cut vague language.",
    tags: ["Rewrite bullets", "Adjust tone", "Cut vague claims"],
  },
  {
    icon: Crosshair,
    label: "Tailor",
    text: "Paste a job posting. Get a version of your resume matched to that role.",
    tags: ["Paste job post", "Keyword match", "Role-specific version"],
  },
  {
    icon: Download,
    label: "Export",
    text: "Download an ATS-ready PDF. Share a public link. Keep every version.",
    tags: ["ATS PDF", "Public link", "Multiple versions"],
  },
];

export function Workflow() {
  const [active, setActive] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [inView, timerKey]);

  const goTo = (i: number) => {
    setActive(i);
    setTimerKey((k) => k + 1);
    const item = ref.current?.children[i] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <section className="section workflow-section" id="workflow">
      <div className="section-heading">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Workflow
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          A product system that shows the work moving.
        </motion.h2>
      </div>

      <div className="workflow-rail" ref={ref}>
        {steps.map(({ icon: Icon, label, text, tags }, index) => {
          const isActive = active === index;
          return (
            <motion.div
              key={label}
              className="workflow-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                as="article"
                className={`workflow-card${isActive ? " workflow-card-active" : ""}`}
                spotlightColor={
                  isActive
                    ? "rgba(16, 185, 129, 0.16)"
                    : "rgba(16, 185, 129, 0.07)"
                }
                onClick={() => goTo(index)}
              >
                <span className="step-index">0{index + 1}</span>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <h3>{label}</h3>
                <p>{text}</p>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="step-tags"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="step-tags-inner">
                        {tags.map((tag, ti) => (
                          <motion.span
                            key={tag}
                            className="step-tag"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: ti * 0.07, duration: 0.22 }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>

      {/* Step progress dots */}
      <div className="workflow-dots">
        {steps.map((s, i) => (
          <button
            key={s.label}
            type="button"
            className={`workflow-dot${active === i ? " workflow-dot-active" : ""}`}
            aria-label={`Go to step: ${s.label}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
