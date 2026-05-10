import type { Plan } from "@/lib/config";

export type Resume = {
  id: string;
  title: string;
  targetRole: string;
  updatedAt: string;
  score: number;
  template: string;
};

export type Audit = {
  id: string;
  resumeId: string;
  score: number;
  createdAt: string;
  summary: string;
  categories: Array<{
    label: string;
    score: number;
    note: string;
  }>;
};

export type MockUser = {
  id: string;
  email: string;
  plan: Plan;
  resumeCount: number;
  auditsUsedToday: number;
};

export type ServiceStatus = {
  name: string;
  status: "mock" | "ready";
  detail: string;
};
