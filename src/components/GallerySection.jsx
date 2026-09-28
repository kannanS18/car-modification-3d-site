import React, { useState } from 'react';
import { carData } from '../data/carData';
import { Eye, ExternalLink } from 'lucide-react';

export function GallerySection({ onOpenBooking }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Widebody', 'Track Spec', 'Twin Turbo'];

  const filtered = filter === 'All' ? carData.gallery : carData.gallery.filter(i => i.category === filter);

  return (
    <section id="gallery" className="py-24 bg-[#0E0E10] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D00] mb-2">Commission Portfolio</div>
            <h2 className="text-4xl sm:text-5xl font-bold font-heading uppercase text-white">THE BESPOKE ARCHIVE</h2>
            <p className="text-gray-400 text-sm mt-1">Recent builds completed in our Silverstone skunkworks atelier.</p>
          </div>
          <div className="flex gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${filter === c ? 'bg-[#FF4D00] text-white shadow-md' : 'glass-panel text-gray-400 hover:text-white'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-[#FF4D00] transition-all flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-[#FF4D00] text-white text-[10px] font-mono font-bold uppercase">{item.badge}</div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#FF4D00] transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.specs}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#FF4D00]">{item.category}</span>
                  <button onClick={onOpenBooking} className="text-gray-400 hover:text-white flex items-center gap-1 font-heading uppercase">
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