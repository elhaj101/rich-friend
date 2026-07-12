import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "About — Rich Friend",
  description:
    "Rich Friend is a small, private personal-shopping concierge that sources authentic luxury goods in person from Europe for clients in the Gulf — at official retail, with the original receipt.",
  openGraph: {
    title: "About — Rich Friend",
    description:
      "A personal shopper in Europe for those at home in the Gulf. Access, authenticity and discretion — made dependable.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
