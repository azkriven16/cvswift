import { Brain, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { FREE_DAILY_AUDIT_LIMIT, FREE_RESUME_LIMIT } from "@/lib/config";
import { mockAudit, mockResumes, mockUser } from "@/lib/mock-data";
import { getUsageCopy } from "@/lib/services/rate-limit";

export function ResumeDashboard() {
  const usage = getUsageCopy(mockUser.plan, mockUser.resumeCount, mockUser.auditsUsedToday);

  return (
    <section className="section dashboard-section" id="dashboard">
      <div className="section-heading">
        <p className="eyebrow">Workspace preview</p>
        <h2>A resume builder with limits you can trust.</h2>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-panel dashboard-main">
          <div className="dashboard-head">
            <div>
              <span>Free workspace</span>
              <h3>{usage.resumes}</h3>
            </div>
            <a className="button button-primary" href="#pricing">
              Upgrade for $5
            </a>
          </div>
          <div className="resume-list">
            {mockResumes.map((resume) => (
              <article key={resume.id}>
                <FileText size={18} />
                <div>
                  <strong>{resume.title}</strong>
                  <span>{resume.targetRole} · {resume.template} · {resume.updatedAt}</span>
                </div>
                <em>{resume.score}</em>
              </article>
            ))}
          </div>
          <div className="limit-note">
            <ShieldCheck size={16} />
            Free accounts can create {FREE_RESUME_LIMIT} resumes. Pro removes the cap.
          </div>
        </div>

        <aside className="dashboard-panel audit-panel">
          <span className="panel-kicker">{usage.audits}</span>
          <strong>{mockAudit.score}</strong>
          <p>{mockAudit.summary}</p>
          <div className="audit-bars">
            {mockAudit.categories.map((category) => (
              <div key={category.label}>
                <span>{category.label}</span>
                <div><i style={{ width: `${category.score}%` }} /></div>
              </div>
            ))}
          </div>
        </aside>

        <aside className="dashboard-panel pro-panel">
          <LockKeyhole size={20} />
          <h3>Pro AI layer</h3>
          <p>AI bullet rewrites, job-description tailoring, and advanced audits unlock on the $5 Pro plan.</p>
          <div className="ai-suggestion">
            <Brain size={16} />
            <span>Rewrite weak bullets into measurable impact statements.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
