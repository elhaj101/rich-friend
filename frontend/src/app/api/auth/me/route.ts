import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserBySession } from "@/lib/server/mockStore";
import { SESSION_COOKIE } from "@/lib/server/session";
import { backendEnabled, backendMe } from "@/lib/server/backend";

export async function GET() {
  if (backendEnabled()) return backendMe();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = getUserBySession(token);
  return NextResponse.json({ user });
}
