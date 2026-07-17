import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

const COLORS = [
  { name: 'Arancio Apodis', hex: '#f97316', bgClass: 'bg-orange-500', price: 0 },
  { name: 'Giallo Auge', hex: '#eab308', bgClass: 'bg-yellow-500', price: 5000 },
  { name: 'Verde Mantis', hex: '#22c55e', bgClass: 'bg-green-500', price: 6500 },
  { name: 'Nero Aldebaran', hex: '#0f172a', bgClass: 'bg-slate-900', price: 4000 },
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

  // Calculate total price
  const basePrice = 508000;
  const totalPrice = basePrice + selectedColor.price + selectedWheels.price + selectedInterior.price;

  useEffect(() => {
    // Fade in animation
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
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
      className="w-full min-h-screen py-32 bg-studio-bg flex items-center justify-center px-6 md:px-12 relative z-10"
    >
      <div className="max-w-6xl w-full bg-white rounded-[40px] shadow-2xl border border-brand-dark/5 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left Side: Dynamic Preview Card */}
        <div className="flex flex-col justify-between h-full min-h-[400px] bg-studio-bg/60 rounded-[30px] p-8 border border-brand-dark/5 relative overflow-hidden group">
          {/* Subtle Ambient Glow */}
          <div 
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-[100px] transition-colors duration-500"
            style={{ backgroundColor: selectedColor.hex }}
          ></div>
          
          <div>
            <span className="text-xs font-extrabold tracking-widest text-brand-dark/40 uppercase">
              Live Preview
            </span>
            <h3 className="font-heading font-black text-3xl text-brand-dark uppercase mt-2 tracking-tight">
              REVUELTO COUPE
            </h3>
          </div>

          {/* Supercar Visual State Mockup */}
          <div className="my-12 flex flex-col items-center justify-center relative">
            {/* Mock Car Silhouette that matches the active color */}
            <div 
              className="w-72 h-36 rounded-full blur-[40px] opacity-25 absolute top-12 transition-all duration-500 scale-125"
              style={{ backgroundColor: selectedColor.hex }}
            ></div>
            <img 
              src="/images/ezgif-frame-001.jpg" 
              alt="Revuelto Configuration Preview" 
              className="w-full max-w-md object-contain z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="border-t border-brand-dark/5 pt-6 flex justify-between items-end">
            <div>
              <p className="font-sans text-xs text-brand-dark/50 font-bold uppercase tracking-wider">
                Estimated Price
              </p>
              <h4 className="font-heading font-black text-3xl text-brand-dark mt-1">
                ${totalPrice.toLocaleString()}
              </h4>
            </div>
            <span className="font-sans text-xs text-brand-dark/40 font-semibold italic">
              Excluding local taxes
            </span>
          </div>
        </div>

        {/* Right Side: Options Panel */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase">
              Design Studio
            </span>
            <h2 className="font-heading font-black text-4xl text-brand-dark uppercase mt-2 tracking-tight">
              PERSONALIZE YOURS
            </h2>
            <p className="font-sans text-sm text-brand-dark/60 mt-3 leading-relaxed">
              Tailor the performance aesthetics of your Revuelto. Choose from official factory configurations.
            </p>

            <div className="w-12 h-1 bg-brand-orange mt-6 mb-10 rounded-full"></div>

            {/* Option 1: Paint Colors */}
            <div className="mb-8">
              <h4 className="font-heading font-extrabold text-sm text-brand-dark uppercase tracking-wider mb-4 flex justify-between">
                <span>Exterior Paint</span>
                <span className="text-brand-orange font-bold font-sans normal-case text-xs">
                  {selectedColor.name} {selectedColor.price > 0 && `(+$${selectedColor.price.toLocaleString()})`}
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-2 ${
                      selectedColor.name === color.name ? 'border-brand-dark scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full ${color.bgClass} block flex items-center justify-center text-white`}>
                      {selectedColor.name === color.name && <Check size={14} className="stroke-[3px]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 2: Wheels */}
            <div className="mb-8">
              <h4 className="font-heading font-extrabold text-sm text-brand-dark uppercase tracking-wider mb-3">
                Wheels Rims
              </h4>
              <div className="flex flex-col gap-2">
                {WHEELS.map((wheel) => (
                  <button
                    key={wheel.name}
                    onClick={() => setSelectedWheels(wheel)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                      selectedWheels.name === wheel.name
                        ? 'border-brand-dark bg-brand-dark/5 text-brand-dark'
                        : 'border-brand-dark/10 bg-transparent text-brand-dark/70 hover:border-brand-dark/30'
                    }`}
                  >
                    <span>{wheel.name}</span>
                    <span className="text-brand-orange">
                      {wheel.price === 0 ? 'Included' : `+$${wheel.price.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Interior */}
            <div className="mb-10">
              <h4 className="font-heading font-extrabold text-sm text-brand-dark uppercase tracking-wider mb-3">
                Interior Upholstery
              </h4>
              <div className="flex flex-col gap-2">
                {INTERIORS.map((interior) => (
                  <button
                    key={interior.name}
                    onClick={() => setSelectedInterior(interior)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold flex justify-between items-center transition-all cursor-pointer ${
                      selectedInterior.name === interior.name
                        ? 'border-brand-dark bg-brand-dark/5 text-brand-dark'
                        : 'border-brand-dark/10 bg-transparent text-brand-dark/70 hover:border-brand-dark/30'
                    }`}
                  >
                    <span>{interior.name}</span>
                    <span className="text-brand-orange">
                      {interior.price === 0 ? 'Included' : `+$${interior.price.toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Reservation Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-brand-orange text-white py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl hover:shadow-2xl hover:bg-brand-dark transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Proceed to Reservation</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 relative overflow-hidden border border-brand-dark/5">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-studio-bg transition-colors cursor-pointer text-brand-dark/60 hover:text-brand-dark"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles size={32} />
                </div>
                <h3 className="font-heading font-black text-2xl text-brand-dark uppercase mb-2">
                  Processing Order...
                </h3>
                <p className="font-sans text-sm text-brand-dark/50">
                  Securing production slot allocations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReserve}>
                <h3 className="font-heading font-black text-2xl text-brand-dark uppercase tracking-tight mb-2">
                  Reserve Revuelto
                </h3>
                <p className="font-sans text-xs text-brand-dark/50 leading-relaxed mb-6">
                  Submit your details below to reserve your custom slot allocation. Our specialist team will reach out within 24 hours.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block font-heading font-extrabold text-xs text-brand-dark uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={reserveName}
                      onChange={(e) => setReserveName(e.target.value)}
                      placeholder="e.g. Jean Bugatti"
                      className="w-full bg-studio-bg/60 border border-brand-dark/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-heading font-extrabold text-xs text-brand-dark uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={reserveEmail}
                      onChange={(e) => setReserveEmail(e.target.value)}
                      placeholder="e.g. jean@bugatti.com"
                      className="w-full bg-studio-bg/60 border border-brand-dark/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    />
                  </div>
                  
                  {/* Summary Box */}
                  <div className="bg-studio-bg/40 rounded-xl p-4 border border-brand-dark/5">
                    <p className="font-sans text-xs text-brand-dark/60 font-semibold flex justify-between">
                      <span>Build Total:</span>
                      <span className="text-brand-dark font-extrabold">${totalPrice.toLocaleString()}</span>
                    </p>
                    <p className="font-sans text-[10px] text-brand-dark/40 mt-1 italic">
                      Color: {selectedColor.name} | Rims: {selectedWheels.name.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-dark text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-brand-orange transition-all duration-300 cursor-pointer"
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
