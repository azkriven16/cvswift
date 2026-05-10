import { AuthRequired } from "@/components/auth-required";
import { SetupRequired } from "@/components/setup-required";
import { ResumeEditor } from "@/components/resume-editor";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getResumeById } from "@/lib/services/resumes";
import { listAuditsByResumeId } from "@/lib/services/audits";
import { normalizeResumeContent } from "@/lib/resume/schema";

export default async function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!hasSupabaseEnv()) {
    return <SetupRequired missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]} />;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();
  if (!data.user) return <AuthRequired />;

  const resumeResult = await getResumeById(id);
  if ("error" in resumeResult) {
    return (
      <main className="section">
        <p className="form-message form-error">
          {resumeResult.error === "not_found" ? "Resume not found." : "Could not load resume."}
        </p>
      </main>
    );
  }

  const resume = normalizeResumeContent(resumeResult.resume.content);
  const auditsResult = await listAuditsByResumeId(id);
  const audits = "audits" in auditsResult ? (auditsResult.audits ?? []) : [];

  return (
    <main>
      <ResumeEditor
        initialResume={resume}
        resumeId={id}
        title={resumeResult.resume.title}
        targetRole={resumeResult.resume.target_role ?? undefined}
      />
      {audits.length > 0 && (
        <section className="audit-history">
          <h2>Audit history</h2>
          {audits.map((audit) => {
            const result = audit.result as {
              summary?: string;
              categories?: Array<{ label: string; score: number }>;
              suggestions?: string[];
              detected_keywords?: string[];
              suggested_keywords?: string[];
            };
            return (
              <article key={audit.id} className="audit-entry">
                <div className="audit-entry-head">
                  <strong>Score: {audit.score}</strong>
                  <time dateTime={audit.created_at}>{new Date(audit.created_at).toLocaleDateString()}</time>
                </div>
                {result.summary && <p>{result.summary}</p>}
                {result.categories && (
                  <div className="audit-bars">
                    {result.categories.map((category) => (
                      <div key={category.label}>
                        <span>{category.label}</span>
                        <div><i style={{ width: `${category.score}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}
                {result.detected_keywords && result.detected_keywords.length > 0 && (
                  <div className="audit-keywords">
                    <span className="audit-keywords-label">Strong keywords</span>
                    <div className="keyword-chips keyword-chips-good">
                      {result.detected_keywords.map((kw) => <span key={kw}>{kw}</span>)}
                    </div>
                  </div>
                )}
                {result.suggested_keywords && result.suggested_keywords.length > 0 && (
                  <div className="audit-keywords">
                    <span className="audit-keywords-label">Add these</span>
                    <div className="keyword-chips keyword-chips-missing">
                      {result.suggested_keywords.map((kw) => <span key={kw}>{kw}</span>)}
                    </div>
                  </div>
                )}
                {result.suggestions && result.suggestions.length > 0 && (
                  <ul className="audit-suggestions">
                    {result.suggestions.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
