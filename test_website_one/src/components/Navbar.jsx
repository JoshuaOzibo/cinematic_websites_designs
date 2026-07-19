import React from 'react';
import { Menu, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = ['Overview', 'Cinematic', 'Specs', 'Studio'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl h-14 z-50 transition-all duration-500">
        <div className="w-full h-full glass-card rounded-full flex items-center justify-between px-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
              Ω
            </div>
            <span className="font-heading font-bold text-lg tracking-widest text-text-primary uppercase transition-colors duration-300 group-hover:text-brand-orange">
              REVUELTO
            </span>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-sans text-xs font-medium tracking-widest uppercase text-text-muted hover:text-brand-orange transition-colors duration-300 cursor-pointer relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-px after:bg-brand-orange after:transition-all after:duration-300 hover:after:w-full"
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#configurator"
              className="hidden sm:flex items-center gap-2 bg-brand-orange text-white px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-brand-dark transition-all duration-300 shadow-[0_4px_20px_rgba(249,115,22,0.35)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.6)] group cursor-pointer"
            >
              Reserve
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-text-muted"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-studio-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full glass-card cursor-pointer text-text-muted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="font-heading font-bold text-4xl tracking-widest uppercase text-text-primary hover:text-brand-orange transition-colors duration-300 cursor-pointer"
            >
              {link}
            </a>
          ))}
          <a
            href="#configurator"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex items-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-full font-semibold tracking-widest uppercase text-sm cursor-pointer"
          >
            Reserve Now <ArrowRight size={14} />
          </a>
        </div>
      )}
    </>
  );
}
