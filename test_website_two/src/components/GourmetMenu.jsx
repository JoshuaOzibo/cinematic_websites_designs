import React, { useState } from 'react';
import { Flame, Plus, Check, Star, Sparkles, Filter, Info, ChevronRight, X } from 'lucide-react';

const MENU_CATEGORIES = [
  { id: 'all', label: 'All Creations' },
  { id: 'smash', label: 'Signature Smash' },
  { id: 'luxury', label: 'Dry-Aged Luxury' },
  { id: 'sides', label: 'Artisan Sides' },
  { id: 'drinks', label: 'Craft Shakes & Elixirs' }
];

const DISHES = [
  {
    id: 'wagyu-royale',
    category: 'smash',
    name: 'The Wagyu Royale Smash',
    tagline: 'Chef’s Flagship Masterpiece',
    price: 24.50,
    rating: 4.98,
    reviews: 342,
    desc: 'Triple A5 Japanese Wagyu smash patties, 24-month vintage cheddar, bourbon bacon jam, and house garlic confit aioli on toasted Hokkaido brioche.',
    badge: 'MOST POPULAR',
    flavorProfile: { Smokiness: 95, Umami: 98, Crunch: 90, Spice: 45 },
    ingredients: ['Triple A5 Wagyu', '24mo Aged Cheddar', 'Bourbon Bacon Jam', 'Truffle Confit Aioli', 'Toasted Brioche']
  },
  {
    id: 'truffle-marrow',
    category: 'luxury',
    name: 'Black Truffle & Bone Marrow',
    tagline: 'Decadent & Earthy',
    price: 28.00,
    rating: 4.95,
    reviews: 189,
    desc: 'Double dry-aged beef smash patties infused with roasted bone marrow butter, sautéed wild chanterelles, aged Gruyère, and black winter truffle glaze.',
    badge: 'CHEF’S RESERVE',
    flavorProfile: { Smokiness: 88, Umami: 100, Crunch: 82, Spice: 20 },
    ingredients: ['Double Dry-Aged Beef', 'Bone Marrow Butter', 'Chanterelle Mushrooms', 'Aged Gruyère', 'Black Truffle Glaze']
  },
  {
    id: 'chipotle-inferno',
    category: 'smash',
    name: 'Chipotle Fire & Honey Smash',
    tagline: 'Sweet Heat Harmony',
    price: 21.50,
    rating: 4.89,
    reviews: 214,
    desc: 'Double smash patties, smoked ghost pepper jack cheese, crispy jalapeño chips, charred scallion relish, and hot habanero honey drizzle.',
    badge: 'FIERY & CRISPY',
    flavorProfile: { Smokiness: 92, Umami: 85, Crunch: 95, Spice: 92 },
    ingredients: ['Double Smash Beef', 'Pepper Jack Cheese', 'Crispy Jalapeños', 'Charred Scallion Relish', 'Hot Habanero Honey']
  },
  {
    id: 'smoked-umami-plant',
    category: 'smash',
    name: 'Artisan Smoked Umami Plant',
    tagline: '100% Plant-Crafted Luxury',
    price: 19.00,
    rating: 4.91,
    reviews: 156,
    desc: 'House-made slow-smoked black bean & maitake mushroom patty, caramelized onion jam, vegan truffle gouda, and organic watercress on vegan brioche.',
    badge: 'PLANT BASED',
    flavorProfile: { Smokiness: 85, Umami: 94, Crunch: 88, Spice: 30 },
    ingredients: ['Maitake & Black Bean Patty', 'Caramelized Onion Jam', 'Vegan Truffle Gouda', 'Watercress', 'Vegan Brioche']
  },
  {
    id: 'duck-fat-fries',
    category: 'sides',
    name: 'Duck Fat Rosemary Fries',
    tagline: 'Triple-Cooked Gold',
    price: 9.50,
    rating: 4.97,
    reviews: 512,
    desc: 'Hand-cut Idaho Yukon Gold potatoes fried three times in rendered duck fat, tossed with flash-fried rosemary and smoked Maldon sea salt.',
    badge: 'MUST TRY SIDE',
    flavorProfile: { Smokiness: 80, Umami: 90, Crunch: 98, Spice: 10 },
    ingredients: ['Yukon Gold Potatoes', 'Rendered Duck Fat', 'Flash-Fried Rosemary', 'Smoked Maldon Salt', 'Truffle Dip']
  },
  {
    id: 'bourbon-shake',
    category: 'drinks',
    name: 'Smoked Bourbon Caramel Shake',
    tagline: 'Velvety & Indulgent',
    price: 11.00,
    rating: 4.96,
    reviews: 278,
    desc: 'Small-batch Madagascar vanilla bean ice cream spun with house smoked bourbon caramel, topped with espresso whipped cream and candied bacon bits.',
    badge: 'CRAFT SHAKE',
    flavorProfile: { Smokiness: 70, Umami: 60, Crunch: 85, Spice: 15 },
    ingredients: ['Madagascar Vanilla Ice Cream', 'Smoked Bourbon Caramel', 'Espresso Cream', 'Candied Bacon Crunch']
  }
];

