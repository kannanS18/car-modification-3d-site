import React from 'react';
import { carData } from '../data/carData';
import { Quote, CheckCircle } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D00] mb-2">Driver Telemetry & Verdicts</div>
        <h2 className="text-4xl sm:text-5xl font-bold font-heading uppercase text-white">DRIVER VERDICTS</h2>
        <div className="w-16 h-1 bg-[#FF4D00] mx-auto my-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {carData.testimonials.map((item, i) => (
          <div key={i} className="p-8 sm:p-10 rounded-3xl glass-panel border border-[#FF4D00]/20 flex flex-col justify-between">
            <Quote className="w-8 h-8 text-[#FF4D00] mb-6" />
            <blockquote className="text-base sm:text-lg text-white font-body leading-relaxed mb-8 italic">
              "{item.quote}"
            </blockquote>
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={item.avatar} alt={item.author} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF4D00]" />
                <div>
                  <div className="font-heading font-bold text-lg text-white flex items-center gap-1.5">
                    <span>{item.author}</span>
                    <CheckCircle className="w-4 h-4 text-[#FF4D00]" />
                  </div>
                  <div className="text-xs text-gray-400">{item.title}</div>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#FF4D00]/15 text-[#FF4D00] border border-[#FF4D00]/30">
                {item.car}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}