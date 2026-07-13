// ─────────────────────────────────────────────────────────────────────────────
// MOCK, IN-MEMORY user + session + concierge-data store.
//
// This is a stand-in for the Django + DRF backend described in the root README.
// It is intentionally non-persistent: all users, sessions, orders, appointments
// and wishlists are held in module memory and reset whenever the server process
// restarts. It exists so the full signed-in experience is reviewable today. To go
// to production, replace the calls in the Route Handlers under app/api/* with a
// real backend (see src/lib/api.ts for the single seam that points the frontend
// at that backend).
//
// Server-only: import this from Route Handlers, never from client components.
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "node:crypto";
import type {
  Appointment,
  NewAppointmentInput,
  NewOrderInput,
  Order,
  User,
  WishlistItem,
} from "@/lib/types";

interface StoredUser extends User {
  passwordHash: string;
}

const users = new Map<string, StoredUser>(); // key: lowercased email
const sessions = new Map<string, string>(); // sessionToken -> userId

// Per-user concierge data, keyed by userId.
const ordersByUser = new Map<string, Order[]>();
const appointmentsByUser = new Map<string, Appointment[]>();
const wishlistByUser = new Map<string, WishlistItem[]>();

function hashPassword(password: string): string {
  // Mock-grade hashing (unsalted SHA-256). A real backend would use a slow,
  // salted KDF such as PBKDF2/bcrypt/argon2 — out of scope for the mock.
  return crypto.createHash("sha256").update(password).digest("hex");
}

function toPublic(u: StoredUser): User {
  return { id: u.id, name: u.name, email: u.email };
}

// ─── Users & sessions ──────────────────────────────────────────────────────────

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase());
}

export function createUser(name: string, email: string, password: string): User {
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
  };
  users.set(email.toLowerCase(), user);
  seedUserData(user.id);
  return toPublic(user);
}

export function verifyCredentials(email: string, password: string): User | null {
  const u = findUserByEmail(email);
  if (!u || u.passwordHash !== hashPassword(password)) return null;
  return toPublic(u);
}

export function createSession(userId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, userId);
  return token;
}

export function getUserBySession(token: string | undefined): User | null {
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  for (const u of users.values()) {
    if (u.id === userId) return toPublic(u);
  }
  return null;
}

export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token);
}

// ─── Orders ──────────────────────────────────────────────────────────────────

let orderCounter = 2040; // human-facing refs start at RF-2041

function nextOrderRef(): string {
  orderCounter += 1;
  return `RF-${orderCounter}`;
}

export function listOrders(userId: string): Order[] {
  const list = ordersByUser.get(userId) ?? [];
  // Newest first.
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOrder(userId: string, input: NewOrderInput): Order {
  const now = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    ref: nextOrderRef(),
    itemName: input.itemName,
    brand: input.brand,
    size: input.size,
    color: input.color,
    budget: input.budget,
    destinationCountry: input.destinationCountry,
    notes: input.notes,
    referencePhoto: input.referencePhoto,
    status: "requested",
    shopper: "Camille Laurent",
    createdAt: now,
    updatedAt: now,
  };
  const list = ordersByUser.get(userId) ?? [];
  list.push(order);
  ordersByUser.set(userId, list);
  return order;
}

// ─── Appointments ──────────────────────────────────────────────────────────────

export function listAppointments(userId: string): Appointment[] {
  const list = appointmentsByUser.get(userId) ?? [];
  return [...list].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

export function requestAppointment(
  userId: string,
  input: NewAppointmentInput
): Appointment {
  const appt: Appointment = {
    id: crypto.randomUUID(),
    kind: input.kind,
    shopper: "Camille Laurent",
    scheduledAt: input.scheduledAt,
    status: "pending",
    note: input.note,
  };
  const list = appointmentsByUser.get(userId) ?? [];
  list.push(appt);
  appointmentsByUser.set(userId, list);
  return appt;
}

// ─── Wishlist ──────────────────────────────────────────────────────────────────

function emptyWishlist(): WishlistItem[] {
  return [1, 2, 3, 4, 5].map((priority) => ({ priority }));
}

export function getWishlist(userId: string): WishlistItem[] {
  return wishlistByUser.get(userId) ?? emptyWishlist();
}

export function saveWishlist(
  userId: string,
  items: WishlistItem[]
): WishlistItem[] {
  // Normalise to exactly five slots, priorities 1..5.
  const normalised: WishlistItem[] = [1, 2, 3, 4, 5].map((priority) => {
    const match = items.find((i) => i.priority === priority) ?? { priority };
    return {
      priority,
      photo: match.photo,
      title: match.title,
      link: match.link,
      note: match.note,
    };
  });
  wishlistByUser.set(userId, normalised);
  return normalised;
}

// ─── Seed data ─────────────────────────────────────────────────────────────────
// Every new account starts with a little history so the dashboard demonstrates
// order-status tracking and appointments immediately (mock data resets on
// server restart, so seeding keeps first sign-in populated regardless).

function seedUserData(userId: string): void {
  const daysAgo = (n: number) =>
    new Date(Date.now() - n * 86_400_000).toISOString();
  const daysFromNow = (n: number, hour = 16) => {
    const d = new Date(Date.now() + n * 86_400_000);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  ordersByUser.set(userId, [
    {
      id: crypto.randomUUID(),
      ref: nextOrderRef(),
      itemName: "Classic Flap Bag, medium",
      brand: "Chanel",
      color: "Emerald caviar / gold hardware",
      budget: "€9,500",
      destinationCountry: "Qatar",
      notes: "Prefer the emerald if available in caviar leather.",
      status: "in_transit",
      shopper: "Camille Laurent",
      createdAt: daysAgo(9),
      updatedAt: daysAgo(1),
    },
    {
      id: crypto.randomUUID(),
      ref: nextOrderRef(),
      itemName: "Tambour Street Diver watch",
      brand: "Louis Vuitton",
      color: "Blue dial",
      budget: "€3,200",
      destinationCountry: "Qatar",
      status: "delivered",
      shopper: "Camille Laurent",
      createdAt: daysAgo(34),
      updatedAt: daysAgo(20),
    },
  ]);

  appointmentsByUser.set(userId, [
    {
      id: crypto.randomUUID(),
      kind: "video_call",
      shopper: "Camille Laurent",
      scheduledAt: daysFromNow(3),
      status: "confirmed",
      note: "Live walk-through of the autumn arrivals at the Paris boutique.",
    },
  ]);

  wishlistByUser.set(userId, emptyWishlist());
}
