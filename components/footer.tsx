"use client";

import { FileUser } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  {
    heading: "Resources",
    items: [
      { label: "View source", href: "https://github.com/azkriven16/cvswift", external: true },
      { label: "Stack",       href: "#stack" },
      { label: "Pricing",     href: "#pricing" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Sign up free", href: "/login" },
      { label: "Sign in",      href: "/login" },
    ],
  },
];

export function Footer() {
  return (
    <motion.footer
      className="site-footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="CVSwift home">
            <span className="brand-mark"><FileUser size={15} /></span>
            <span>CVSwift</span>
          </a>
          <p>Open-source AI resume workspace.<br />Free forever for job seekers.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          {links.map((col) => (
            <div key={col.heading} className="footer-col">
              <span>{col.heading}</span>
              <ul>
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CVSwift. Open source under MIT.</span>
        <a href="https://github.com/azkriven16/cvswift" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </motion.footer>
  );
}
