import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BurgerHeroCanvas from './components/BurgerHeroCanvas';
import GourmetMenu from './components/GourmetMenu';
import CraftsmanshipBento from './components/CraftsmanshipBento';
import ReservationDrawer from './components/ReservationDrawer';
import Footer from './components/Footer';

export default function App() {
  const [cartItems, setCartItems] = useState([
    {
      id: 'wagyu-royale',
      name: 'The Wagyu Royale Smash',
      price: 24.50,
      quantity: 1,
      desc: 'Triple A5 Wagyu, 24mo Cheddar, Bourbon Bacon Jam'
    }
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('cart');

  const handleAddToCart = (dish) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item => 
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const openCart = () => {
    setDrawerTab('cart');
    setIsDrawerOpen(true);
  };

  const openReserve = () => {
    setDrawerTab('reserve');
    setIsDrawerOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#06060a] text-slate-100 font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Atmosphere Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-amber-600/10 blur-[180px]" />
        <div className="absolute top-[35%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-600/8 blur-[200px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[160px]" />
      </div>

      {/* Floating Glassmorphic Navbar */}
      <Navbar 
        cartCount={totalCartCount}
        onOpenCart={openCart}
        onOpenReserve={openReserve}
      />

      {/* Hero Canvas Component (Burger frames drawn over plate_bg.png) */}
      <BurgerHeroCanvas 
        onAddToCart={handleAddToCart}
      />

      {/* Gourmet Menu */}
      <GourmetMenu 
        onAddToCart={handleAddToCart}
      />

      {/* Craftsmanship & Diagnostics Bento */}
      <CraftsmanshipBento />

      {/* Reservation & Order Summary Drawer */}
      <ReservationDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        initialTab={drawerTab}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
