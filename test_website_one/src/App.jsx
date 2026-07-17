import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CanvasSequence from './components/CanvasSequence';
import Specs from './components/Specs';
import Configurator from './components/Configurator';

export default function App() {
  return (
    <div className="relative min-h-screen bg-studio-bg text-brand-dark overflow-x-hidden">
      {/* 1. Navigation */}
      <Navbar />

      {/* 2. Fullscreen Hero Section */}
      <Hero />

      {/* 3. Pinned Scroll Image Sequence Canvas */}
      <CanvasSequence />

      {/* 4. Specs Grid Section */}
      <Specs />

      {/* 5. Personalization / Configurator Section */}
      <Configurator />

      {/* 6. Footer */}
      <footer className="w-full bg-brand-dark text-white/50 text-xs font-semibold py-8 border-t border-white/5 text-center tracking-widest uppercase">
        <p>© 2026 REVUELTO DESIGN STUDIO. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
