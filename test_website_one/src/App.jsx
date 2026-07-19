import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CanvasSequence from './components/CanvasSequence';
import Specs from './components/Specs';
import Configurator from './components/Configurator';

export default function App() {
  return (
    <div className="relative min-h-screen bg-studio-bg text-text-primary overflow-x-hidden">
      {/* 1. Navigation */}
      <Navbar />

      {/* 2. Fullscreen Hero Section */}
      <Hero />

      {/* 3. Pinned Scroll Cinematic Canvas — FULL WIDTH */}
      <CanvasSequence />

      {/* 4. Specs Grid Section */}
      <Specs />

      {/* 5. Personalization / Configurator Section */}
      <Configurator />

      {/* 6. Footer */}
      <footer className="w-full bg-brand-dark border-t border-white/5 py-10 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-xs">
              Ω
            </div>
            <span className="font-heading font-bold text-sm tracking-widest text-text-primary uppercase">
              REVUELTO
            </span>
          </div>
          <p className="font-sans text-xs text-text-muted/40 tracking-widest uppercase text-center">
            © 2026 Revuelto Design Studio. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-sans text-xs text-text-muted/40 hover:text-brand-orange transition-colors duration-200 tracking-wider uppercase cursor-pointer"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
