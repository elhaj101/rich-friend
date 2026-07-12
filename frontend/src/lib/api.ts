// ─────────────────────────────────────────────────────────────────────────────
// API seam.
//
// The single place the frontend talks to a backend. Today it targets the mock
// Route Handlers under /app/api (same-origin). To swap in the Django/DRF backend
// from the README, set NEXT_PUBLIC_API_URL to its base URL — no UI changes needed
// (align the paths/trailing-slashes with DRF at that point).
// ─────────────────────────────────────────────────────────────────────────────

import type { User } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ""; // "" = same-origin mock

// Error codes returned by the API, mapped to localized copy in the UI.
export type ApiErrorCode =
  | "missing_fields"
  | "invalid_email"
  | "weak_password"
  | "email_taken"
  | "invalid_credentials"
  | "network"
  | "unknown";

export class ApiError extends Error {
  code: ApiErrorCode;
  constructor(code: ApiErrorCode) {
    super(code);
    this.name = "ApiError";
    this.code = code;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
  } catch {
    throw new ApiError("network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = (data as { error?: ApiErrorCode })?.error ?? "unknown";
    throw new ApiError(code);
  }
  return data as T;
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const data = await postJson<{ user: User }>("/auth/register", input);
  return data.user;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<User> {
  const data = await postJson<{ user: User }>("/auth/login", input);
  return data.user;
}

export async function logout(): Promise<void> {
  await postJson<{ ok: true }>("/auth/logout", {});
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => ({}))) as { user?: User | null };
    return data.user ?? null;
  } catch {
    return null;
  }
}
