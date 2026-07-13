// Shared domain types used across client and server.

export interface User {
  id: string;
  name: string;
  email: string;
}

// ─── Orders ──────────────────────────────────────────────────────────────────
// The lifecycle a sourcing request moves through, in order. The dashboard's
// status timeline renders these left-to-right.
export const ORDER_STATUSES = [
  "requested",
  "sourcing",
  "purchased",
  "in_transit",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DESTINATIONS = ["Qatar", "UAE", "Saudi Arabia", "Turkey"] as const;
export type Destination = (typeof DESTINATIONS)[number];

export interface Order {
  id: string;
  ref: string; // human-facing reference, e.g. "RF-2048"
  itemName: string;
  brand: string;
  size?: string;
  color?: string;
  budget?: string;
  destinationCountry: string;
  notes?: string;
  referencePhoto?: string; // data URL (mock media)
  status: OrderStatus;
  shopper?: string; // assigned personal shopper
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface NewOrderInput {
  itemName: string;
  brand: string;
  size?: string;
  color?: string;
  budget?: string;
  destinationCountry: string;
  notes?: string;
  referencePhoto?: string;
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export type AppointmentKind = "video_call" | "phone_call";
export type AppointmentStatus = "pending" | "confirmed" | "completed";

export interface Appointment {
  id: string;
  kind: AppointmentKind;
  shopper: string;
  scheduledAt: string; // ISO datetime
  status: AppointmentStatus;
  note?: string;
}

export interface NewAppointmentInput {
  kind: AppointmentKind;
  scheduledAt: string;
  note?: string;
}

// ─── Wishlist ──────────────────────────────────────────────────────────────────
// Exactly five priority slots (1 = top priority … 5 = lowest).
export interface WishlistItem {
  priority: number; // 1..5
  photo?: string; // data URL
  title?: string;
  link?: string;
  note?: string;
}
