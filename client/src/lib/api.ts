export type CertificateStatus = "valid" | "expired" | "revoked";
export type Certificate = {
  code: string;
  full_name: string;
  passport_number: string | null;
  date_of_birth: string | null;
  course_name: string;
  issue_date: string | null;
  status: CertificateStatus;
};

const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  return payload as T;
}

export async function findCertificate(code: string): Promise<Certificate | null> {
  try { return (await request<{ certificate: Certificate }>(`/api/verify?code=${encodeURIComponent(code)}`)).certificate; }
  catch (error) { if (error instanceof Error && error.message === "Certificate not found") return null; throw error; }
}
export async function getAdminSession() { return request<{ authenticated: boolean; admin?: { email: string } }>("/api/admin/me"); }
export async function login(email: string, password: string) { return request<{ authenticated: true; admin: { email: string } }>("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }); }
export async function logout() { return request<{ ok: true }>("/api/admin/logout", { method: "POST" }); }
export async function listCertificates() { return request<{ certificates: Certificate[] }>("/api/admin/certificates"); }
export async function createCertificate(input: Omit<Certificate, "code">) { return request<{ certificate: Certificate }>("/api/admin/certificates", { method: "POST", body: JSON.stringify(input) }).then((r) => r.certificate); }
export async function updateCertificate(code: string, input: Omit<Certificate, "code">) { return request<{ certificate: Certificate }>(`/api/admin/certificates/${code}`, { method: "PUT", body: JSON.stringify(input) }).then((r) => r.certificate); }
export async function deleteCertificate(code: string) { return request<{ ok: true }>(`/api/admin/certificates/${code}`, { method: "DELETE" }); }
export function isAuthError(error: unknown) { return error instanceof Error && /authenticated|session/i.test(error.message); }
export type { CertificateStatus as Status };

export const api = { findCertificate, getAdminSession, login, logout, listCertificates, createCertificate, updateCertificate, deleteCertificate };
export default api;
