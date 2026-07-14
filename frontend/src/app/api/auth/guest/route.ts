import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createGuestUser,
  createSession,
  getUserBySession,
} from "@/lib/server/mockStore";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/server/session";
import { DEMO_AUTH } from "@/lib/config";
import { backendEnabled, backendGuest } from "@/lib/server/backend";

// DEMO mode: provision (or reuse) a guest session so the dashboard is reachable
// without signing in. Disabled when real auth is configured.
export async function POST() {
  if (!DEMO_AUTH) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (backendEnabled()) return backendGuest();

  const cookieStore = await cookies();
  const existing = getUserBySession(cookieStore.get(SESSION_COOKIE)?.value);
  if (existing) {
    return NextResponse.json({ user: existing });
  }

  const user = createGuestUser();
  const token = createSession(user.id);
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);
  return NextResponse.json({ user }, { status: 201 });
}
