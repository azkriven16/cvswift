"use client";

import { Command, FileUser, Menu, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = ["Product", "Dashboard", "Stack", "Pricing"];

export function Header() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <motion.header
      className="site-header"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="brand" href="#top" aria-label="CVSwift home">
        <span className="brand-mark">
          <FileUser size={15} />
        </span>
        <span>CVSwift</span>
      </a>

      <nav className={open ? "nav-links nav-links-open" : "nav-links"} aria-label="Primary">
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}>
            {link}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="icon-button"
          type="button"
          aria-label="Toggle color theme"
          onClick={() => setLight((value) => !value)}
        >
          <Moon size={17} />
        </button>
        <button className="button button-secondary command-open" type="button">
          <Command size={16} />
          Command
        </button>
        <a className="button button-primary" href="/login">
          Start free
        </a>
      </div>

      <button className="icon-button menu-button" type="button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
        <Menu size={19} />
      </button>
    </motion.header>
  );
}
