import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, Inter, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/AuthContext";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Dashboard-only display serif (Graphite & Terracotta theme headings)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

// Calligraphy wordmark font (brand logotype)
const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh",
  subsets: ["arabic"],
  weight: ["500", "600"],
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-ar",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rich Friend — Your Personal Shopper in Europe",
  description:
    "A luxury personal shopping concierge for clients in Qatar, UAE, Saudi Arabia & Turkey. We source, purchase and deliver authenticated luxury goods from Europe — with official receipts and complete discretion.",
  keywords: [
    "personal shopper",
    "luxury concierge",
    "Europe shopping",
    "Qatar",
    "UAE",
    "Saudi Arabia",
    "Turkey",
    "authenticated luxury",
  ],
  openGraph: {
    title: "Rich Friend — Your Personal Shopper in Europe",
    description:
      "We source and purchase the exact piece from Europe's ateliers and boutiques on your behalf — authenticated, receipted, and delivered with complete discretion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${cormorantGaramond.variable} ${fraunces.variable} ${inter.variable} ${notoNaskhArabic.variable} ${ibmPlexSansArabic.variable} ${pinyonScript.variable} antialiased`}
    >
      <body className="min-h-screen bg-ivory">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
