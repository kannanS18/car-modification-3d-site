import React, { useState } from 'react';
import { carData } from '../data/carData';
import { Eye, ExternalLink } from 'lucide-react';

export function GallerySection({ onOpenBooking }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', '4x4 Off-Road', 'Motorsport GT', 'Urban Stealth'];

  const filtered = filter === 'All' ? carData.gallery : carData.gallery.filter(i => i.category === filter);

  return (
    <section id="gallery" className="py-24 bg-[#080B11] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 mb-2">Commission Portfolio</div>
            <h2 className="text-4xl sm:text-5xl font-bold font-heading uppercase text-white tracking-tight">THE BESPOKE ARCHIVE</h2>
            <p className="text-slate-400 text-sm mt-1">Recent bespoke builds completed in our Silverstone engineering atelier.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  filter === c
                    ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden bg-[#0D111A]/90 border border-white/10 hover:border-amber-400/40 hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)] transition-all flex flex-col">
              <div className="relative h-64 overflow-hidden bg-black/40">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500/90 backdrop-blur-md text-black text-[10px] font-mono font-extrabold uppercase tracking-wider">{item.badge}</div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-amber-400 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.specs}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400/90 font-medium text-[11px] uppercase tracking-wider">{item.category}</span>
                  <button onClick={onOpenBooking} className="text-slate-400 hover:text-amber-300 flex items-center gap-1 font-heading uppercase tracking-wider transition-colors cursor-pointer">
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}