import { fetchApi } from "@/lib/api";
import type { AuthUser, Role } from "@/store/auth";

export type AuthApiResponse = {
  token?: string;
  Token?: string;
  id?: string;
  Id?: string;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  role?: string | number;
  Role?: string | number;
};

const roleMap: Record<string, Role> = {
  patient: "patient",
  doctor: "doctor",
  admin: "admin",
  "0": "patient",
  "1": "doctor",
  "2": "admin",
};

export function toAuthUser(res: AuthApiResponse): AuthUser {
  const rawRole = String(res.role ?? res.Role ?? "patient").toLowerCase();
  const role = roleMap[rawRole] ?? "patient";

  return {
    id: String(res.id ?? res.Id ?? ""),
    name: res.fullName ?? res.FullName ?? "",
    email: res.email ?? res.Email ?? "",
    role,
  };
}

export function getToken(res: AuthApiResponse): string {
  const token = res.token ?? res.Token;
  if (!token) throw new Error("Authentication response missing token");
  return token;
}

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string }> {
  const res = await fetchApi<AuthApiResponse>("/Auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { user: toAuthUser(res), token: getToken(res) };
}

export async function registerAccount(payload: {
  fullName: string;
  email: string;
  password: string;
  role: number;
}): Promise<{ user: AuthUser; token: string }> {
  const res = await fetchApi<AuthApiResponse>("/Auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  try {
    const session = { user: toAuthUser(res), token: getToken(res) };
    return applyExpectedRole(session, payload.role);
  } catch {
    const session = await loginWithCredentials(payload.email, payload.password);
    return applyExpectedRole(session, payload.role);
  }
}

function applyExpectedRole(
  session: { user: AuthUser; token: string },
  role: number
): { user: AuthUser; token: string } {
  const expectedRole = roleMap[String(role)];
  if (!expectedRole) return session;
  return { ...session, user: { ...session.user, role: expectedRole } };
}

export async function registerDoctorAndSignIn(payload: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; token: string }> {
  return registerAccount({ ...payload, role: 1 });
}
