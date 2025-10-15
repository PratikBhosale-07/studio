import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section id="home" className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 animated-gradient -z-10" />
      <div className="container mx-auto flex h-full items-center justify-center text-center px-4">
        <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Empower Growth with Intelligent IDP Recommendations
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
              Transform your workforce with AI-powered Individual Development Plans. Align employee aspirations with business goals, identify skill gaps, and unlock true potential.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="group w-full sm:w-auto" asChild>
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white border-white/20 w-full sm:w-auto">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
