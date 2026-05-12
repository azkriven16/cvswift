export const FREE_RESUME_LIMIT = 5;
export const FREE_DAILY_AUDIT_LIMIT = 2;
export const FREE_DAILY_COPILOT_LIMIT = 20;
export const FREE_UPLOAD_LIMIT = 3;
export const FREE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export type Plan = "free" | "pro";
