"use client";

import type { CSSProperties } from "react";

interface Props {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  duration = 5,
  colorFrom = "var(--accent)",
  colorTo = "var(--accent-2)",
}: Props) {
  return (
    <span
      className="border-beam"
      style={
        {
          "--bm-duration": `${duration}s`,
          "--bm-from": colorFrom,
          "--bm-to": colorTo,
        } as CSSProperties
      }
    />
  );
}
