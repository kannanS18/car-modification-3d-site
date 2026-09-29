import React from 'react';
import { carData } from '../data/carData';
import { ArrowRight, ChevronDown, Compass, Fuel, Gauge, Shield, Wrench } from 'lucide-react';

export function HeroSection({ onOpenBooking, onDriveToGarage, scrollProgress = 0 }) {
  const { hero } = carData;

  return (
    <div id="home" className="relative pt-28 pb-16 min-h-[90vh] flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-mono font-semibold tracking-wider text-amber-400 mb-4 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{hero.badge}</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-white uppercase leading-[1.05]">
            <span className="block">{hero.titleLine1}</span>
            <span className="block bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent mt-1">{hero.titleLine2}</span>
          </h1>

          {/* Banner Tag */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="text-amber-400 font-bold">● LIVE 3D SIMULATION:</span>
            <span>Indian Highway → Modification Bay</span>
          </div>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl font-body leading-relaxed drop-shadow">
            {hero.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={onDriveToGarage}
              className="px-7 py-3.5 rounded-xl font-heading font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all cursor-pointer group"
            >
              <Wrench className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Drive into 3D Garage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase bg-white/[0.04] text-white border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Commission Build</span>
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl glass-panel max-w-3xl border border-white/10 bg-[#0C1018]/80 backdrop-blur-md">
            {hero.metrics.map((m, i) => (
              <div key={i} className="text-left border-l-2 border-amber-400/50 pl-3">
                <div className="text-xl sm:text-2xl font-bold font-heading text-white">{m.value}</div>
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Scroll-Driven HUD Indicator at bottom of Hero */}
      <div className="pointer-events-auto mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-amber-400/25 bg-[#0C1018]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="text-xs font-heading font-bold text-white uppercase flex items-center gap-2">
              <span>Current Status:</span>
              <span className="text-amber-400 font-mono font-normal">
                {scrollProgress < 0.35
                  ? 'Highway Cruise (Cruising at 80 km/h)'
                  : scrollProgress < 0.75
                  ? 'Approaching AutoForge Workshop Doors'
                  : 'Docked on Hydraulic Lift Hoist'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Scroll down to steer the vehicle directly into the workshop bay
            </div>
          </div>
        </div>

        <button
          onClick={onDriveToGarage}
          className="flex items-center gap-2 text-xs font-mono uppercase text-amber-300 hover:text-black hover:bg-amber-400 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 transition-all cursor-pointer shrink-0 font-bold"
        >
          <span>Scroll to Drive</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </div>
  );
}