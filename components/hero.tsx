"use client";

import { ArrowUpRight, Bot, FileText, Gauge, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { AppPreview } from "@/components/app-preview";
import { BlurText } from "@/components/blur-text";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          Open-source AI resume workspace
        </motion.p>
        <BlurText text="Build resumes that survive the first screen." />
        <motion.p
          className="hero-lede"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
        >
          CVSwift gives job seekers a polished resume builder, AI-powered audits, and job-specific tailoring — completely free.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease }}
        >
          <a className="button button-primary button-large" href="/login">
            Start free
            <ArrowUpRight size={17} />
          </a>
          <button className="button button-secondary button-large command-open" type="button">
            <Terminal size={17} />
            Open AI command
          </button>
        </motion.div>
        <motion.div
          className="signal-row"
          aria-label="Product signals"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease }}
        >
          <span><FileText size={15} /> Resume builder</span>
          <span><Gauge size={15} /> AI audit</span>
          <span><Bot size={15} /> Job tailoring</span>
          <span><FileText size={15} /> Cover letter</span>
        </motion.div>
      </div>

      <motion.div
        className="hero-preview-wrap"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.75, ease }}
      >
        <AppPreview />
      </motion.div>
    </section>
  );
}