export default function GourmetMenu({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [addedIds, setAddedIds] = useState({});

  const filteredDishes = activeCategory === 'all' 
    ? DISHES 
    : DISHES.filter(d => d.category === activeCategory);

  const handleAdd = (dish) => {
    onAddToCart(dish);
    setAddedIds(prev => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [dish.id]: false }));
    }, 1500);
  };

  return (
    <section id="menu" className="relative z-20 py-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-4">
          <Flame size={14} className="text-amber-500 fill-amber-500" />
          <span className="font-sans text-[10px] font-extrabold tracking-[0.25em] text-amber-500 uppercase">
            GASTRONOMIC SELECTION
          </span>
        </div>

        <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-white uppercase tracking-tight italic">
          THE ARTISAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">MENU</span>
        </h2>
        
        <p className="font-sans text-sm md:text-base text-slate-300 mt-4 leading-relaxed font-light">
          Every burger is individually smashed to order on 475°F seasoned steel griddles to achieve maximum caramelized crust and peak marrow juiciness.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
        {MENU_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-full font-sans text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                : 'glass-panel text-slate-300 hover:text-white hover:border-amber-500/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDishes.map((dish) => (
          <div 
            key={dish.id}
            className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/15 transition-colors" />

            <div>
              {/* Badge & Rating */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {dish.badge}
                </span>
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/5 text-amber-400">
                  <Star size={12} className="fill-amber-400" />
                  <span className="font-mono text-xs font-bold">{dish.rating}</span>
                  <span className="text-[10px] text-slate-400">({dish.reviews})</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-heading font-extrabold text-2xl text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                {dish.name}
              </h3>
              <span className="font-sans text-xs font-semibold text-amber-500/90 block mt-0.5 mb-3">
                {dish.tagline}
              </span>

              <p className="font-sans text-xs text-slate-300 leading-relaxed font-light mb-6">
                {dish.desc}
              </p>

              {/* Flavor Profile Indicators */}
              <div className="grid grid-cols-2 gap-2 mb-6 bg-black/30 p-3 rounded-xl border border-white/5">
                {Object.entries(dish.flavorProfile).slice(0, 2).map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{key}</span>
                      <span className="text-amber-400 font-bold">{val}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Footer: Price & Add Button */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-sans text-slate-400 uppercase tracking-wider">PRICE</span>
                <span className="font-mono font-extrabold text-2xl text-white">
                  ${dish.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDish(dish)}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="View Ingredients"
                >
                  <Info size={16} />
                </button>

                <button
                  onClick={() => handleAdd(dish)}
                  className={`px-5 py-3 rounded-full font-sans text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    addedIds[dish.id]
                      ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-105 shadow-[0_4px_15px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  {addedIds[dish.id] ? (
                    <>
                      <Check size={15} />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      <span>Add to Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dish Ingredient Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg glass-card border border-amber-500/30 rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
            
            <button 
              onClick={() => setSelectedDish(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {selectedDish.badge}
            </span>

            <h3 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight mt-3">
              {selectedDish.name}
            </h3>
            
            <p className="font-sans text-xs text-amber-400 font-semibold mb-4">
              {selectedDish.tagline} • ${selectedDish.price.toFixed(2)}
            </p>

            <p className="font-sans text-xs text-slate-300 leading-relaxed font-light mb-6">
              {selectedDish.desc}
            </p>

            <div className="border-t border-white/10 pt-4 mb-6">
              <span className="font-sans text-xs font-bold text-white uppercase tracking-wider block mb-3">
                Crafted Ingredients:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedDish.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs font-sans bg-white/5 border border-white/10 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500" />
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleAdd(selectedDish);
                  setSelectedDish(null);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-sans text-xs font-extrabold uppercase tracking-widest shadow-[0_8px_25px_rgba(245,158,11,0.4)] cursor-pointer"
              >
                Add {selectedDish.name} • ${selectedDish.price.toFixed(2)}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
