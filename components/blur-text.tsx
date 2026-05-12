"use client";

import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

interface Props {
  text: string;
  className?: string;
}

export function BlurText({ text, className = "" }: Props) {
  const words = text.split(" ");
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true });

  useEffect(() => {
    if (!inView) return;
    animate(
      "span.word",
      { opacity: 1, filter: "blur(0px)", y: 0 },
      { duration: 0.55, delay: stagger(0.1), ease: [0.22, 1, 0.36, 1] }
    );
  }, [inView, animate]);

  return (
    <h1 ref={scope} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="word"
          initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
