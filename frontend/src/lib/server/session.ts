// Session cookie configuration shared by the auth Route Handlers.
// The session is an httpOnly cookie set by Next.js (the "cookie-proxy" pattern
// from the README), keeping the token out of client-side JS.

export const SESSION_COOKIE = "rf_session";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};
