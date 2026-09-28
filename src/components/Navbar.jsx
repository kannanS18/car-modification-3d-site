import React from 'react';
import { Wrench, ArrowUpRight } from 'lucide-react';

export function Navbar({ onOpenBooking }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-[#FF4D00]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/40 flex items-center justify-center text-[#FF4D00]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading tracking-wider text-white">AUTOFORGE</div>
            <div className="text-[10px] tracking-widest font-mono text-gray-400 uppercase">BESPOKE MOTORSPORT ATELIER</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-heading font-semibold uppercase tracking-wider text-gray-400">
          <a href="#services" className="hover:text-white transition-colors">Craftsmanship</a>
          <a href="#gallery" className="hover:text-white transition-colors">Bespoke Archive</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Verdicts</a>
          <a href="#contact" className="hover:text-white transition-colors">Workshop</a>
        </nav>

        <button
          onClick={onOpenBooking}
          className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-[0_0_20px_rgba(255,77,0,0.4)] hover:shadow-[0_0_30px_rgba(255,77,0,0.6)] transition-all"
        >
          <span>Commission Build</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}