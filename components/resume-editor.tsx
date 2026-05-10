"use client";

import { ArrowUp, Download, FileText, Link, Plus, Save, Trash2, Upload, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { normalizeResumeContent, starterResume, templates, type ResumeContent, type ResumeEducation, type ResumeExperience } from "@/lib/resume/schema";
import { TurnstileWidget } from "@/components/turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

function tryParseResumeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { summary: text }; }
}

const editSuggestionPool = [
  "Emphasize job keywords",
  "Rewrite bullets with impact",
  "Tighten the summary",
  "Make the tone more senior",
  "Add more measurable results",
  "Improve ATS keyword match",
];

function randomSuggestions() {
  return [...editSuggestionPool].sort(() => Math.random() - 0.5).slice(0, 2);
}

const blankExperience: ResumeExperience = {
  company: "Company",
  role: "Role",
  start: "2024",
  end: "Present",
  bullets: ["Describe your impact here."],
};

const blankEducation: ResumeEducation = {
  school: "School",
  degree: "Degree",
  year: "2024",
};

const sampleResume: ResumeContent = {
  name: "Jordan Lee",
  headline: "Senior Frontend Engineer",
  email: "jordan.lee@example.com",
  location: "San Francisco, CA",
  links: ["github.com/jordanlee", "linkedin.com/in/jordanlee"],
  summary: "Frontend engineer with 6 years building product interfaces at SaaS companies. Led component library migrations, improved core web vitals by 40%, and shipped accessible UIs for 200k+ users.",
  skills: ["React", "TypeScript", "Next.js", "Design Systems", "Web Performance", "Accessibility", "Node.js", "Figma"],
  experience: [
    {
      company: "Flux Systems",
      role: "Senior Frontend Engineer",
      start: "2022",
      end: "Present",
      bullets: [
        "Built and maintained a React component library used across 4 product teams.",
        "Improved Largest Contentful Paint from 3.8s to 1.4s through code splitting and image optimization.",
        "Partnered with design to ship a redesigned onboarding flow, increasing trial-to-paid conversion by 18%.",
      ],
    },
    {
      company: "Cascade",
      role: "Frontend Engineer",
      start: "2019",
      end: "2022",
      bullets: [
        "Developed core dashboard UI with React, TypeScript, and D3 serving 50k daily users.",
        "Led migration from class components to hooks, reducing codebase size by 22%.",
        "Established accessibility standards and fixed 60+ WCAG 2.1 AA violations.",
      ],
    },
  ],
  education: [{ school: "UC Berkeley", degree: "B.S. Computer Science", year: "2019" }],
};

const sampleJobPost = `Software Engineer – Frontend Focus
Acme Corp | Remote | $140k–$180k

We're looking for a senior frontend engineer to join our product team. You'll own our React component library, drive performance improvements across the platform, and partner with design to build delightful user experiences.

Requirements:
- 5+ years of frontend development experience
- Deep React and TypeScript expertise
- Experience with Next.js or similar SSR frameworks
- Strong understanding of web performance optimization
- Excellent communication and cross-functional collaboration

Nice to have:
- Experience with design systems
- Familiarity with accessibility (WCAG 2.1)
- CI/CD and deployment experience`;

type SelectedContext = {
  text: string;
  lineCount: number;
} | null;

type ResumeEditorProps = {
  initialResume?: ResumeContent;
  resumeId?: string;
  title?: string;
  targetRole?: string;
};

