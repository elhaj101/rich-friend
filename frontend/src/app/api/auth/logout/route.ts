import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/server/mockStore";
import { SESSION_COOKIE } from "@/lib/server/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  destroySession(token);
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
