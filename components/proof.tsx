"use client";

import { Route } from "lucide-react";
import { motion } from "framer-motion";

type StackItem =
  | { name: string; slug: string; icon?: never }
  | { name: string; icon: React.ReactNode; slug?: never };

const stack: StackItem[] = [
  { name: "Next.js",       slug: "nextdotjs"     },
  { name: "Supabase",      slug: "supabase"      },
  { name: "TypeScript",    slug: "typescript"    },
  { name: "Tailwind",      slug: "tailwindcss"   },
  { name: "Vercel",        slug: "vercel"        },
  { name: "Cloudflare",    slug: "cloudflare"    },
  { name: "Gemini",        slug: "googlegemini"  },
  { name: "Framer Motion", slug: "framer"        },
  { name: "OpenRouter",    icon: <Route size={18} /> },
];

export function Proof() {
  const items = [...stack, ...stack];
  return (
    <section className="proof" id="proof" aria-label="Built with">
      <motion.p
        className="proof-label"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        Powered by the tools modern teams trust
      </motion.p>
      <div className="proof-marquee-wrap">
        <div className="proof-fade proof-fade-left" />
        <div className="proof-track" aria-hidden>
          {items.map(({ name, slug, icon }, i) => (
            <span key={i} className="proof-item">
              {slug ? (
                <img
                  src={`https://cdn.simpleicons.org/${slug}/ffffff`}
                  alt={name}
                  width={20}
                  height={20}
                />
              ) : (
                icon
              )}
              {name}
            </span>
          ))}
        </div>
        <div className="proof-fade proof-fade-right" />
      </div>
    </section>
  );
}
