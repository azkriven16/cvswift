import { FileUser, LogOut, Moon, Plus, Search, Settings } from "lucide-react";

const chatMessages = [
  { role: "user", text: "Rewrite bullets with stronger impact" },
  { role: "ai", text: "Rewrote 3 experience bullets with measurable results and action verbs." },
  { role: "user", text: "Make the tone more senior" },
  { role: "ai", text: "Updated summary, skills, and headline to reflect senior-level leadership." },
];

export function AppPreview() {
  return (
    <div className="app-preview-wrap">
      <div className="app-preview">
        {/* ── Sidebar ── */}
        <nav className="app-preview-sidebar">
          <div className="app-preview-brand">
            <span className="app-preview-brand-mark"><FileUser size={17} /></span>
            <span>CVSwift</span>
          </div>
          <div className="app-preview-nav-item app-preview-nav-active">
            <Plus size={15} /> New resume
          </div>
          <div className="app-preview-nav-item">
            <Search size={15} /> Search resumes
          </div>
          <div className="app-preview-nav-item">
            <Settings size={15} /> Preferences
          </div>
          <div className="app-preview-recents">
            <span>RECENTS</span>
            <a>Senior FE Resume</a>
            <a>Backend Engineer CV</a>
          </div>

          <div className="app-preview-sidebar-footer">
            <div className="app-preview-nav-item">
              <Moon size={15} /> Theme
            </div>
            <div className="app-preview-sidebar-signout">
              <div className="app-preview-avatar">N</div>
              <span>Sign out</span>
              <LogOut size={14} />
            </div>
          </div>
        </nav>

        {/* ── Main ── */}
        <div className="app-preview-main">
          {/* Topbar */}
          <div className="app-preview-topbar">
            <div className="app-preview-topbar-left">
              <div className="app-preview-fake-input app-preview-fake-input-title">Senior Frontend Engineer Resume</div>
              <div className="app-preview-fake-input">Senior Frontend Engineer</div>
            </div>
            <div className="app-preview-topbar-right">
              <div className="app-preview-chip">Export PDF</div>
              <div className="app-preview-chip">Share</div>
              <div className="app-preview-chip app-preview-chip-primary">Save</div>
            </div>
          </div>

          {/* Body */}
          <div className="app-preview-body">
            {/* AI panel */}
            <div className="app-preview-ai-panel">
              <div className="app-preview-ai-top">
                <div className="app-preview-kicker">AI EDITOR</div>
                <div className="app-preview-job-label">Job posting</div>
                <div className="app-preview-job-box">
                  Senior Frontend Engineer · Remote · $140–180k<br />
                  React, TypeScript, Next.js required. 5+ yrs exp.
                </div>
              </div>

              <div className="app-preview-chat">
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "app-preview-bubble-user" : "app-preview-bubble-ai"}
                  >
                    {m.text}
                  </div>
                ))}
                <button type="button" className="app-preview-undo">↩ Undo last edit</button>
              </div>

              <div className="app-preview-chat-footer">
                <div className="app-preview-suggestions">
                  <span>Emphasize keywords</span>
                  <span>Rewrite bullets</span>
                </div>
                <div className="app-preview-chat-row">
                  <div className="app-preview-chat-input">Try: tighten the summary…</div>
                  <div className="app-preview-send">↑</div>
                </div>
              </div>
            </div>

            {/* Resume panel */}
            <div className="app-preview-resume-panel">
              <div className="app-preview-tabs">
                <span className="apr-tab-active">ATS Clean</span>
                <span>Harvard</span>
                <span>Executive</span>
                <span>Sidebar</span>
              </div>
              <div className="app-preview-resume-scroll">
                <div className="app-preview-resume">
                  <div className="apr-name">Jordan Lee</div>
                  <div className="apr-headline">Senior Frontend Engineer</div>
                  <div className="apr-contact">jordan@example.com · San Francisco, CA · github.com/jordanlee · linkedin.com/in/jordanlee</div>
                  <div className="apr-rule" />
                  <div className="apr-section">
                    <div className="apr-section-label">SUMMARY</div>
                    <div className="apr-text">Frontend engineer with 6 years building product interfaces at SaaS companies. Led component library migrations, improved core web vitals by 40%, and shipped accessible UIs for 200k+ users.</div>
                  </div>
                  <div className="apr-section">
                    <div className="apr-section-label">SKILLS</div>
                    <div className="apr-text">React · TypeScript · Next.js · GraphQL · Node.js · Design Systems · Web Performance · Accessibility · Figma · Storybook · Vitest · Playwright</div>
                  </div>
                  <div className="apr-section">
                    <div className="apr-section-label">EXPERIENCE</div>
                    <div className="apr-entry">
                      <div className="apr-job">Senior Frontend Engineer, Flux Systems</div>
                      <div className="apr-date">2022 – Present</div>
                    </div>
                    <div className="apr-bullets">
                      <div>Built React component library used across 4 product teams, reducing UI inconsistencies by 60%.</div>
                      <div>Improved Largest Contentful Paint from 3.8s to 1.4s via code splitting and image optimization.</div>
                      <div>Increased trial-to-paid conversion 18% by leading onboarding flow redesign.</div>
                      <div>Mentored 3 junior engineers through weekly code review and pairing sessions.</div>
                    </div>
                    <div className="apr-entry" style={{ marginTop: 8 }}>
                      <div className="apr-job">Frontend Engineer, Cascade</div>
                      <div className="apr-date">2019 – 2022</div>
                    </div>
                    <div className="apr-bullets">
                      <div>Developed core dashboard UI with React, TypeScript, and D3 serving 50k daily users.</div>
                      <div>Led migration from class components to hooks, reducing codebase size by 22%.</div>
                      <div>Owned accessibility audit initiative, achieving WCAG 2.1 AA compliance across all surfaces.</div>
                    </div>
                    <div className="apr-entry" style={{ marginTop: 8 }}>
                      <div className="apr-job">UI Developer Intern, Arrowhead Labs</div>
                      <div className="apr-date">Summer 2018</div>
                    </div>
                    <div className="apr-bullets">
                      <div>Rebuilt marketing site in Next.js, cutting page load time by 48%.</div>
                      <div>Delivered reusable component kit used across two product launches.</div>
                    </div>
                  </div>
                  <div className="apr-section">
                    <div className="apr-section-label">EDUCATION</div>
                    <div className="apr-entry">
                      <div className="apr-job">B.S. Computer Science, UC Berkeley</div>
                      <div className="apr-date">2019</div>
                    </div>
                    <div className="apr-text" style={{ marginTop: 4 }}>GPA 3.8 · Dean's List · Emphasis in Human-Computer Interaction</div>
                  </div>
                  <div className="apr-section">
                    <div className="apr-section-label">PROJECTS</div>
                    <div className="apr-entry">
                      <div className="apr-job">OpenAudit — Next.js, TypeScript, Supabase</div>
                      <div className="apr-date">2024</div>
                    </div>
                    <div className="apr-bullets">
                      <div>Open-source resume scoring tool with AI feedback and PDF export. 1.2k GitHub stars.</div>
                    </div>
                    <div className="apr-entry" style={{ marginTop: 5 }}>
                      <div className="apr-job">PerfBoard — React, D3, Node.js</div>
                      <div className="apr-date">2023</div>
                    </div>
                    <div className="apr-bullets">
                      <div>Real-time web vitals dashboard used by 4 internal teams to track Core Web Vitals regressions.</div>
                    </div>
                  </div>
                  <div className="apr-section">
                    <div className="apr-section-label">CERTIFICATIONS</div>
                    <div className="apr-entry">
                      <div className="apr-job">AWS Certified Developer – Associate</div>
                      <div className="apr-date">2023</div>
                    </div>
                    <div className="apr-entry" style={{ marginTop: 5 }}>
                      <div className="apr-job">Google UX Design Certificate</div>
                      <div className="apr-date">2022</div>
                    </div>
                    <div className="apr-entry" style={{ marginTop: 5 }}>
                      <div className="apr-job">Meta Frontend Developer Certificate</div>
                      <div className="apr-date">2021</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
