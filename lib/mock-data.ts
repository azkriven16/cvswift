import { FREE_DAILY_AUDIT_LIMIT, FREE_RESUME_LIMIT } from "@/lib/config";
import type { Audit, MockUser, Resume, ServiceStatus } from "@/lib/types";

export const mockUser: MockUser = {
  id: "user_mock_01",
  email: "founder@cvswift.dev",
  plan: "free",
  resumeCount: 3,
  auditsUsedToday: 1,
};

export const mockResumes: Resume[] = [
  {
    id: "res_01",
    title: "Frontend Engineer",
    targetRole: "Senior Frontend Engineer",
    updatedAt: "Today",
    score: 86,
    template: "Sharp",
  },
  {
    id: "res_02",
    title: "Product Engineer",
    targetRole: "AI Product Engineer",
    updatedAt: "Yesterday",
    score: 79,
    template: "Signal",
  },
  {
    id: "res_03",
    title: "Design Engineer",
    targetRole: "Design Systems Engineer",
    updatedAt: "May 1",
    score: 91,
    template: "Mono",
  },
];

export const mockAudit: Audit = {
  id: "audit_mock_01",
  resumeId: "res_01",
  score: 86,
  createdAt: "Today",
  summary: "Strong frontend signal. Add more measurable business impact and tighten two vague bullets.",
  categories: [
    { label: "Impact", score: 82, note: "Add metrics to 2 bullets." },
    { label: "ATS Match", score: 89, note: "Good React and Next.js keyword coverage." },
    { label: "Clarity", score: 91, note: "Clean section hierarchy." },
    { label: "Seniority", score: 78, note: "Show more ownership and scope." },
  ],
};

export const serviceStatuses: ServiceStatus[] = [
  { name: "Supabase", status: "mock", detail: "Auth, profiles, resumes, audits, RLS-ready schema planned." },
  { name: "Stripe", status: "mock", detail: "$5/mo Pro checkout and webhook contract stubbed." },
  { name: "PostHog", status: "mock", detail: "Analytics, replay, flags, and error events wrapped behind one client." },
  { name: "Resend", status: "mock", detail: "Welcome and audit-complete email hooks return local payloads." },
  { name: "OpenAI", status: "mock", detail: "Pro AI rewrite and tailoring service returns deterministic suggestions." },
  { name: "Inngest", status: "mock", detail: "Audit-created and pro-upgraded background events are modeled." },
  { name: "Rate limit", status: "mock", detail: `${FREE_DAILY_AUDIT_LIMIT}/day free audits and ${FREE_RESUME_LIMIT} free resumes.` },
];
