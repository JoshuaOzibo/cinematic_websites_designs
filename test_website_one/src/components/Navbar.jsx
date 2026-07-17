import React from 'react';
import { Menu, ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-16 bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-full flex items-center justify-between px-8 z-50 transition-all duration-300 hover:shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm tracking-wider transition-transform duration-300 group-hover:scale-105">
          Ω
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-brand-dark transition-colors duration-300 group-hover:text-brand-orange">
          REVUELTO
        </span>
      </div>

      {/* Nav Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {['Overview', 'Aerodynamics', 'Performance', 'Specs'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="font-sans text-sm font-medium text-brand-dark/70 hover:text-brand-orange transition-colors duration-200 cursor-pointer relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-orange after:transition-all after:duration-300 hover:after:w-full"
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex items-center gap-4">
        <a
          href="#configurator"
          className="hidden sm:flex items-center gap-2 bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-brand-orange transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer"
        >
          Reserve Now
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
        <button className="md:hidden p-2 rounded-full hover:bg-white/50 transition-colors cursor-pointer text-brand-dark">
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}
