import { FREE_DAILY_AUDIT_LIMIT, FREE_RESUME_LIMIT, type Plan } from "@/lib/config";

export function getUsageCopy(plan: Plan, resumeCount: number, auditsUsedToday: number) {
  if (plan === "pro") {
    return {
      resumes: "Unlimited resumes",
      audits: `${Math.max(0, 100 - auditsUsedToday)} Pro audits left today`,
    };
  }

  return {
    resumes: `${resumeCount}/${FREE_RESUME_LIMIT} resumes used`,
    audits: `${Math.max(0, FREE_DAILY_AUDIT_LIMIT - auditsUsedToday)}/${FREE_DAILY_AUDIT_LIMIT} free audits left today`,
  };
}
