"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Command, GitPullRequest, Search, Sparkles, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const actions = [
  {
    icon: Sparkles,
    title: "Run resume audit",
    detail: "Uses 1 of 2 free daily audits",
    result: "Audit complete: score 86 with strongest signal in React, accessibility, and performance.",
  },
  {
    icon: GitPullRequest,
    title: "Rewrite bullet with AI",
    detail: "Pro feature on the $5 plan",
    result: "Improved conversion by 18% by rebuilding the onboarding flow with measurable UX checkpoints.",
  },
  {
    icon: Users,
    title: "Tailor to job description",
    detail: "Maps resume keywords to a target role",
    result: "Matched 11 role keywords and suggested 3 seniority upgrades for the summary.",
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest(".command-open")) {
        previousFocus.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        previousFocus.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % actions.length);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + actions.length) % actions.length);
      }
      if (event.key === "Enter") {
        event.preventDefault();
        setSelectedIndex(activeIndexRef.current);
      }
      if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>("input, button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [open]);

  const selectedAction = actions[selectedIndex];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-title"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="command-panel"
            ref={panelRef}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="command-input">
              <Search size={18} />
              <input id="command-title" autoFocus defaultValue="Audit my frontend resume" aria-label="Command input" />
              <kbd>esc</kbd>
            </div>
            <div className="command-layout">
              <div className="command-list" role="listbox" aria-label="Orbit commands">
                {actions.map(({ icon: Icon, title, detail }, index) => (
                  <button
                    aria-selected={index === activeIndex}
                    className={index === activeIndex ? "command-action command-action-active" : "command-action"}
                    type="button"
                    key={title}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setActiveIndex(index);
                      setSelectedIndex(index);
                    }}
                  >
                    <Icon size={18} />
                    <span><strong>{title}</strong><small>{detail}</small></span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.aside
                  className="command-result"
                  key={selectedAction.title}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <CheckCircle2 size={18} />
                  <strong>{selectedAction.title}</strong>
                  <p>{selectedAction.result}</p>
                </motion.aside>
              </AnimatePresence>
            </div>
            <p><Command size={14} /> Arrow keys select, Enter runs, Escape closes</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
