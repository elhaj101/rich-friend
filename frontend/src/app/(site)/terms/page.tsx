import type { Metadata } from "next";
import LegalView from "@/components/LegalView";

export const metadata: Metadata = {
  title: "Terms — Rich Friend",
  description:
    "The terms of Rich Friend's personal-shopping concierge service — official retail pricing, a transparent service fee, and authentication with the original receipt.",
};

export default function TermsPage() {
  return <LegalView kind="terms" />;
}
