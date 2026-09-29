import React from 'react';
import { carData } from '../data/carData';
import { Gauge, Flame, Shield, Disc, Sparkles, Layers, ArrowRight, Volume2, Lightbulb } from 'lucide-react';

const icons = { Gauge, Flame, Shield, Disc, Sparkles, Layers, Volume2, Lightbulb };

export function ServicesSection({ onOpenBooking }) {
  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-2">Performance Engineering</div>
        <h2 className="text-4xl sm:text-5xl font-extrabold font-heading uppercase text-white">PILLARS OF CRAFTSMANSHIP</h2>
        <div className="w-16 h-1 bg-amber-500 mx-auto my-4 rounded-full" />
        <p className="text-slate-300 text-sm sm:text-base">Engineered for aerodynamic downforce, acoustic aggression, and dyno-proven power.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {carData.services.map((item, i) => {
          const Icon = icons[item.icon] || Sparkles;
          return (
            <div key={i} className="p-7 rounded-2xl glass-panel border border-white/10 border-l-4 border-l-amber-500 hover:border-amber-400/40 transition-all group bg-[#0F131C]/90 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300">{item.tag}</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-amber-300 transition-colors">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">{item.desc}</p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400">{item.metric}</span>
                <button onClick={onOpenBooking} className="text-slate-400 group-hover:text-amber-400 font-bold uppercase flex items-center gap-1 cursor-pointer">
                  <span>Inquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}