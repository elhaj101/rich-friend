// Server-side session helper shared by the concierge Route Handlers.
// Reads the httpOnly session cookie and resolves the current user, or null.

import { cookies } from "next/headers";
import { getUserBySession } from "@/lib/server/mockStore";
import { SESSION_COOKIE } from "@/lib/server/session";
import type { User } from "@/lib/types";

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return getUserBySession(token);
}
