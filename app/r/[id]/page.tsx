import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeResumeContent } from "@/lib/resume/schema";

export default async function PublicResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return (
      <main className="share-page">
        <p>This resume is not available.</p>
      </main>
    );
  }

  const { data: row } = await supabase.from("resumes").select("*").eq("id", id).single();

  if (!row) {
    return (
      <main className="share-page">
        <p>Resume not found.</p>
      </main>
    );
  }

  const resume = normalizeResumeContent(row.content);

  return (
    <main className="share-page">
      <header className="share-page-header">
        <span>Shared via CVSwift</span>
      </header>
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
                <span>{exp.start} – {exp.end}</span>
                <ul>
                  {exp.bullets.map((bullet, j) => <li key={j}>{bullet}</li>)}
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
    </main>
  );
}
