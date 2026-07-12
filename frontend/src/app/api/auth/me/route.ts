import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserBySession } from "@/lib/server/mockStore";
import { SESSION_COOKIE } from "@/lib/server/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const user = getUserBySession(token);
  return NextResponse.json({ user });
}
