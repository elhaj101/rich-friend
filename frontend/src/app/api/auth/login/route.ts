import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSession,
  findOrCreateUser,
  verifyCredentials,
} from "@/lib/server/mockStore";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/server/session";
import { DEMO_AUTH } from "@/lib/config";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "unknown" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  // DEMO mode: accept any credentials (backend not yet configured). Otherwise
  // require a matching account.
  const user = DEMO_AUTH
    ? findOrCreateUser(email, password)
    : verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = createSession(user.id);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.json({ user });
}
