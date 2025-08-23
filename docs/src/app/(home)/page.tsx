import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";

export default function HomePage() {
  return (
    <main className="container mx-auto py-16">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
