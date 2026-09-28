import React from 'react';
import { carData } from '../data/carData';
import { Gauge, Flame, Shield, Disc, Sparkles, Layers, ArrowRight } from 'lucide-react';

const icons = { Gauge, Flame, Shield, Disc, Sparkles, Layers };

export function ServicesSection({ onOpenBooking }) {
  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D00] mb-2">Performance Engineering</div>
        <h2 className="text-4xl sm:text-5xl font-bold font-heading uppercase text-white">PILLARS OF CRAFTSMANSHIP</h2>
        <div className="w-16 h-1 bg-[#FF4D00] mx-auto my-4 rounded-full" />
        <p className="text-gray-400 text-sm sm:text-base">Engineered for aerodynamic downforce, acoustic aggression, and dyno-proven power.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {carData.services.map((item, i) => {
          const Icon = icons[item.icon] || Sparkles;
          return (
            <div key={i} className="p-7 rounded-2xl glass-panel border-l-4 border-l-[#FF4D00] hover:shadow-[0_0_25px_rgba(255,77,0,0.35)] transition-all group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-400">{item.tag}</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-[#FF4D00] transition-colors">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">{item.desc}</p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-[#FF4D00]">{item.metric}</span>
                <button onClick={onOpenBooking} className="text-gray-400 group-hover:text-[#FF4D00] font-heading font-bold uppercase flex items-center gap-1">
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