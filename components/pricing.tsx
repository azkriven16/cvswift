"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/spotlight-card";
import { BorderBeam } from "@/components/border-beam";

const freeItems = [
  "Up to 5 resumes",
  "2 AI requests per day",
  "ATS Clean template",
  "PDF export",
  "AI tailoring + cover letter",
];

const selfHostItems = [
  "Unlimited resumes + AI requests",
  "Deploy to Vercel in one click",
  "Your own Supabase + OpenRouter keys",
  "No CVSwift account required",
];

export function Pricing() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="section-heading">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Free and open source
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Hosted demo stays free. Self-hosting stays yours.
        </motion.h2>
      </div>

      <div className="pricing-grid">
        {/* Free card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%" }}
        >
          <SpotlightCard as="article" className="pricing-card">
            <div>
              <span>Hosted</span>
              <strong className="pricing-free-label">Free forever</strong>
              <p>No credit card. No trial. Just a few fair limits to keep the service running.</p>
            </div>
            <ul>
              {freeItems.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Check size={17} />
                  {item}
                </motion.li>
              ))}
            </ul>
            <a className="button button-secondary button-large" href="/login">
              Start free
            </a>
          </SpotlightCard>
        </motion.div>

        {/* Self-host card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%" }}
        >
          <SpotlightCard
            as="article"
            className="pricing-card pricing-card-pro"
            spotlightColor="rgba(16, 185, 129, 0.14)"
          >
            <BorderBeam duration={5} />
            <div>
              <span>Self-host</span>
              <strong className="pricing-free-label">Fully yours</strong>
              <p>Fork the repo and run it on your own infrastructure. No limits, no account needed.</p>
            </div>
            <ul>
              {selfHostItems.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.14 + i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Check size={17} />
                  {item}
                </motion.li>
              ))}
            </ul>
            <a className="button button-primary button-large" href="https://github.com/azkriven16/cvswift" target="_blank" rel="noopener noreferrer">
              View source
            </a>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
