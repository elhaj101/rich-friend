import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { listAppointments, requestAppointment } from "@/lib/server/mockStore";
import type { AppointmentKind } from "@/lib/types";

const KINDS: AppointmentKind[] = ["video_call", "phone_call"];

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ appointments: listAppointments(user.id) });
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

  const kind = body.kind as AppointmentKind;
  const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";

  if (!KINDS.includes(kind) || !scheduledAt || Number.isNaN(Date.parse(scheduledAt))) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const appointment = requestAppointment(user.id, {
    kind,
    scheduledAt: new Date(scheduledAt).toISOString(),
    note: note || undefined,
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
