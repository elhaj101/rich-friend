import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EditorialSection from "@/components/EditorialSection";
import StylingSuiteSection from "@/components/StylingSuiteSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <EditorialSection />
        <StylingSuiteSection />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
