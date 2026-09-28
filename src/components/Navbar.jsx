import React, { useState } from 'react';
import { Wrench, ArrowUpRight, Menu, X, Car, Shield } from 'lucide-react';

export function Navbar({ onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[#FF4D00]/20 backdrop-blur-xl bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('top')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4D00]/20 to-[#FF4D00]/5 border border-[#FF4D00]/40 flex items-center justify-center text-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.2)]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-heading tracking-wider text-white flex items-center gap-1.5">
              <span>AUTOFORGE</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#FF4D00]/20 text-[#FF4D00] font-mono font-normal">3D</span>
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-widest font-mono text-gray-400 uppercase">
              THAR 4X4 & BESPOKE ATELIER
            </div>
          </div>
        </div>

        {/* Default Desktop Nav: Home, About, Services, Garage, Contact */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-heading font-semibold uppercase tracking-wider text-gray-300">
          <button onClick={() => scrollTo('top')} className="hover:text-[#FF4D00] transition-colors">
            Home
          </button>
          <button onClick={() => scrollTo('about')} className="hover:text-[#FF4D00] transition-colors">
            About
          </button>
          <button onClick={() => scrollTo('services')} className="hover:text-[#FF4D00] transition-colors">
            Services
          </button>
          <button onClick={() => scrollTo('workshop')} className="hover:text-[#FF4D00] text-[#FF4D00] flex items-center gap-1.5 transition-colors font-bold">
            <Car className="w-3.5 h-3.5" />
            <span>3D Garage Bay</span>
          </button>
          <button onClick={() => scrollTo('contact')} className="hover:text-[#FF4D00] transition-colors">
            Contact
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-[0_0_20px_rgba(255,77,0,0.4)] hover:shadow-[0_0_30px_rgba(255,77,0,0.6)] transition-all cursor-pointer"
          >
            <span>Commission Build</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white glass-panel"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#FF4D00]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-[#FF4D00]/20 px-6 py-5 space-y-4 backdrop-blur-2xl bg-black/90">
          <button
            onClick={() => scrollTo('top')}
            className="block w-full text-left text-sm font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-[#FF4D00]"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="block w-full text-left text-sm font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-[#FF4D00]"
          >
            About
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="block w-full text-left text-sm font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-[#FF4D00]"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo('workshop')}
            className="block w-full text-left text-sm font-heading font-bold uppercase tracking-wider text-[#FF4D00] flex items-center gap-2"
          >
            <Car className="w-4 h-4" />
            <span>3D Garage Bay</span>
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="block w-full text-left text-sm font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-[#FF4D00]"
          >
            Contact
          </button>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-[#FF4D00] text-white shadow-lg"
            >
              <span>Commission Build</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}