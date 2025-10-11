import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import DashboardPreviewSection from '@/components/sections/dashboard-preview-section';
import CareerPathSection from '@/components/sections/career-path-section';
import AnalyticsSection from '@/components/sections/analytics-section';
import IdpGeneratorSection from '@/components/sections/idp-generator-section';
import AboutSection from '@/components/sections/about-section';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <DashboardPreviewSection />
        <CareerPathSection />
        <AnalyticsSection />
        <IdpGeneratorSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
