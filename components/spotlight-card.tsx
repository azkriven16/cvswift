"use client";

import { useRef, type PropsWithChildren } from "react";

interface SpotlightCardProps extends PropsWithChildren {
  className?: string;
  spotlightColor?: string;
  as?: React.ElementType;
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.08)",
  as: Tag = "article",
  onClick,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    ref.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </Tag>
  );
}
