// ─────────────────────────────────────────────────────────────────────────────
// Django backend proxy (the README's "cookie-proxy" pattern).
//
// When BACKEND_API_URL is set (see .env.local / .env.example), the Route
// Handlers under app/api/* forward to the Django REST API in /backend instead
// of the in-memory mock store. JWTs never reach client JS: the access and
// refresh tokens live in httpOnly cookies set here, and this module attaches
// them server-side, transparently refreshing the access token when it expires.
//
// Server-only: import from Route Handlers, never from client components.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { User } from "@/lib/types";
import { sessionCookieOptions } from "@/lib/server/session";

const ACCESS_COOKIE = "rf_access";
const REFRESH_COOKIE = "rf_refresh";

// Access cookie can outlive the token itself (Django enforces expiry; we
// refresh on 401), so both cookies just use the long session lifetime.
const cookieOpts = sessionCookieOptions;

export function backendEnabled(): boolean {
  const demoAuth = (process.env.NEXT_PUBLIC_DEMO_AUTH ?? "true") === "true";
  return Boolean(process.env.BACKEND_API_URL) && !demoAuth;
}

function base(): string {
  return (process.env.BACKEND_API_URL ?? "").replace(/\/$/, "");
}

async function djangoFetch(
  path: string,
  method: string,
  body?: string,
  access?: string
): Promise<Response> {
  return fetch(`${base()}/api${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body,
    cache: "no-store",
  });
}

async function passThrough(res: Response): Promise<NextResponse> {
  const data = await res.json().catch(() => ({ error: "unknown" }));
  return NextResponse.json(data, { status: res.status });
}

async function setTokenCookies(access: string, refresh?: string): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, access, cookieOpts);
  if (refresh) store.set(REFRESH_COOKIE, refresh, cookieOpts);
}

async function clearTokenCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

/** Current access token, refreshing via the refresh cookie if needed. */
async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

async function refreshAccessToken(): Promise<string | null> {
  const store = await cookies();
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!refresh) return null;
  const res = await djangoFetch("/auth/refresh/", "POST", JSON.stringify({ refresh }));
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as { access?: string } | null;
  if (!data?.access) return null;
  await setTokenCookies(data.access);
  return data.access;
}

/**
 * Forward an authenticated JSON request to Django and return its response
 * verbatim (same body shape, same status). Retries once through a token
 * refresh when the access token has expired.
 */
export async function proxyJson(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH",
  request?: Request
): Promise<NextResponse> {
  const body = request ? await request.text() : undefined;
  let access = await getAccessToken();

  let res = access
    ? await djangoFetch(path, method, body, access)
    : null;

  if (!res || res.status === 401) {
    access = await refreshAccessToken();
    if (!access) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    res = await djangoFetch(path, method, body, access);
  }
  return passThrough(res);
}

// ─── Auth flows (set/clear the token cookies) ────────────────────────────────

type AuthResponse = { user: User; access: string; refresh: string };

async function authFlow(path: string, body?: string): Promise<NextResponse> {
  const res = await djangoFetch(path, "POST", body);
  if (!res.ok) return passThrough(res);
  const data = (await res.json()) as AuthResponse;
  await setTokenCookies(data.access, data.refresh);
  return NextResponse.json({ user: data.user }, { status: res.status });
}

export async function backendRegister(request: Request): Promise<NextResponse> {
  return authFlow("/auth/register/", await request.text());
}

export async function backendLogin(request: Request): Promise<NextResponse> {
  return authFlow("/auth/login/", await request.text());
}

export async function backendGuest(): Promise<NextResponse> {
  // Reuse an existing signed-in session rather than minting a fresh guest.
  const existing = await backendCurrentUser();
  if (existing) return NextResponse.json({ user: existing });
  return authFlow("/auth/guest/");
}

export async function backendLogout(): Promise<NextResponse> {
  await clearTokenCookies();
  return NextResponse.json({ ok: true });
}

async function backendCurrentUser(): Promise<User | null> {
  let access = await getAccessToken();
  let res = access ? await djangoFetch("/users/me/", "GET", undefined, access) : null;
  if (!res || res.status === 401) {
    access = await refreshAccessToken();
    if (!access) return null;
    res = await djangoFetch("/users/me/", "GET", undefined, access);
  }
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as { user?: User } | null;
  return data?.user ?? null;
}

export async function backendMe(): Promise<NextResponse> {
  return NextResponse.json({ user: await backendCurrentUser() });
}
