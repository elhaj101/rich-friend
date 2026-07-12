import type { Metadata } from "next";
import HowItWorksView from "./HowItWorksView";

export const metadata: Metadata = {
  title: "How It Works — Rich Friend",
  description:
    "From request to delivery — a discreet, personal process. Request, sourcing, in-person purchase and authentication, then delivery with the official receipt in your name.",
  openGraph: {
    title: "How It Works — Rich Friend",
    description:
      "Request, sourcing, in-person purchase and authentication, then discreet delivery — with transparent pricing and clear timelines.",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksView />;
}
