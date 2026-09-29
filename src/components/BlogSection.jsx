import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, Tag, Sparkles, Flame, Wrench, Shield, CheckCircle } from 'lucide-react';

export function BlogSection({ onOpenBooking }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ['All', 'Performance Tuning', '4x4 Expedition', 'Wheel & Tyre Tech', 'Bespoke Finishing'];

  const articles = [
    {
      id: 'thar-ladakh-expedition',
      category: '4x4 Expedition',
      title: 'Building the High-Altitude Thar 4x4: Ladakh Expedition Spec',
      excerpt: 'How we engineered a stage-3 nitrogen remote-reservoir suspension, 35" all-terrain beadlocks, and an integrated recovery winch for 18,000ft Himalayan passes.',
      readTime: '7 min read',
      date: 'Sept 2026',
      author: 'Vikram Sethi • Chief Overland Engineer',
      featured: true,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      badge: 'FLAGSHIP BUILD LOG',
      content: `The Himalayan terrain demands uncompromised engineering. Standard damping units overheat and cavitate within 45 minutes of washboard corrugations at sub-zero temperatures. 

For our Ladakh Expedition Specification, we recalibrated the Mahindra Thar 4x4 chassis with 2.5" mono-tube shock absorbers with external finned reservoirs, filled with aerospace-grade nitrogen at 200 PSI. 

Key Upgrades Installed:
• +3.5" Progressive Coils with Hydraulic Bump Stops
• Forged 17" Beadlock Wheels with 315/70R17 All-Terrain Compound
• Integrated 9,500lb Synthetic Rope Winch in Laser-Cut High-Tensile Steel Bumper
• High-Output 50" Quad Roof Spot Pods with Amber Dust Penetration Mode
• Dual Aux Battery Management with 2000W Inverter for Field Diagnostics.`,
    },
    {
      id: 'ferrari-twin-turbo',
      category: 'Performance Tuning',
      title: 'Precision Calibration: Squeezing 720HP from the Mid-Engine V8',
      excerpt: 'Dyno tuning valvetronic Inconel exhaust manifolds, high-flow twin turbos, and custom engine maps without sacrificing atmospheric throttle response.',
      readTime: '6 min read',
      date: 'Sept 2026',
      author: 'Marco Bellini • Powertrain Director',
      featured: false,
      image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80',
      badge: 'DYNO TUNING',
      content: `Extracting reliable forced-induction horsepower from an Italian naturally aspirated masterpiece requires millimetric precision. We paired lightweight ceramic ball-bearing turbos with bespoke equal-length Inconel manifolds.

By monitoring exhaust gas temperatures across all 8 cylinders simultaneously, our live telemetry calibration holds a flat 720 Nm torque curve from 3,200 RPM to the 8,800 RPM redline.`,
    },
    {
      id: 'wheel-tech-forged-vs-cast',
      category: 'Wheel & Tyre Tech',
      title: 'Forged Monoblock vs Flow-Formed: Unsprung Mass Explained',
      excerpt: 'Why saving 4.2kg per corner transforms steering fidelity, braking thresholds, and suspension response more than 50hp of engine tuning.',
      readTime: '5 min read',
      date: 'Aug 2026',
      author: 'Arjun Ray • Chassis Dynamics',
      featured: false,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      badge: 'TECHNICAL ANALYSIS',
      content: `Rotational unsprung weight carries an inertia penalty four times higher than static curb weight. When a vehicle hits a mid-corner bump, the damper must decelerate both the upward velocity of the wheel and control tire contact patch deformation.

Our 10,000-ton forged aerospace 6061-T6 monoblock wheels eliminate grain boundary porosity, enabling ultra-thin spokes with 40% higher tensile rigidity compared to conventional gravity-cast wheels.`,
    },
    {
      id: 'acoustic-cabin-dynamics',
      category: 'Bespoke Finishing',
      title: 'Acoustic Enclosure Tuning: 2000W Sound in Rugged Cabins',
      excerpt: 'Dampening resonant steel body panels and tuning marine-grade subwoofers for audiophile-grade bass that cuts through wind and road rumble.',
      readTime: '5 min read',
      date: 'Aug 2026',
      author: 'Siddharth Nair • Audio Architect',
      featured: false,
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      badge: 'INTERIOR ATELIER',
      content: `Off-road cabins with removable roof panels present the hardest acoustic challenges in automotive design. High-speed wind buffeting and chassis vibration cancel low-frequency soundwaves.

Our tailored 2000W acoustic packages utilize multi-layer butyl dampening sheets with closed-cell foam decouplers, feeding twin 12" composite cone subwoofers housed in sealed Birch ply tailgate enclosures.`,
    },
    {
      id: 'multi-stage-ceramic-armor',
      category: 'Bespoke Finishing',
      title: 'Obsidian Matte & 9H Ceramic Armor: The Science of Protection',
      excerpt: 'Hydrophobic nano-coatings, self-healing polyurethane PPF wraps, and multi-stage paint correction for scratch resistance in extreme trails.',
      readTime: '4 min read',
      date: 'July 2026',
      author: 'Elena Rostova • Surface Finish Specialist',
      featured: false,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      badge: 'COATINGS',
      content: `Trail branches, flying gravel, and acidic mud will destroy unprotected clear coat in a single weekend. Our multi-stage process begins with 3-step rotary micro-abrasive compounding to remove all orange peel and factory surface imperfections.

We then apply 10-mil self-healing thermoplastic polyurethane film across high-impact strike zones, sealed beneath twin coats of 9H siloxane ceramic matrix.`,
    },
    {
      id: 'nitrogen-reservoir-valving',
      category: '4x4 Expedition',
      title: 'Shock Valving Secrets: High-Speed vs Low-Speed Damping',
      excerpt: 'Understanding shim stacks, bypass bleed holes, and how to dial in zero-body-roll on tarmac while soaking up harsh rock drops.',
      readTime: '6 min read',
      date: 'July 2026',
      author: 'Vikram Sethi • Chief Overland Engineer',
      featured: false,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      badge: 'CHASSIS ENGINEERING',
      content: `Body roll in turns is controlled by low-speed damping (0–2 inches/second shaft speed), whereas sharp rock impacts occur at high shaft speeds (10–50 inches/second).

By using dual-stage deflective disc shim stacks, our custom valving provides firm, responsive highway manners while instantly blowing open on sudden ledge drops to prevent shock hydraulic lock.`,
    },
  ];

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ATELIER JOURNAL & BUILD LOGS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white uppercase tracking-tight">
          Engineering, Track Tests & <span className="theme-gradient-text">Build Logs</span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-300 font-body">
          Technical breakdowns, overland expedition reports, and performance tuning masterclasses direct from the AutoForge workshop floor.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Article Card */}
      {filteredArticles.find((a) => a.featured) && (
        <div className="mb-12">
          {(() => {
            const feat = filteredArticles.find((a) => a.featured) || filteredArticles[0];
            return (
              <div
                onClick={() => setSelectedArticle(feat)}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#121620]/90 backdrop-blur-xl shadow-2xl cursor-pointer hover:border-amber-400/40 transition-all grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-md bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg">
                      {feat.badge}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold mb-3">
                      <span>{feat.category}</span>
                      <span>•</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {feat.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white uppercase group-hover:text-amber-300 transition-colors leading-tight">
                      {feat.title}
                    </h2>

                    <p className="mt-4 text-sm text-slate-300 leading-relaxed font-body">
                      {feat.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      <div className="font-semibold text-white">{feat.author}</div>
                      <div>{feat.date}</div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Read Build Log</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles
          .filter((a) => !a.featured || activeCategory !== 'All')
          .map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#121620]/90 backdrop-blur-xl shadow-xl hover:border-amber-400/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-white/10">
                      {art.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold mb-2">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span className="text-slate-400">{art.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white uppercase group-hover:text-amber-300 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{art.date}</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Spec</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#121620] shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-3">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">
                {selectedArticle.category}
              </span>
              <span>•</span>
              <span className="text-slate-400">{selectedArticle.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white uppercase leading-tight mb-4">
              {selectedArticle.title}
            </h2>

            <div className="text-xs text-slate-400 pb-4 mb-6 border-b border-white/10 flex items-center justify-between">
              <span>{selectedArticle.author}</span>
              <span>{selectedArticle.date}</span>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden mb-6">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-body space-y-4">
              {selectedArticle.content}
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                Close Article
              </button>

              {onOpenBooking && (
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-950/40"
                >
                  Commission This Spec
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
