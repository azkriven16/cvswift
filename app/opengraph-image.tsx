import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CVSwift — Free AI Resume Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 56,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            width={44}
            height={44}
          >
            <rect width="32" height="32" rx="8" fill="#10b981" />
            <path d="M9 11h9M9 16h6M9 21h8" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 14l3 3-3 3" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            CVSwift
          </span>
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              padding: "4px 12px",
              borderRadius: 999,
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#10b981",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Open source
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-2px",
            marginBottom: 24,
            maxWidth: 860,
          }}
        >
          Build resumes that survive the first screen.
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
            marginBottom: 56,
            maxWidth: 640,
          }}
        >
          Free AI audits, job tailoring, and ATS-ready export — no credit card required.
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {["AI Audit", "Job Tailoring", "PDF Export", "Cover Letter"].map((f) => (
            <div
              key={f}
              style={{
                display: "flex",
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* URL watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 80,
            fontSize: 16,
            color: "rgba(255,255,255,0.25)",
            fontWeight: 600,
          }}
        >
          cv-swift.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
