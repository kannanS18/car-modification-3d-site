import React from 'react';
import { carData } from '../data/carData';
import { Quote, CheckCircle } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 mb-2">Driver Telemetry & Verdicts</div>
        <h2 className="text-4xl sm:text-5xl font-bold font-heading uppercase text-white tracking-tight">DRIVER VERDICTS</h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {carData.testimonials.map((item, i) => (
          <div key={i} className="p-8 sm:p-10 rounded-3xl bg-[#0C1018]/90 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <Quote className="w-8 h-8 text-amber-400/70 mb-6" />
            <blockquote className="text-base sm:text-lg text-slate-200 font-body leading-relaxed mb-8 italic">
              "{item.quote}"
            </blockquote>
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={item.avatar} alt={item.author} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/40" />
                <div>
                  <div className="font-heading font-bold text-lg text-white flex items-center gap-1.5">
                    <span>{item.author}</span>
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xs text-slate-400">{item.title}</div>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {item.car}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}