import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { getWishlist, saveWishlist } from "@/lib/server/mockStore";
import type { WishlistItem } from "@/lib/types";
import { backendEnabled, proxyJson } from "@/lib/server/backend";

export async function GET() {
  if (backendEnabled()) return proxyJson("/wishlist/", "GET");

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ wishlist: getWishlist(user.id) });
}

export async function PUT(request: Request) {
  if (backendEnabled()) return proxyJson("/wishlist/", "PUT", request);

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { items?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "unknown" }, { status: 400 });
  }

  if (!Array.isArray(body.items)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const items: WishlistItem[] = body.items
    .map((raw): WishlistItem | null => {
      if (typeof raw !== "object" || raw === null) return null;
      const r = raw as Record<string, unknown>;
      const priority = Number(r.priority);
      if (!Number.isInteger(priority) || priority < 1 || priority > 5) return null;
      const photo = str(r.photo);
      return {
        priority,
        photo: photo?.startsWith("data:image/") ? photo : undefined,
        title: str(r.title)?.trim() || undefined,
        link: str(r.link)?.trim() || undefined,
        note: str(r.note)?.trim() || undefined,
      };
    })
    .filter((i): i is WishlistItem => i !== null);

  return NextResponse.json({ wishlist: saveWishlist(user.id, items) });
}
