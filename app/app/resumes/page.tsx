import { AuthRequired } from "@/components/auth-required";
import { SetupRequired } from "@/components/setup-required";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCurrentUserResumes } from "@/lib/services/resumes";
import { FilePlus2, FileText } from "lucide-react";
import Link from "next/link";

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export default async function ResumesPage() {
  if (!hasSupabaseEnv()) {
    return <SetupRequired missing={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]} />;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.auth.getUser();
  if (!data.user) return <AuthRequired />;

  const result = await listCurrentUserResumes();
  const resumes = "resumes" in result ? (result.resumes ?? []) : [];

  return (
    <main className="resume-list-page">
      <div className="resume-list-header">
        <h1>My resumes</h1>
        <Link className="button button-primary" href="/app/resumes/create">
          <FilePlus2 size={16} />
          New resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="resume-list-empty">
          <FileText size={32} />
          <p>No resumes yet.</p>
          <Link className="button button-primary" href="/app/resumes/create">Create your first resume</Link>
        </div>
      ) : (
        <div className="resume-list-grid">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/app/resumes/${resume.id}`} className="resume-card">
              <div className="resume-card-icon">
                <FileText size={20} />
              </div>
              <div className="resume-card-body">
                <strong>{resume.title || "Untitled"}</strong>
                {resume.target_role && <span>{resume.target_role}</span>}
              </div>
              <time className="resume-card-date" dateTime={resume.updated_at}>
                {relativeDate(resume.updated_at)}
              </time>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
