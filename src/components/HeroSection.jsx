import React from 'react';
import { carData } from '../data/carData';
import { ArrowRight, ChevronDown } from 'lucide-react';

export function HeroSection({ onOpenBooking }) {
  const { hero } = carData;
  return (
    <div className="relative pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-mono font-semibold tracking-wider text-[#FF4D00] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
          <span>{hero.badge}</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-heading tracking-tight text-white uppercase leading-none">
            <span className="block">{hero.titleLine1}</span>
            <span className="block theme-gradient-text mt-1">{hero.titleLine2}</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-2xl font-body leading-relaxed">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-xl font-heading font-bold text-sm tracking-wider uppercase flex items-center gap-3 bg-gradient-to-r from-[#FF4D00] to-[#E03B00] text-white shadow-xl hover:shadow-[0_0_30px_rgba(255,77,0,0.6)] transition-all"
            >
              <span>{hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#services"
              className="px-6 py-4 rounded-xl font-heading font-bold text-sm tracking-wider uppercase glass-panel text-white hover:border-[#FF4D00] transition-all flex items-center gap-2"
            >
              <span>Explore Pillars</span>
              <ChevronDown className="w-4 h-4 text-[#FF4D00]" />
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl glass-panel max-w-3xl">
            {hero.metrics.map((m, i) => (
              <div key={i} className="text-left">
                <div className="text-2xl sm:text-3xl font-bold font-heading text-white">{m.value}</div>
                <div className="text-[11px] font-mono uppercase text-gray-400 tracking-wider mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}