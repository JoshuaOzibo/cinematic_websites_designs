import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Color → Image Mapping ───────────────────────────────────────────────────
const COLORS = [
  {
    name: 'Arancio Apodis',
    hex: '#f97316',
    bgClass: 'bg-orange-500',
    price: 0,
    image: '/car_images/revuelto_orange.png',
  },
  {
    name: 'Giallo Auge',
    hex: '#eab308',
    bgClass: 'bg-yellow-500',
    price: 5000,
    image: '/car_images/ChatGPT Image Jul 19, 2026, 07_02_40 PM.png',
  },
  {
    name: 'Verde Mantis',
    hex: '#22c55e',
    bgClass: 'bg-green-500',
    price: 6500,
    image: '/car_images/ChatGPT Image Jul 19, 2026, 07_02_50 PM.png',
  },
  {
    name: 'Blu Aegeus',
    hex: '#3b6ea8',
    bgClass: 'bg-blue-700',
    price: 4000,
    image: '/car_images/ChatGPT Image Jul 19, 2026, 07_03_15 PM.png',
  },
  {
    name: 'Grigio Acheso',
    hex: '#64748b',
    bgClass: 'bg-slate-500',
    price: 3500,
    image: '/car_images/ChatGPT Image Jul 19, 2026, 07_04_48 PM.png',
  },
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

// ─── Car Image Viewer with GSAP crossfade ─────────────────────────────────────
function CarImageViewer({ color }) {
  const wrapperRef = useRef(null);
  // Two image slots for crossfade
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const activeRef = useRef('A');        // which slot is currently visible
  const prevColorRef = useRef(null);    // track previous color to avoid double-fire

  useEffect(() => {
    if (!imgARef.current || !imgBRef.current) return;
    if (prevColorRef.current === color.name) return;
    prevColorRef.current = color.name;

    const incoming = activeRef.current === 'A' ? imgBRef.current : imgARef.current;
    const outgoing = activeRef.current === 'A' ? imgARef.current : imgBRef.current;

    // Preload the new image into the *inactive* slot before animating
    incoming.src = color.image;
    gsap.set(incoming, { opacity: 0, scale: 1.04, zIndex: 2 });
    gsap.set(outgoing, { zIndex: 1 });

    // Crossfade + subtle scale
    const tl = gsap.timeline();
    tl.to(outgoing, { opacity: 0, scale: 0.97, duration: 0.5, ease: 'power2.in' }, 0)
      .to(incoming, { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }, 0.1);

    // Swap active slot
    activeRef.current = activeRef.current === 'A' ? 'B' : 'A';
  }, [color]);

  // Set initial image
  useEffect(() => {
    if (imgARef.current) {
      imgARef.current.src = COLORS[0].image;
      prevColorRef.current = COLORS[0].name;
      gsap.set(imgARef.current, { opacity: 1, scale: 1, zIndex: 1 });
    }
    if (imgBRef.current) {
      gsap.set(imgBRef.current, { opacity: 0, zIndex: 0 });
    }
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full h-56 md:h-64 flex items-center justify-center">
      {/* Slot A */}
      <img
        ref={imgARef}
        alt="Revuelto car color preview A"
        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
      />
      {/* Slot B */}
      <img
        ref={imgBRef}
        alt="Revuelto car color preview B"
        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}

// ─── Main Configurator ────────────────────────────────────────────────────────
export default function Configurator() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedWheels, setSelectedWheels] = useState(WHEELS[0]);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0]);
  const [showModal, setShowModal] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [reserveEmail, setReserveEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef(null);
  const priceRef = useRef(null);
  const prevPriceRef = useRef(null);

  const basePrice = 508000;
  const totalPrice = basePrice + selectedColor.price + selectedWheels.price + selectedInterior.price;

  // Section entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
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

  // Animate price counter when it changes
  useEffect(() => {
    if (!priceRef.current) return;
    gsap.fromTo(priceRef.current,
      { opacity: 0.3, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [totalPrice]);

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

  const handleColorSelect = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="configurator"
      className="w-full min-h-screen py-28 bg-studio-bg flex items-center justify-center px-6 md:px-12 relative z-10 overflow-hidden"
    >
      {/* Background ambient glow — shifts with color */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-[-100px] right-[-100px] w-[700px] h-[700px] rounded-full blur-[180px] opacity-12 transition-all duration-700"
          style={{ backgroundColor: selectedColor.hex }}
        />
        <div
          className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full blur-[120px] opacity-8 transition-all duration-700"
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

        {/* Main Card */}
        <div className="glass-card rounded-3xl border border-white/6 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">

          {/* ── LEFT: Live Preview ─────────────────────────────────── */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface-2/60 border border-white/5 p-8 relative overflow-hidden min-h-[440px]">
            {/* Ambient corner glows */}
            <div
              className="absolute -top-32 -left-32 w-72 h-72 rounded-full blur-[90px] opacity-20 transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div
              className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-[70px] opacity-15 transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: selectedColor.hex }}
            />

            {/* Header */}
            <div className="relative z-10">
              <span className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-text-muted">
                Live Preview
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="font-heading font-black text-2xl text-text-primary uppercase tracking-tight italic">
                  REVUELTO COUPÉ
                </h3>
                {/* Color name tag */}
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border transition-colors duration-500"
                  style={{
                    color: selectedColor.hex,
                    borderColor: `${selectedColor.hex}50`,
                    backgroundColor: `${selectedColor.hex}15`,
                  }}
                >
                  {selectedColor.name}
                </span>
              </div>
            </div>

            {/* ── GSAP Crossfade Car Image ── */}
            <div className="relative z-10 my-6">
              {/* Colored reflection under car */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-10 rounded-full blur-[30px] opacity-35 transition-colors duration-500 pointer-events-none"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <CarImageViewer color={selectedColor} />
            </div>

            {/* Price */}
            <div className="relative z-10 border-t border-white/8 pt-6 flex justify-between items-end">
              <div>
                <p className="font-sans text-xs text-text-muted/60 font-medium uppercase tracking-widest">
                  Estimated Price
                </p>
                <h4 ref={priceRef} className="font-heading font-black text-4xl text-text-primary mt-1">
                  ${totalPrice.toLocaleString()}
                </h4>
              </div>
              <span className="font-sans text-[10px] text-text-muted/40 font-light italic">
                Excl. local taxes
              </span>
            </div>
          </div>

          {/* ── RIGHT: Options ─────────────────────────────────────── */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-sans text-sm text-text-muted/60 mt-2 leading-relaxed font-light">
                Tailor the performance aesthetics of your Revuelto from official factory configurations.
              </p>
              <div className="w-10 h-px bg-brand-orange mt-6 mb-10 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

              {/* ── Exterior Paint ── */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-sans text-xs font-semibold uppercase text-text-muted tracking-[0.15em]">
                    Exterior Paint
                  </h4>
                  <span className="text-brand-orange font-semibold text-xs transition-all duration-300">
                    {selectedColor.name}
                    {selectedColor.price > 0 ? ` (+$${selectedColor.price.toLocaleString()})` : ''}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => {
                    const isActive = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorSelect(color)}
                        title={color.name}
                        className="group relative flex flex-col items-center gap-1.5 cursor-pointer"
                      >
                        {/* Color swatch */}
                        <div
                          className={`w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center border-2 ${
                            isActive
                              ? 'border-white scale-110'
                              : 'border-transparent hover:scale-105 hover:border-white/25'
                          }`}
                          style={{
                            boxShadow: isActive ? `0 0 20px ${color.hex}80` : 'none',
                          }}
                        >
                          <span
                            className={`w-8 h-8 rounded-full ${color.bgClass} flex items-center justify-center text-white transition-transform duration-200`}
                          >
                            {isActive && <Check size={13} strokeWidth={3} />}
                          </span>
                        </div>
                        {/* Tooltip on hover */}
                        <span
                          className={`text-[9px] tracking-wider font-medium transition-all duration-200 ${
                            isActive ? 'text-white' : 'text-text-muted/50 group-hover:text-text-muted'
                          }`}
                          style={{ maxWidth: 52, textAlign: 'center', lineHeight: 1.2 }}
                        >
                          {color.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Wheels ── */}
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

              {/* ── Interior ── */}
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

            {/* CTA Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-brand-orange text-white py-4 rounded-2xl font-semibold uppercase tracking-widest text-xs shadow-[0_8px_32px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_40px_rgba(249,115,22,0.65)] hover:bg-orange-400 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to Reservation</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Reservation Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-8 relative overflow-hidden border border-white/8">
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-15 transition-colors duration-500 pointer-events-none"
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
                    <div className="flex items-center gap-3 mb-3">
                      {/* Mini car thumb */}
                      <img
                        src={selectedColor.image}
                        alt={selectedColor.name}
                        className="w-16 h-10 object-contain select-none"
                      />
                      <div>
                        <p className="font-sans text-xs text-text-primary font-semibold">{selectedColor.name}</p>
                        <p className="font-sans text-[10px] text-text-muted/50 font-light">
                          {selectedWheels.name.split(' ').slice(0, 2).join(' ')} Rims
                        </p>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-text-muted/70 flex justify-between border-t border-white/6 pt-3">
                      <span>Build Total:</span>
                      <span className="text-text-primary font-semibold">${totalPrice.toLocaleString()}</span>
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
