import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { createOrder, listOrders } from "@/lib/server/mockStore";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: listOrders(user.id) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "unknown" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const itemName = str(body.itemName);
  const brand = str(body.brand);
  const destinationCountry = str(body.destinationCountry);

  if (!itemName || !brand || !destinationCountry) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const referencePhoto =
    typeof body.referencePhoto === "string" &&
    body.referencePhoto.startsWith("data:image/")
      ? body.referencePhoto
      : undefined;

  const order = createOrder(user.id, {
    itemName,
    brand,
    destinationCountry,
    size: str(body.size) || undefined,
    color: str(body.color) || undefined,
    budget: str(body.budget) || undefined,
    notes: str(body.notes) || undefined,
    referencePhoto,
  });

  return NextResponse.json({ order }, { status: 201 });
}
