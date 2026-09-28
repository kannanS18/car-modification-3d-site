import React from 'react';
import { WorkshopCustomizer } from './WorkshopCustomizer';
import { Wrench, Sparkles, RotateCw, CheckCircle, ArrowRight } from 'lucide-react';

export function WorkshopSection({
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
  onOpenBooking,
}) {
  // Presets
  const applyPreset = (preset) => {
    if (preset === 'thar-expedition') {
      setCarModel('thar');
      setCarColor('#C2A382'); // Desert Sand
      setWheelFinish('black');
      setLedBarActive(true);
      setBullBarActive(true);
      setSubwooferActive(true);
      setRoofRackActive(true);
      setLiftActive(true);
      setUnderglow(true);
      setDrlColor('#FFFFFF');
    } else if (preset === 'thar-stealth') {
      setCarModel('thar');
      setCarColor('#141416'); // Stealth Black
      setWheelFinish('black');
      setLedBarActive(true);
      setBullBarActive(true);
      setSubwooferActive(true);
      setRoofRackActive(false);
      setLiftActive(false);
      setUnderglow(true);
      setDrlColor('#EF4444'); // Demon Red
    } else if (preset === 'ferrari-gt') {
      setCarModel('ferrari');
      setCarColor('#DC2626'); // Rosso Corsa Red
      setWheelFinish('gold');
      setLedBarActive(false);
      setBullBarActive(false);
      setSubwooferActive(true);
      setRoofRackActive(false);
      setLiftActive(true);
      setUnderglow(true);
      setDrlColor('#38BDF8'); // Ice Blue
    }
  };

  return (
    <section id="workshop" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D00]/15 border border-[#FF4D00]/40 text-xs font-mono font-bold tracking-wider text-[#FF4D00] uppercase mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>3D Interactive Workshop Bay</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white uppercase tracking-tight">
          Customize In The Garage
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-300 font-body">
          The vehicle is safely positioned over the 2-post hydraulic lift. Toggle real-life garage upgrades:
          extra boot subwoofers, matrix roof light bars, bull bars, wheel finishes, and elevate the car.
        </p>

        {/* Quick Style Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-xs font-mono uppercase text-gray-400 mr-1">Quick Presets:</span>
          <button
            onClick={() => applyPreset('thar-expedition')}
            className="px-3.5 py-1.5 rounded-lg glass-panel border border-[#FF4D00]/40 hover:bg-[#FF4D00]/20 text-xs font-heading uppercase text-white transition-all cursor-pointer"
          >
            🏔️ Thar Overland Expedition
          </button>
          <button
            onClick={() => applyPreset('thar-stealth')}
            className="px-3.5 py-1.5 rounded-lg glass-panel border border-white/20 hover:bg-white/10 text-xs font-heading uppercase text-white transition-all cursor-pointer"
          >
            🥷 Thar Demon Eye Stealth
          </button>
          <button
            onClick={() => applyPreset('ferrari-gt')}
            className="px-3.5 py-1.5 rounded-lg glass-panel border border-yellow-500/40 hover:bg-yellow-500/20 text-xs font-heading uppercase text-yellow-300 transition-all cursor-pointer"
          >
            🏎️ Ferrari GT3 Monoblock
          </button>
        </div>
      </div>

      {/* Main Customizer Control Panel */}
      <div className="relative">
        <WorkshopCustomizer
          carModel={carModel} setCarModel={setCarModel}
          carColor={carColor} setCarColor={setCarColor}
          wheelFinish={wheelFinish} setWheelFinish={setWheelFinish}
          ledBarActive={ledBarActive} setLedBarActive={setLedBarActive}
          bullBarActive={bullBarActive} setBullBarActive={setBullBarActive}
          subwooferActive={subwooferActive} setSubwooferActive={setSubwooferActive}
          roofRackActive={roofRackActive} setRoofRackActive={setRoofRackActive}
          liftActive={liftActive} setLiftActive={setLiftActive}
          underglow={underglow} setUnderglow={setUnderglow}
          headlights={headlights} setHeadlights={setHeadlights}
          drlColor={drlColor} setDrlColor={setDrlColor}
        />

        {/* Floating 3D Navigation Hint */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-[#FF4D00] animate-spin" style={{ animationDuration: '10s' }} />
            <span>Interactive 3D View: Click & drag background to rotate 360°, scroll to zoom in/out</span>
          </div>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-[#FF4D00] text-white hover:bg-[#E03B00] shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all cursor-pointer shrink-0"
          >
            <span>Commission This Spec</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
