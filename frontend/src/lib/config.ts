// Central concierge contact configuration.
//
// Placeholders until the real concierge channels are provided — override at build
// time via NEXT_PUBLIC_WHATSAPP (digits only, international format) and
// NEXT_PUBLIC_CONCIERGE_EMAIL.

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP ?? "00000000000";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONCIERGE_EMAIL =
  process.env.NEXT_PUBLIC_CONCIERGE_EMAIL ?? "concierge@richfriend.co";

// DEMO auth mode — while the real backend is not yet configured, the dashboard
// is reachable without a real account: it provisions a guest session on demand,
// and sign-in accepts any credentials. Set NEXT_PUBLIC_DEMO_AUTH="false" once a
// real backend is wired up to restore proper authentication.
export const DEMO_AUTH = (process.env.NEXT_PUBLIC_DEMO_AUTH ?? "true") === "true";
