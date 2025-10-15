import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import CareerPathSection from '@/components/sections/career-path-section';
import IdpGeneratorSection from '@/components/sections/idp-generator-section';
import AboutSection from '@/components/sections/about-section';
import Footer from '@/components/layout/footer';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-dvh w-full flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <CareerPathSection />
          <IdpGeneratorSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </FirebaseClientProvider>
  );
}
