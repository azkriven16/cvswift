export type ResumeExperience = {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResumeEducation = {
  school: string;
  degree: string;
  year: string;
};

export type ResumeContent = {
  name: string;
  headline: string;
  email: string;
  location: string;
  links: string[];
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
};

export const starterResume: ResumeContent = {
  name: "John Doe",
  headline: "Frontend Engineer",
  email: "john.doe@example.com",
  location: "New York, NY",
  links: ["github.com/johndoe", "linkedin.com/in/johndoe"],
  summary: "Frontend engineer building polished, accessible React and Next.js product experiences.",
  skills: ["React", "Next.js", "TypeScript", "Accessibility", "Design Systems", "Performance"],
  experience: [
    {
      company: "Signal Studio",
      role: "Frontend Engineer",
      start: "2024",
      end: "Present",
      bullets: [
        "Built reusable React components for a dashboard.",
        "Improved page performance by reducing unnecessary client-side rendering.",
        "Partnered with design to ship responsive interfaces across mobile and desktop.",
      ],
    },
  ],
  education: [
    {
      school: "Self-directed",
      degree: "Frontend Engineering",
      year: "2026",
    },
  ],
};

export const templates = [
  {
    id: "ats-clean",
    name: "ATS Clean",
    description: "Plain one-column resume optimized for applicant tracking systems.",
  },
  {
    id: "photo-profile",
    name: "Photo Profile",
    description: "Profile-forward layout with a photo-ready header.",
  },
  {
    id: "timeline-impact",
    name: "Timeline Impact",
    description: "Experience-first layout with timeline-style bullets.",
  },
  {
    id: "compact-grid",
    name: "Compact Grid",
    description: "Dense two-column layout for fitting more detail on one page.",
  },
];

export function normalizeResumeContent(value: unknown): ResumeContent {
  if (!value || typeof value !== "object") return starterResume;

  const input = value as Partial<ResumeContent>;

  return {
    name: input.name || starterResume.name,
    headline: input.headline || starterResume.headline,
    email: input.email || starterResume.email,
    location: input.location || starterResume.location,
    links: Array.isArray(input.links) ? input.links.map(String) : starterResume.links,
    summary: input.summary || starterResume.summary,
    skills: Array.isArray(input.skills) ? input.skills.map(String) : starterResume.skills,
    experience: Array.isArray(input.experience) ? input.experience : starterResume.experience,
    education: Array.isArray(input.education) ? input.education : starterResume.education,
  };
}
