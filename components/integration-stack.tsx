"use client";

import { motion } from "framer-motion";

const stack = ["Supabase", "OpenRouter", "Gemini", "Cloudflare", "Vercel", "Next.js"];

export function IntegrationStack() {
  return (
    <section className="stack-strip" id="stack">
      <motion.p
        className="stack-strip-label"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        Built on trusted open infrastructure
      </motion.p>
      <div className="stack-strip-row">
        {stack.map((name, i) => (
          <motion.span
            key={name}
            className="stack-strip-chip"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {name}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
