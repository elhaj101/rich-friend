// ─────────────────────────────────────────────────────────────────────────────
// MOCK, IN-MEMORY user + session store.
//
// This is a stand-in for the Django + DRF backend described in the root README.
// It is intentionally non-persistent: all users and sessions are held in module
// memory and reset whenever the server process restarts. It exists so the full
// auth experience is reviewable today. To go to production, replace the calls in
// the Route Handlers under app/api/auth/* with a real backend (see src/lib/api.ts
// for the single seam that points the frontend at that backend).
//
// Server-only: import this from Route Handlers, never from client components.
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "node:crypto";
import type { User } from "@/lib/types";

interface StoredUser extends User {
  passwordHash: string;
}

const users = new Map<string, StoredUser>(); // key: lowercased email
const sessions = new Map<string, string>(); // sessionToken -> userId

function hashPassword(password: string): string {
  // Mock-grade hashing (unsalted SHA-256). A real backend would use a slow,
  // salted KDF such as PBKDF2/bcrypt/argon2 — out of scope for the mock.
  return crypto.createHash("sha256").update(password).digest("hex");
}

function toPublic(u: StoredUser): User {
  return { id: u.id, name: u.name, email: u.email };
}

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
