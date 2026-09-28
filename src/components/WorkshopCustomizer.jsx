import React, { useState } from 'react';
import {
  Sliders, Wrench, Volume2, Shield, Lightbulb, Disc, ArrowUpCircle, Sparkles, Check
} from 'lucide-react';

export function WorkshopCustomizer({
  carModel, setCarModel,
  carColor, setCarColor,
  wheelFinish, setWheelFinish,
  ledBarActive, setLedBarActive,
  bullBarActive, setBullBarActive,
  subwooferActive, setSubwooferActive,
  roofRackActive, setRoofRackActive,
  liftActive, setLiftActive,
  underglow, setUnderglow,
  headlights, setHeadlights,
  drlColor, setDrlColor,
}) {
  const [activeTab, setActiveTab] = useState('car');

  const paintSwatches = [
    { name: 'Napoli Racing Red', hex: '#DC2626' },
    { name: 'Rocky Desert Sand (Thar)', hex: '#C2A382' },
    { name: 'Stealth Satin Black', hex: '#141416' },
    { name: 'Army Camo Green', hex: '#2D442D' },
    { name: 'Metallic Pearl White', hex: '#F1F5F9' },
    { name: 'Riviera Electric Blue', hex: '#0284C7' },
  ];

  const drlColors = [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Amber Turn Indicator', hex: '#F59E0B' },
    { name: 'Demon Eye Red', hex: '#EF4444' },
    { name: 'Ice Blue Xenon', hex: '#38BDF8' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-[#FF4D00]/40 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF4D00] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse" />
            <span>Interactive Modification Bay</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white uppercase mt-1">
            Real-Life Garage Customizer
          </h3>
        </div>

        {/* Hydraulic Hoist Quick Toggle */}
        <button
          onClick={() => setLiftActive(!liftActive)}
          className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 border transition-all ${
            liftActive
              ? 'bg-[#1D4ED8] text-white border-blue-400 shadow-[0_0_20px_rgba(29,78,216,0.6)]'
              : 'glass-panel text-gray-300 border-white/10 hover:border-blue-400'
          }`}
        >
          <ArrowUpCircle className={`w-4 h-4 ${liftActive ? 'animate-bounce' : ''}`} />
          <span>{liftActive ? 'Lower Hoist Lift' : 'Raise Hydraulic Lift'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'car', label: '1. Platform', icon: Wrench },
          { id: 'paint', label: '2. Paint & Wrap', icon: Sparkles },
          { id: 'wheels', label: '3. Wheels & Rims', icon: Disc },
          { id: 'lights', label: '4. Lights & DRL', icon: Lightbulb },
          { id: 'audio', label: '5. Audio & Armor', icon: Volume2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-heading font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-[#FF4D00] text-white shadow-lg scale-102'
                  : 'bg-black/30 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* 1. PLATFORM SELECTOR */}
        {activeTab === 'car' && (
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase text-gray-400 block">
              Choose Base Vehicle Platform:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setCarModel('thar')}
                className={`p-5 rounded-2xl border text-left transition-all flex items-start justify-between ${
                  carModel === 'thar'
                    ? 'border-[#FF4D00] bg-[#FF4D00]/15 shadow-[0_0_25px_rgba(255,77,0,0.25)]'
                    : 'glass-panel border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D00] font-bold">
                    India’s #1 Modified Icon
                  </div>
                  <h4 className="text-xl font-bold font-heading text-white mt-1">
                    Mahindra Thar 4x4 Off-Road Edition
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Ladder-frame chassis, mud-terrain tires, roof LED bar, bull bar, and boot subwoofers.
                  </p>
                </div>
                {carModel === 'thar' && <Check className="w-5 h-5 text-[#FF4D00]" />}
              </button>

              <button
                onClick={() => setCarModel('ferrari')}
                className={`p-5 rounded-2xl border text-left transition-all flex items-start justify-between ${
                  carModel === 'ferrari'
                    ? 'border-[#FF4D00] bg-[#FF4D00]/15 shadow-[0_0_25px_rgba(255,77,0,0.25)]'
                    : 'glass-panel border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                    Supercar Motorsport Spec
                  </div>
                  <h4 className="text-xl font-bold font-heading text-white mt-1">
                    Ferrari 458 Italia GT3
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Naturally aspirated V8, dry carbon aero, titanium valved exhaust, and monoblock centerlocks.
                  </p>
                </div>
                {carModel === 'ferrari' && <Check className="w-5 h-5 text-[#FF4D00]" />}
              </button>
            </div>
          </div>
        )}

        {/* 2. PAINT & WRAP */}
        {activeTab === 'paint' && (
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase text-gray-400 block">
              Bespoke Ceramic Paint & Vinyl Wrap:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {paintSwatches.map((swatch) => (
                <button
                  key={swatch.hex}
                  onClick={() => setCarColor(swatch.hex)}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    carColor === swatch.hex
                      ? 'border-[#FF4D00] bg-[#FF4D00]/10 shadow-md'
                      : 'border-white/10 hover:border-white/30 bg-black/20'
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full border-2 border-white/20 shrink-0 shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="text-left">
                    <div className="text-xs font-heading font-bold text-white leading-tight">
                      {swatch.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. WHEELS & RIMS */}
        {activeTab === 'wheels' && (
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase text-gray-400 block">
              Forged Wheel Alloy Finishes:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'gold', name: 'Forged Monaco Gold' },
                { id: 'black', name: 'Stealth Matte Black' },
                { id: 'silver', name: 'Diamond-Cut Silver' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWheelFinish(w.id)}
                  className={`py-3 px-4 rounded-xl border text-center text-xs font-mono uppercase transition-all ${
                    wheelFinish === w.id
                      ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold shadow-md'
                      : 'border-white/10 text-gray-400 hover:text-white bg-black/20'
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. LIGHTS & DRL */}
        {activeTab === 'lights' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-heading font-bold text-white">Roof Matrix LED Light Bar</div>
                  <div className="text-[11px] text-gray-400">High-intensity off-road auxiliary beam</div>
                </div>
                <input
                  type="checkbox"
                  checked={ledBarActive}
                  onChange={(e) => setLedBarActive(e.target.checked)}
                  className="accent-[#FF4D00] w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-heading font-bold text-white">Neon Floor Underglow Kit</div>
                  <div className="text-[11px] text-gray-400">Atmospheric reflection on garage epoxy floor</div>
                </div>
                <input
                  type="checkbox"
                  checked={underglow}
                  onChange={(e) => setUnderglow(e.target.checked)}
                  className="accent-[#FF4D00] w-5 h-5 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-gray-400 block mb-2">
                Projector Headlight & DRL Halo Ring Color:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {drlColors.map((drl) => (
                  <button
                    key={drl.hex}
                    onClick={() => setDrlColor(drl.hex)}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                      drlColor === drl.hex
                        ? 'border-[#FF4D00] bg-[#FF4D00]/20 text-white font-bold'
                        : 'border-white/10 text-gray-400 hover:text-white bg-black/20'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: drl.hex }} />
                    <span className="truncate">{drl.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. AUDIO & ARMOR */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-heading font-bold text-white">Boot Subwoofer Box ("Extra Speakers")</div>
                <div className="text-[11px] text-gray-400">Dual 12" high-output bass enclosure</div>
              </div>
              <input
                type="checkbox"
                checked={subwooferActive}
                onChange={(e) => setSubwooferActive(e.target.checked)}
                className="accent-[#FF4D00] w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-heading font-bold text-white">Steel Bull Bar & Winch</div>
                <div className="text-[11px] text-gray-400">Heavy-duty front impact armor</div>
              </div>
              <input
                type="checkbox"
                checked={bullBarActive}
                onChange={(e) => setBullBarActive(e.target.checked)}
                className="accent-[#FF4D00] w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-heading font-bold text-white">Roof Expedition Rack</div>
                <div className="text-[11px] text-gray-400">Basket with red & green jerry cans</div>
              </div>
              <input
                type="checkbox"
                checked={roofRackActive}
                onChange={(e) => setRoofRackActive(e.target.checked)}
                className="accent-[#FF4D00] w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
