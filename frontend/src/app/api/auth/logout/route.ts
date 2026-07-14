import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/server/mockStore";
import { SESSION_COOKIE } from "@/lib/server/session";
import { backendEnabled, backendLogout } from "@/lib/server/backend";

export async function POST() {
  if (backendEnabled()) return backendLogout();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  destroySession(token);
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
