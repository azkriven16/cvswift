import { AuthRequired } from "@/components/auth-required";
import { SetupRequired } from "@/components/setup-required";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getResumeById } from "@/lib/services/resumes";
import { normalizeResumeContent } from "@/lib/resume/schema";

export default async function PrintResumePage({ params }: { params: Promise<{ id: string }> }) {
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
      <main style={{ padding: "2rem" }}>
        <p>{resumeResult.error === "not_found" ? "Resume not found." : "Could not load resume."}</p>
      </main>
    );
  }

  const resume = normalizeResumeContent(resumeResult.resume.content);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{resumeResult.resume.title} — CVSwift</title>
        <style>{`
          @media print {
            @page { size: A4; margin: 1.5cm; }
            .print-actions { display: none !important; }
            .one-page-warning { display: none !important; }
            body { margin: 0; }
          }
          @media screen {
            body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; background: #f5f5f5; }
            .print-actions { margin-bottom: 1rem; display: flex; gap: 0.75rem; }
            .print-actions button { padding: 0.4rem 0.9rem; border: 1px solid #ccc; border-radius: 6px; background: #fff; cursor: pointer; font-size: 0.875rem; }
            .print-actions button:hover { background: #f0f0f0; }
            .one-page-warning { display: none; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 0.6rem 1rem; margin-bottom: 1rem; font-size: 0.875rem; color: #92400e; }
            .one-page-warning.visible { display: block; }
          }
        `}</style>
      </head>
      <body>
        <div className="print-actions">
          <button type="button">Print / Save as PDF</button>
          <button type="button">Close</button>
        </div>
        <div className="one-page-warning" id="page-warning">
          Your resume may exceed one page. Consider shortening it before saving as PDF.
        </div>
        <article className="resume-preview ats-clean">
          <header>
            <h2>{resume.name}</h2>
            <p>{resume.headline}</p>
            <span>{resume.email} · {resume.location} · {resume.links.join(" · ")}</span>
          </header>
          <section>
            <h3>Summary</h3>
            <p>{resume.summary}</p>
          </section>
          <section>
            <h3>Skills</h3>
            <p>{resume.skills.join(" · ")}</p>
          </section>
          {resume.experience.length > 0 && (
            <section>
              <h3>Experience</h3>
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <strong>{exp.role}, {exp.company}</strong>
                  <span> · {exp.start} – {exp.end}</span>
                  <ul>
                    {exp.bullets.map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
          {resume.education.length > 0 && (
            <section>
              <h3>Education</h3>
              {resume.education.map((edu, i) => (
                <p key={i}>{edu.degree}, {edu.school} · {edu.year}</p>
              ))}
            </section>
          )}
        </article>
        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelectorAll('.print-actions button').forEach(function(btn) {
            var action = btn.getAttribute('onclick') || btn.textContent;
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
              if (btn.textContent.trim().startsWith('Print')) window.print();
              else window.close();
            });
          });
          window.addEventListener('DOMContentLoaded', function() {
            var article = document.querySelector('.resume-preview');
            if (article && article.scrollHeight > 1050) {
              document.getElementById('page-warning').classList.add('visible');
            }
          });
          setTimeout(function() {
            var article = document.querySelector('.resume-preview');
            if (article && article.scrollHeight > 1050) {
              document.getElementById('page-warning').classList.add('visible');
            }
          }, 300);
        ` }} />
      </body>
    </html>
  );
}
