import { neon } from "@neondatabase/serverless";
export type Env = { DATABASE_URL: string; SESSION_SECRET: string; ALLOWED_ORIGIN?: string; ADMIN_EMAIL?: string; ADMIN_PASSWORD_HASH?: string };
export function db(env: Env) { if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not configured"); return neon(env.DATABASE_URL); }
export const certificateFields = "code, full_name, passport_number, date_of_birth, course_name, issue_date, status";
export function normalize(row: Record<string, unknown>) { return { ...row, code: String(row.code), date_of_birth: row.date_of_birth ? String(row.date_of_birth).slice(0, 10) : null, issue_date: row.issue_date ? String(row.issue_date).slice(0, 10) : null }; }
