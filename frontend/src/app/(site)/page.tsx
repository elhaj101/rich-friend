import HeroSection from "@/components/sections/HeroSection";
import EditorialSection from "@/components/sections/EditorialSection";
import StylingSuiteSection from "@/components/sections/StylingSuiteSection";
import TrustSection from "@/components/sections/TrustSection";
import ScrollSnap from "@/components/ui/ScrollSnap";

export default function Home() {
  return (
    <>
      <ScrollSnap />
      <HeroSection />
      <EditorialSection />
      <StylingSuiteSection />
      <TrustSection />
    </>
  );
}
