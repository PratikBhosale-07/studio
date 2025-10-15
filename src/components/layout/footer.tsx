import Link from 'next/link';
import { Mountain, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="#home" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">TalentFlow AI</span>
            </Link>
            <p className="max-w-xs">
              Empowering growth and unlocking potential with AI-driven development plans.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="font-semibold uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                  </li>
                  <li>
                    <a href="#dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                  </li>
                  <li>
                    <a href="#demo" className="hover:text-primary transition-colors">Demo</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#about" className="hover:text-primary transition-colors">About Us</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">Careers</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">Press</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold uppercase tracking-wider">Contact</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="mailto:contact@talentflow.ai" className="hover:text-primary transition-colors">Email Us</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">Support</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} TalentFlow AI. All rights reserved. | Made by Varahamihira SIH 2025 Group
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