export function ResumeEditor({ initialResume, resumeId, title: initialTitle, targetRole: initialTargetRole }: ResumeEditorProps = {}) {
  const [title, setTitle] = useState(initialTitle ?? "Untitled Resume");
  const [targetRole, setTargetRole] = useState(initialTargetRole ?? "");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [resume, setResume] = useState<ResumeContent>(initialResume ?? starterResume);
  const [jobPost, setJobPost] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [editSuggestions, setEditSuggestions] = useState(randomSuggestions);
  const [selectedContext, setSelectedContext] = useState<SelectedContext>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ score: number; summary: string; detected_keywords?: string[]; suggested_keywords?: string[] } | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [message, setMessage] = useState("");
  const resumePreviewRef = useRef<HTMLElement | null>(null);
  const selectedElementRef = useRef<HTMLElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const jobPostInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!templates.some((t) => t.id === templateId)) {
      setTemplateId(templates[0].id);
    }
  }, [templateId]);

  function updateResume(next: Partial<ResumeContent>) {
    setResume((current) => ({ ...current, ...next }));
  }

  function updateExperienceAt(index: number, next: Partial<ResumeExperience>) {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((exp, i) => (i === index ? { ...exp, ...next } : exp)),
    }));
  }

  function updateBulletAt(expIndex: number, bulletIndex: number, value: string) {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((exp, i) => {
        if (i !== expIndex) return exp;
        const bullets = [...exp.bullets];
        bullets[bulletIndex] = value.trim();
        return { ...exp, bullets: bullets.filter(Boolean) };
      }),
    }));
  }

  function addExperience() {
    setResume((current) => ({ ...current, experience: [...current.experience, { ...blankExperience }] }));
  }

  function removeExperience(index: number) {
    setResume((current) => ({ ...current, experience: current.experience.filter((_, i) => i !== index) }));
  }

  function updateEducationAt(index: number, next: Partial<ResumeEducation>) {
    setResume((current) => ({
      ...current,
      education: current.education.map((edu, i) => (i === index ? { ...edu, ...next } : edu)),
    }));
  }

  function addEducation() {
    setResume((current) => ({ ...current, education: [...current.education, { ...blankEducation }] }));
  }

  function removeEducation(index: number) {
    setResume((current) => ({ ...current, education: current.education.filter((_, i) => i !== index) }));
  }

  function addBulletAt(expIndex: number) {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((exp, i) =>
        i === expIndex ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    }));
  }

  async function generateCoverLetter() {
    if (!resumeId) { setMessage("Save your resume first to generate a cover letter."); return; }
    if (!jobPost.trim()) { setMessage("Add a job post first to generate a cover letter."); return; }
    setGeneratingCoverLetter(true);
    setMessage("");
    try {
      const response = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobPost, turnstileToken }),
      });
      const payload = (await response.json()) as { coverLetter?: string; error?: string };
      if (!response.ok) { setMessage(payload.error || "Could not generate cover letter."); return; }
      if (payload.coverLetter) setCoverLetter(payload.coverLetter);
    } finally {
      setGeneratingCoverLetter(false);
      setTurnstileToken("");
    }
  }

  function commitEditableText(value: string, fallback: string) {
    return value.replace(/\s+/g, " ").trim() || fallback;
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "resume");
      const response = await fetch("/api/job-post/extract", { method: "POST", body: formData });
      const payload = (await response.json()) as { text?: string; error?: string };
      if (payload.text) {
        setResume(normalizeResumeContent(tryParseResumeJson(payload.text)));
        setMessage("Resume loaded from file.");
        if (resumeId) {
          const storeForm = new FormData();
          storeForm.append("file", file);
          storeForm.append("resumeId", resumeId);
          await fetch("/api/uploads", { method: "POST", body: storeForm }).catch(() => undefined);
        }
      } else {
        setMessage(payload.error || "Could not parse file.");
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleJobPostUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "job post");
      const response = await fetch("/api/job-post/extract", { method: "POST", body: formData });
      const payload = (await response.json()) as { text?: string; error?: string };
      if (payload.text) {
        setJobPost(payload.text);
        setMessage("Job post loaded from file.");
      } else {
        setMessage(payload.error || "Could not read file.");
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function updateSelectionHighlight(range: Range) {
    const win = window as Window & typeof globalThis & {
      Highlight?: new (...ranges: Range[]) => unknown;
      CSS: typeof CSS & { highlights?: { set: (name: string, h: unknown) => void; delete: (name: string) => boolean } };
    };
    if (!win.Highlight || !win.CSS.highlights) return;
    win.CSS.highlights.set("resume-selection", new win.Highlight(range.cloneRange()));
  }

  function updateSelectedElement(range: Range) {
    const root = resumePreviewRef.current;
    if (!root) return;
    selectedElementRef.current?.classList.remove("resume-context-selected");
    const rangeNode = range.commonAncestorContainer;
    const rangeElement = rangeNode instanceof HTMLElement ? rangeNode : rangeNode.parentElement;
    const selected = rangeElement?.closest<HTMLElement>('[contenteditable="true"]');
    if (!selected || !root.contains(selected)) return;
    selected.classList.add("resume-context-selected");
    selectedElementRef.current = selected;
  }

  function clearSelectedContext() {
    setSelectedContext(null);
    selectedElementRef.current?.classList.remove("resume-context-selected");
    selectedElementRef.current = null;
    const win = window as Window & typeof globalThis & {
      CSS: typeof CSS & { highlights?: { delete: (name: string) => boolean } };
    };
    win.CSS.highlights?.delete("resume-selection");
  }

  useEffect(() => {
    function handleSelectionChange() {
      const root = resumePreviewRef.current;
      const selection = window.getSelection();
      if (!root || !selection || selection.isCollapsed || selection.rangeCount === 0) return;
      const { anchorNode, focusNode } = selection;
      if ((!anchorNode || !root.contains(anchorNode)) && (!focusNode || !root.contains(focusNode))) return;
      const range = selection.getRangeAt(0);
      const text = selection.toString().trim();
      if (!text) return;
      const textLines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean).length;
      const visualLines = range.getClientRects().length;
      setSelectedContext({ text, lineCount: Math.max(1, textLines, visualLines) });
      updateSelectionHighlight(range);
      updateSelectedElement(range);
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      clearSelectedContext();
    };
  }, []);

  async function auditResume() {
    if (!resumeId) { setMessage("Save your resume first to run an audit."); return; }
    setAuditing(true);
    setMessage("");
    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, turnstileToken }),
      });
      const payload = (await response.json()) as {
        result?: { score: number; summary: string; detected_keywords?: string[]; suggested_keywords?: string[] };
        error?: string;
      };
      if (!response.ok) { setMessage(payload.error || "Could not run audit."); return; }
      if (payload.result) {
        setAuditResult(payload.result);
        setMessage(`Audit complete — score: ${payload.result.score}/100`);
      }
    } finally {
      setAuditing(false);
      setTurnstileToken("");
    }
  }

  async function tailorResume() {
    if (!resumeId) {
      setMessage("Save your resume first, then use AI tailoring.");
      return;
    }
    if (!jobPost.trim()) {
      setMessage("Paste a job post above to tailor your resume.");
      return;
    }
    setTailoring(true);
    setMessage("");
    try {
      const response = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobPost, turnstileToken }),
      });
      const payload = (await response.json()) as { resume?: ResumeContent; error?: string };
      if (!response.ok) {
        setMessage(payload.error || "Could not tailor resume.");
        return;
      }
      if (payload.resume) {
        setResume(payload.resume);
        setMessage("Resume tailored to job post. Review the changes, then save.");
      }
    } finally {
      setTailoring(false);
      setTurnstileToken("");
      setChatInput("");
      setEditSuggestions(randomSuggestions());
    }
  }

  function runCopilot() {
    const prompt = `${chatInput.trim()} ${selectedContext?.text ?? ""}`.toLowerCase();
    if (!prompt.trim() && !jobPost.trim()) return;

    if (jobPost.trim()) {
      void tailorResume();
      return;
    }

    if (prompt.includes("summary")) {
      updateResume({
        summary: `${targetRole} focused on accessible, performant product experiences. Builds clean React and Next.js interfaces, sharpens ambiguous requirements, and ships polished workflows with strong attention to detail.`,
      });
      setMessage("Updated the summary.");
    } else if (prompt.includes("bullet") || prompt.includes("impact")) {
      const first = resume.experience[0];
      if (first) {
        updateExperienceAt(0, {
          bullets: [
            "Shipped reusable UI patterns that improved product consistency across core workflows.",
            "Reduced avoidable client-side rendering and improved perceived performance for key dashboards.",
            "Partnered with design to deliver responsive, accessible interfaces across mobile and desktop.",
          ],
        });
      }
      setMessage("Reworked the experience bullets.");
    } else {
      updateResume({ headline: `${targetRole || "Software Engineer"} | React, Next.js, TypeScript` });
      setMessage("Polished the headline for the target role.");
    }

    setChatInput("");
    setEditSuggestions(randomSuggestions());
  }

  async function saveResume() {
    setSaveState("saving");
    setMessage("");

    const method = resumeId ? "PUT" : "POST";
    const url = resumeId ? `/api/resumes/${resumeId}` : "/api/resumes";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, targetRole, content: resume }),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setSaveState("error");
      setMessage(payload.error || "Could not save resume. Sign in or check setup.");
      return;
    }

    setSaveState("saved");
    setMessage("Saved.");
  }

  return (
    <section className="resume-ai-page resume-ai-page-results">
      {message && <p className={saveState === "error" ? "form-message form-error" : "form-message"}>{message}</p>}

      <div className="resume-meta-row">
        <input
          className="input"
          type="text"
          aria-label="Resume title"
          placeholder="Resume title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          type="text"
          aria-label="Target role"
          placeholder="Target role (e.g. Senior Frontend Engineer)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />
      </div>

      <div className="result-mode-toolbar">
        <div className="template-switcher">
          {templates.map((template) => (
            <button className={template.id === templateId ? "active" : ""} key={template.id} type="button" onClick={() => setTemplateId(template.id)}>
              {template.name}
            </button>
          ))}
        </div>
        <div className="result-toolbar-actions">
          <input
            ref={uploadInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button className="button button-secondary" type="button" onClick={() => uploadInputRef.current?.click()} disabled={uploading}>
            <Upload size={16} />
            {uploading ? "Loading..." : "Upload Resume"}
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              if (resumeId) {
                window.open(`/app/resumes/${resumeId}/print`, "_blank");
              } else {
                setMessage("Save your resume first, then export as PDF.");
              }
            }}
          >
            <Download size={16} />
            Export PDF
          </button>
          {resumeId && (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(`${window.location.origin}/r/${resumeId}`);
                setMessage("Share link copied.");
              }}
            >
              <Link size={16} />
              Share
            </button>
          )}
          <button className="button button-primary" type="button" onClick={saveResume} disabled={saveState === "saving"}>
            <Save size={16} />
            {saveState === "saving" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="resume-result-grid">
        <section className="assistant-panel">
          <div className="assistant-panel-head">
            <div>
              <span className="panel-kicker">AI editor</span>
              <h2>Tailor to a job post.</h2>
            </div>
            {!resumeId && (
              <button
                type="button"
                className="button button-secondary"
                style={{ fontSize: "12px", minHeight: "28px", padding: "0 10px", alignSelf: "flex-start" }}
                onClick={() => { setResume(sampleResume); setJobPost(sampleJobPost); setTitle("Sample Resume"); setTargetRole("Senior Frontend Engineer"); setMessage("Sample data loaded. Try AI tailoring or edit inline."); }}
              >
                Try sample data
              </button>
            )}
          </div>

          <div className="job-post-section">
            <div className="job-post-section-header">
              <label htmlFor="job-post-input">Job posting</label>
              <div>
                <input
                  ref={jobPostInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,image/*"
                  style={{ display: "none" }}
                  onChange={handleJobPostUpload}
                />
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ fontSize: "12px", minHeight: "28px", padding: "0 9px" }}
                  onClick={() => jobPostInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={13} />
                  Upload
                </button>
              </div>
            </div>
            <textarea
              id="job-post-input"
              className="resume-source-input job-post-textarea"
              placeholder="Paste a job description here — AI will tailor your resume to match its keywords and requirements."
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
            />
          </div>

          <form className="inline-chat" onSubmit={(event) => { event.preventDefault(); runCopilot(); }}>
            {selectedContext && (
              <div className="selection-context-chip" aria-label="Selected resume text">
                <FileText size={15} />
                <span>{selectedContext.lineCount} {selectedContext.lineCount === 1 ? "line" : "lines"} selected</span>
                <button type="button" aria-label="Clear selected resume text" onClick={clearSelectedContext}>
                  <X size={13} />
                </button>
              </div>
            )}
            <div className="prompt-suggestions" aria-label="Suggested resume edits">
              {editSuggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => {
                    setChatInput(suggestion);
                    setEditSuggestions(randomSuggestions());
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <input
              aria-label="Ask for a resume edit"
              placeholder={jobPost.trim() ? "Click ↑ to tailor to the job post above, or type a specific edit." : "Try: emphasize job keywords, rewrite bullets for impact, or tighten the summary."}
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
            />
            <button className="icon-button" type="submit" aria-label="Apply AI edit" disabled={tailoring}>
              <ArrowUp size={16} />
            </button>
          </form>
          {tailoring && <p className="form-message" style={{ marginTop: "8px" }}>Tailoring to job post…</p>}

          {TURNSTILE_SITE_KEY && !turnstileToken && (
            <div style={{ marginTop: "10px" }}>
              <TurnstileWidget
                sitekey={TURNSTILE_SITE_KEY}
                onToken={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                size="compact"
              />
            </div>
          )}

          {resumeId && (
            <button
              type="button"
              className="button button-secondary"
              style={{ marginTop: "10px", fontSize: "13px" }}
              onClick={auditResume}
              disabled={auditing || Boolean(TURNSTILE_SITE_KEY && !turnstileToken)}
            >
              <Zap size={14} />
              {auditing ? "Auditing…" : "Audit resume"}
            </button>
          )}

          {auditResult && (
            <div className="inline-audit-result">
              <div className="inline-audit-score">
                <strong>{auditResult.score}</strong>
                <span>/100</span>
              </div>
              <p>{auditResult.summary}</p>
              {auditResult.detected_keywords && auditResult.detected_keywords.length > 0 && (
                <div className="keyword-chips keyword-chips-good" style={{ marginTop: "6px" }}>
                  {auditResult.detected_keywords.map((kw) => <span key={kw}>{kw}</span>)}
                </div>
              )}
              {auditResult.suggested_keywords && auditResult.suggested_keywords.length > 0 && (
                <div className="keyword-chips keyword-chips-missing" style={{ marginTop: "4px" }}>
                  {auditResult.suggested_keywords.map((kw) => <span key={kw}>{kw}</span>)}
                </div>
              )}
            </div>
          )}

          {jobPost.trim() && resumeId && (
            <div className="cover-letter-section">
              <div className="cover-letter-header">
                <span>Cover letter</span>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ fontSize: "12px", minHeight: "28px", padding: "0 9px" }}
                  onClick={generateCoverLetter}
                  disabled={generatingCoverLetter}
                >
                  {generatingCoverLetter ? "Generating…" : coverLetter ? "Regenerate" : "Generate"}
                </button>
              </div>
              {coverLetter && (
                <>
                  <textarea className="cover-letter-output" readOnly value={coverLetter} rows={10} />
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ fontSize: "12px", minHeight: "28px", padding: "0 9px", marginTop: "6px" }}
                    onClick={() => void navigator.clipboard.writeText(coverLetter).then(() => setMessage("Cover letter copied."))}
                  >
                    Copy
                  </button>
                </>
              )}
            </div>
          )}
        </section>

        <aside className="resume-output-panel">
          <article ref={resumePreviewRef} className={`resume-preview ${templateId}`}>
            <header>
              <h2
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => updateResume({ name: commitEditableText(event.currentTarget.innerText, resume.name) })}
              >
                {resume.name}
              </h2>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => updateResume({ headline: commitEditableText(event.currentTarget.innerText, resume.headline) })}
              >
                {resume.headline}
              </p>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => {
                  const parts = event.currentTarget.innerText.split("·").map((p) => p.trim()).filter(Boolean);
                  updateResume({
                    email: parts[0] || resume.email,
                    location: parts[1] || resume.location,
                    links: parts.slice(2).length ? parts.slice(2) : resume.links,
                  });
                }}
              >
                {resume.email} · {resume.location} · {resume.links.join(" · ")}
              </span>
            </header>

            <section>
              <h3>Summary</h3>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => updateResume({ summary: commitEditableText(event.currentTarget.innerText, resume.summary) })}
              >
                {resume.summary}
              </p>
            </section>

            <section>
              <h3>Skills</h3>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => {
                  const skills = event.currentTarget.innerText.split(/[·,\n]/).map((s) => s.trim()).filter(Boolean);
                  updateResume({ skills: skills.length ? skills : resume.skills });
                }}
              >
                {resume.skills.join(" · ")}
              </p>
            </section>

            <section>
              <div className="resume-section-header">
                <h3>Experience</h3>
                <button type="button" className="resume-add-btn" onClick={addExperience} aria-label="Add experience">
                  <Plus size={13} /> Add
                </button>
              </div>
              {resume.experience.map((exp, expIndex) => (
                <div key={expIndex} className="resume-entry">
                  {resume.experience.length > 1 && (
                    <button
                      type="button"
                      className="resume-remove-btn"
                      onClick={() => removeExperience(expIndex)}
                      aria-label="Remove experience"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <strong
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) => {
                      const [role, ...companyParts] = event.currentTarget.innerText.split(",");
                      updateExperienceAt(expIndex, {
                        role: role?.trim() || exp.role,
                        company: companyParts.join(",").trim() || exp.company,
                      });
                    }}
                  >
                    {exp.role}, {exp.company}
                  </strong>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) => {
                      const [start, end] = event.currentTarget.innerText.split("-").map((p) => p.trim());
                      updateExperienceAt(expIndex, { start: start || exp.start, end: end || exp.end });
                    }}
                  >
                    {exp.start} - {exp.end}
                  </span>
                  <ul>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li
                        contentEditable
                        suppressContentEditableWarning
                        key={`${expIndex}-${bulletIndex}-${bullet}`}
                        onBlur={(event) => updateBulletAt(expIndex, bulletIndex, commitEditableText(event.currentTarget.innerText, bullet))}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="resume-add-bullet-btn" onClick={() => addBulletAt(expIndex)}>
                    <Plus size={11} /> Add bullet
                  </button>
                </div>
              ))}
            </section>

            <section>
              <div className="resume-section-header">
                <h3>Education</h3>
                <button type="button" className="resume-add-btn" onClick={addEducation} aria-label="Add education">
                  <Plus size={13} /> Add
                </button>
              </div>
              {resume.education.map((edu, eduIndex) => (
                <div key={eduIndex} className="resume-entry">
                  {resume.education.length > 1 && (
                    <button
                      type="button"
                      className="resume-remove-btn"
                      onClick={() => removeEducation(eduIndex)}
                      aria-label="Remove education"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) => {
                      const [degreeSchool, year] = event.currentTarget.innerText.split("·").map((p) => p.trim());
                      const [degree, ...schoolParts] = (degreeSchool || "").split(",");
                      updateEducationAt(eduIndex, {
                        degree: degree?.trim() || edu.degree,
                        school: schoolParts.join(",").trim() || edu.school,
                        year: year || edu.year,
                      });
                    }}
                  >
                    {edu.degree}, {edu.school} · {edu.year}
                  </p>
                </div>
              ))}
            </section>
          </article>
        </aside>
      </div>
    </section>
  );
}

