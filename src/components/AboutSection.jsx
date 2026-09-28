import React from 'react';
import { carData } from '../data/carData';
import { Wrench, Shield, CheckCircle, Flame, Award, Cpu } from 'lucide-react';

export function AboutSection({ onDriveToGarage }) {
  const { about } = carData;

  const icons = [Shield, Award, Flame, Cpu];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#FF4D00]/25 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-black/70">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />

        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-xs font-mono font-bold tracking-wider text-[#FF4D00] uppercase mb-4">
            <Wrench className="w-3.5 h-3.5" />
            <span>{about.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white uppercase tracking-tight leading-tight">
            {about.title}
          </h2>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed font-body">
            {about.p1}
          </p>
          <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed font-body">
            {about.p2}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          {about.highlights.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-[#FF4D00]/40 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center text-[#FF4D00] shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white uppercase group-hover:text-[#FF4D00] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner CTA */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#FF4D00]" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-gray-300">
              Dyno Certified • FIA-Grade Safety • Complete Bespoke Warranty
            </span>
          </div>

          <button
            onClick={onDriveToGarage}
            className="px-6 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-[#FF4D00] hover:bg-[#E03B00] text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] transition-all cursor-pointer"
          >
            Enter 3D Modification Bay ↓
          </button>
        </div>
      </div>
    </section>
  );
}
