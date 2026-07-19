import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const COLORS = [
  { name: 'Arancio Apodis', hex: '#f97316', bgClass: 'bg-orange-500', price: 0 },
  { name: 'Giallo Auge', hex: '#eab308', bgClass: 'bg-yellow-500', price: 5000 },
  { name: 'Verde Mantis', hex: '#22c55e', bgClass: 'bg-green-500', price: 6500 },
  { name: 'Nero Aldebaran', hex: '#1e293b', bgClass: 'bg-slate-800', price: 4000 },
  { name: 'Grigio Acheso', hex: '#64748b', bgClass: 'bg-slate-500', price: 3500 },
];

const WHEELS = [
  { name: '20"/21" Altanero Forged Matt Black', price: 0 },
  { name: '21"/22" Trantolo Shiny Black with Diamond Cut', price: 8200 },
  { name: '20"/21" Corsher Titanium Grey', price: 4500 },
];

const INTERIORS = [
  { name: 'Sportive Alcantara Dual Color (Orange/Black)', price: 0 },
  { name: 'Sinfonietta Premium Leather Nero', price: 5400 },
  { name: 'Unicolor Sportive Leather Giallo', price: 4800 },
];

export default function Configurator() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedWheels, setSelectedWheels] = useState(WHEELS[0]);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0]);
  const [showModal, setShowModal] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [reserveEmail, setReserveEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef(null);

  const basePrice = 508000;
  const totalPrice = basePrice + selectedColor.price + selectedWheels.price + selectedInterior.price;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleReserve = (e) => {
    e.preventDefault();
    if (!reserveName || !reserveEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setReserveName('');
      setReserveEmail('');
      alert(`Reservation successful! We have sent a confirmation email to ${reserveEmail}.`);
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="configurator"
      className="w-full min-h-screen py-28 bg-studio-bg flex items-center justify-center px-6 md:px-12 relative z-10 overflow-hidden"
    >
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 transition-colors duration-700"
          style={{ backgroundColor: selectedColor.hex }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/25 to-transparent" />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-orange uppercase px-5 py-2 rounded-full border border-brand-orange/25 glass-card">
            Design Studio
          </span>
          <h2 className="font-heading font-black text-5xl md:text-7xl text-text-primary uppercase mt-6 tracking-tight italic">
            Personalize Yours
          </h2>
          <div className="w-16 h-px bg-brand-orange mx-auto mt-6 shadow-[0_0_16px_rgba(249,115,22,0.8)]" />
        </div>

        {/* Main Grid */}
        <div className="glass-card rounded-3xl border border-white/6 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

          {/* LEFT: Preview */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface-2/60 border border-white/5 p-8 relative overflow-hidden min-h-[400px]">
            {/* Color ambient glow */}
            <div
              className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] opacity-20 transition-colors duration-700"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-15 transition-colors duration-700"
              style={{ backgroundColor: selectedColor.hex }}
            />

            <div className="relative z-10">
              <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-text-muted">
                Live Preview
              </span>
              <h3 className="font-heading font-black text-2xl text-text-primary uppercase mt-2 tracking-tight italic">
                REVUELTO COUPÉ
              </h3>
            </div>

            {/* Car Preview */}
            <div className="my-10 flex flex-col items-center justify-center relative z-10">
              <div
                className="absolute w-80 h-20 rounded-full blur-[50px] opacity-30 bottom-4 transition-colors duration-700"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <img
                src="/images/ezgif-frame-001.jpg"
                alt="Revuelto Configuration Preview"
                className="w-full max-w-sm object-contain z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] select-none pointer-events-none hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Price */}
            <div className="relative z-10 border-t border-white/8 pt-6 flex justify-between items-end">
              <div>
                <p className="font-sans text-xs text-text-muted/60 font-medium uppercase tracking-widest">
                  Estimated Price
                </p>
                <h4 className="font-heading font-black text-4xl text-text-primary mt-1">
                  ${totalPrice.toLocaleString()}
                </h4>
              </div>
              <span className="font-sans text-[10px] text-text-muted/40 font-light italic">
                Excl. local taxes
              </span>
            </div>
          </div>

          {/* RIGHT: Options */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-sans text-sm text-text-muted/60 mt-2 leading-relaxed font-light">
                Tailor the performance aesthetics of your Revuelto from official factory configurations.
              </p>

              <div className="w-10 h-px bg-brand-orange mt-6 mb-10 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

              {/* Colors */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-sans text-xs font-semibold uppercase text-text-muted tracking-[0.15em]">
                    Exterior Paint
                  </h4>
                  <span className="text-brand-orange font-semibold text-xs">
                    {selectedColor.name}{selectedColor.price > 0 ? ` (+$${selectedColor.price.toLocaleString()})` : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-2 ${
                        selectedColor.name === color.name
                          ? 'border-white scale-110 shadow-[0_0_16px_rgba(249,115,22,0.5)]'
                          : 'border-transparent hover:scale-105 hover:border-white/30'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full ${color.bgClass} flex items-center justify-center text-white`}
                      >
                        {selectedColor.name === color.name && <Check size={12} strokeWidth={3} />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wheels */}
              <div className="mb-8">
                <h4 className="font-sans text-xs font-semibold uppercase text-text-muted tracking-[0.15em] mb-3">
                  Wheel Rims
                </h4>
                <div className="flex flex-col gap-2">
                  {WHEELS.map((wheel) => (
                    <button
                      key={wheel.name}
                      onClick={() => setSelectedWheels(wheel)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-xs font-medium flex justify-between items-center transition-all duration-300 cursor-pointer ${
                        selectedWheels.name === wheel.name
                          ? 'border-brand-orange/50 bg-brand-orange/8 text-text-primary'
                          : 'border-white/8 bg-transparent text-text-muted hover:border-white/20 hover:text-text-primary'
                      }`}
                    >
                      <span>{wheel.name}</span>
                      <span className="text-brand-orange font-semibold ml-4 whitespace-nowrap">
                        {wheel.price === 0 ? 'Included' : `+$${wheel.price.toLocaleString()}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interior */}
              <div className="mb-10">
                <h4 className="font-sans text-xs font-semibold uppercase text-text-muted tracking-[0.15em] mb-3">
                  Interior Upholstery
                </h4>
                <div className="flex flex-col gap-2">
                  {INTERIORS.map((interior) => (
                    <button
                      key={interior.name}
                      onClick={() => setSelectedInterior(interior)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-xs font-medium flex justify-between items-center transition-all duration-300 cursor-pointer ${
                        selectedInterior.name === interior.name
                          ? 'border-brand-orange/50 bg-brand-orange/8 text-text-primary'
                          : 'border-white/8 bg-transparent text-text-muted hover:border-white/20 hover:text-text-primary'
                      }`}
                    >
                      <span>{interior.name}</span>
                      <span className="text-brand-orange font-semibold ml-4 whitespace-nowrap">
                        {interior.price === 0 ? 'Included' : `+$${interior.price.toLocaleString()}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-brand-orange text-white py-4 rounded-2xl font-semibold uppercase tracking-widest text-xs shadow-[0_8px_32px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_40px_rgba(249,115,22,0.6)] hover:bg-orange-400 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to Reservation</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-8 relative overflow-hidden border border-white/8">
            {/* Modal glow */}
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-15 transition-colors duration-500"
              style={{ backgroundColor: selectedColor.hex }}
            />

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full glass-card cursor-pointer text-text-muted hover:text-white transition-colors z-10"
            >
              <X size={16} />
            </button>

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mb-6">
                  <Sparkles size={28} />
                </div>
                <h3 className="font-heading font-black text-2xl text-text-primary uppercase mb-2">
                  Processing Order...
                </h3>
                <p className="font-sans text-sm text-text-muted/60 font-light">
                  Securing your production slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="relative z-10">
                <h3 className="font-heading font-black text-2xl text-text-primary uppercase tracking-tight mb-2 italic">
                  Reserve Revuelto
                </h3>
                <p className="font-sans text-xs text-text-muted/60 leading-relaxed mb-8 font-light">
                  Submit your details to reserve your custom allocation. Our specialist team will reach out within 24 hours.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block font-sans text-xs text-text-muted tracking-widest uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reserveName}
                      onChange={(e) => setReserveName(e.target.value)}
                      placeholder="e.g. Jean Bugatti"
                      className="w-full bg-white/5 border border-white/10 focus:border-brand-orange rounded-xl px-4 py-3 text-sm outline-none transition-all text-text-primary placeholder:text-text-muted/30 font-light"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs text-text-muted tracking-widest uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={reserveEmail}
                      onChange={(e) => setReserveEmail(e.target.value)}
                      placeholder="e.g. jean@bugatti.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-brand-orange rounded-xl px-4 py-3 text-sm outline-none transition-all text-text-primary placeholder:text-text-muted/30 font-light"
                    />
                  </div>

                  {/* Summary */}
                  <div className="glass-card rounded-xl p-4 border border-white/6">
                    <p className="font-sans text-xs text-text-muted/70 flex justify-between">
                      <span>Build Total:</span>
                      <span className="text-text-primary font-semibold">${totalPrice.toLocaleString()}</span>
                    </p>
                    <p className="font-sans text-[10px] text-text-muted/40 mt-1 font-light">
                      Color: {selectedColor.name} · Rims: {selectedWheels.name.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-orange text-white py-3.5 rounded-2xl font-semibold uppercase tracking-widest text-xs shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:bg-orange-400 transition-all duration-300 cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
