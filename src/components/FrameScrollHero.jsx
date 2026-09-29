import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ChevronDown,
  ArrowRight,
  Wrench,
  Sparkles,
  CheckCircle,
  RotateCcw,
  Cpu,
  Layers,
  ShieldCheck,
  Crosshair,
  Zap,
} from 'lucide-react';

const TOTAL_FRAMES = 300; // 30fps 10-second sequence (300 frames)
const SCROLL_SENSITIVITY = 18; // Silky-smooth wheel delta per frame

// Automotive Modification Checkpoints along the Highway -> Workshop Drive
const CHECKPOINTS = [
  {
    id: 1,
    label: '01 POWERTRAIN',
    shortLabel: '01',
    tag: 'CHECKPOINT 01 // HIGHWAY TELEMETRY',
    category: 'Powertrain Calibration',
    title: 'Twin-Turbo & Stage 2 ECU Calibration',
    desc: 'Bespoke intake runners, dyno-tuned air-fuel maps, and valved Inconel downpipes delivering an instantaneous +120 BHP boost on highway straights.',
    badge: 'STAGE 2 • 310 BHP',
    range: [0, 27],
    targetFrame: 40,
    specs: [
      { label: 'Power Gain', value: '+120 BHP' },
      { label: 'Exhaust', value: 'Valved Inconel' },
      { label: 'Throttle Lag', value: '< 80ms' },
    ],
    icon: Cpu,
  },
  {
    id: 2,
    label: '02 SUSPENSION',
    shortLabel: '02',
    tag: 'CHECKPOINT 02 // CHASSIS & STANCE',
    category: 'Terrain Dynamics',
    title: 'Nitrogen Remote Reservoirs & 35" Beadlocks',
    desc: '2.5" mono-tube dampers with external finned cooling canisters paired with forged 17" beadlock wheels to absorb severe high-speed washboard terrain.',
    badge: 'EXPEDITION LIFT',
    range: [28, 56],
    targetFrame: 125,
    specs: [
      { label: 'Lift Height', value: '+3.5 Inches' },
      { label: 'Wheel Casing', value: '315/70 R17' },
      { label: 'Shock Valving', value: 'Dual-Stage' },
    ],
    icon: Layers,
  },
  {
    id: 3,
    label: '03 ARMOR & AERO',
    shortLabel: '03',
    tag: 'CHECKPOINT 03 // SURFACE & RECOVERY',
    category: 'Armor & Defense',
    title: 'Kevlar Underbody Armor & 50" Laser Matrix',
    desc: 'High-tensile steel skid plates with multi-layer 9H ceramic matrix paint defense, topped by 50" quad laser pods for extreme night trail penetration.',
    badge: 'MIL-SPEC ARMOR',
    range: [57, 84],
    targetFrame: 215,
    specs: [
      { label: 'Winch Pull', value: '9,500 LBS' },
      { label: 'Surface PPF', value: '10-Mil Armor' },
      { label: 'Night Optics', value: 'Quad Laser' },
    ],
    icon: ShieldCheck,
  },
  {
    id: 4,
    label: '04 3D BAY DOCKING',
    shortLabel: '04',
    tag: 'CHECKPOINT 04 // WORKSHOP DOCKING',
    category: 'Atelier 3D Simulation',
    title: 'Hydraulic Hoist Engaged • 3D Atelier Ready',
    desc: 'The Thar docks directly over the 4-post electro-hydraulic lift inside the workshop bay. Laser CAD alignment completes to reveal the 3D plane below.',
    badge: 'BAY DOCKED',
    range: [85, 100],
    targetFrame: 295,
    specs: [
      { label: 'Hoist Clearance', value: '+0.8M Elevated' },
      { label: 'CAD Scanner', value: '100% Calibrated' },
      { label: 'Interaction', value: '3D Plane Ready' },
    ],
    icon: Crosshair,
  },
];

// High-tech audio chime when crossing checkpoints
const playCheckpointChime = (cpId) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    const baseFreq = freqs[(cpId - 1) % freqs.length] || 659.25;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (e) {
    // Ignore audio restrictions
  }
};

export function FrameScrollHero({ onEnterShowroom }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardMinimized, setCardMinimized] = useState(false);

  // Smooth lerp tracking
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const hasTriggeredRef = useRef(false);
  const lastDrawnFrameRef = useRef(-1);
  const lastChimeCpRef = useRef(1);

  const baseUrl = import.meta.env.BASE_URL || '/';

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const folder = isMobile ? 'mobile' : 'desktop';

  // Draw image to canvas with 'cover' aspect ratio
  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Preload all 240 frames
  useEffect(() => {
    let loaded = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${baseUrl}frames/${folder}/frame_${numStr}.jpg`;

      const handleDone = () => {
        loaded++;
        setImagesLoaded(loaded);
        if (i === 1 && canvasRef.current) {
          drawFrame(img);
          lastDrawnFrameRef.current = 0;
        }
      };

      if (img.complete) {
        handleDone();
      } else {
        img.onload = handleDone;
        img.onerror = handleDone;
      }
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [folder, baseUrl, drawFrame]);

  // Handle Resize for Canvas high DPI
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
      const currentImg = imagesRef.current[idx];
      if (currentImg && (currentImg.complete || currentImg.naturalWidth > 0)) {
        drawFrame(currentImg);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFrame]);

  // Continuous Silky-Smooth Lerp Animation Loop (Eliminates all shutter & stutter)
  useEffect(() => {
    let animId;

    const animateLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.01) {
        // Silky-smooth easing lerp (0.14)
        currentFrameRef.current += diff * 0.14;
      }

      const frameInt = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      if (frameInt !== lastDrawnFrameRef.current || Math.abs(diff) > 0.01) {
        const img = imagesRef.current[frameInt];
        if (img && (img.complete || img.naturalWidth > 0)) {
          drawFrame(img);
          lastDrawnFrameRef.current = frameInt;
        }
      }

      const pct = Math.round(((frameInt + 1) / TOTAL_FRAMES) * 100);
      setDisplayPercent(pct);

      // Play subtle chime when crossing into a new modification checkpoint
      const cp = CHECKPOINTS.find((c) => pct >= c.range[0] && pct <= c.range[1]) || CHECKPOINTS[0];
      if (cp.id !== lastChimeCpRef.current) {
        lastChimeCpRef.current = cp.id;
        playCheckpointChime(cp.id);
      }

      // AUTOMATIC SMOOTH TRANSFORMATION TO 3D PLANE AT END OF VIDEO
      if (frameInt >= TOTAL_FRAMES - 4 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setIsTransitioning(true);

        // Smooth scroll directly to the 3D Studio Showroom Plane right below!
        setTimeout(() => {
          if (onEnterShowroom) {
            onEnterShowroom();
          }
          setIsTransitioning(false);
        }, 400);
      }

      animId = requestAnimationFrame(animateLoop);
    };

    animId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame, onEnterShowroom]);

  // SMOOTH VIEWPORT WHEEL & TOUCH CONTROLLER
  useEffect(() => {
    let touchStartY = 0;

    const advanceByDelta = (deltaY) => {
      if (deltaY < 0) {
        // SCROLL UP: Return to start banner
        targetFrameRef.current = 0;
        currentFrameRef.current = 0;
        hasTriggeredRef.current = false;
        setIsTransitioning(false);
        const firstImg = imagesRef.current[0];
        if (firstImg && (firstImg.complete || firstImg.naturalWidth > 0)) {
          drawFrame(firstImg);
          lastDrawnFrameRef.current = 0;
        }
        setDisplayPercent(0);
        return;
      }

      // SCROLL DOWN: Advance forward smoothly
      const nextTarget = Math.min(
        TOTAL_FRAMES - 1,
        targetFrameRef.current + deltaY / SCROLL_SENSITIVITY
      );
      targetFrameRef.current = nextTarget;
    };

    const onWheel = (e) => {
      // If user is scrolled down into the 3D showroom plane, allow native page scrolling!
      if (window.scrollY > 40) {
        return;
      }

      if (e.deltaY > 0) {
        if (currentFrameRef.current < TOTAL_FRAMES - 6) {
          e.preventDefault();
          advanceByDelta(e.deltaY);
        } else {
          // Reached end of video: smoothly transition down to 3D plane
          if (onEnterShowroom && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onEnterShowroom();
          }
        }
      } else if (e.deltaY < 0 && window.scrollY <= 10) {
        if (currentFrameRef.current > 0) {
          e.preventDefault();
          advanceByDelta(-100);
        }
      }
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (window.scrollY > 40) return;
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * 1.3;
      touchStartY = currentY;

      if (deltaY > 0 && currentFrameRef.current < TOTAL_FRAMES - 6) {
        e.preventDefault();
        advanceByDelta(deltaY);
      } else if (deltaY > 0 && currentFrameRef.current >= TOTAL_FRAMES - 6) {
        if (onEnterShowroom && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          onEnterShowroom();
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [onEnterShowroom, drawFrame]);

  const loadPercent = Math.round((imagesLoaded / TOTAL_FRAMES) * 100);

  const seekToCheckpoint = (cp) => {
    targetFrameRef.current = cp.targetFrame;
    lastChimeCpRef.current = cp.id;
    playCheckpointChime(cp.id);
  };

  const resetToBeginning = () => {
    targetFrameRef.current = 0;
    currentFrameRef.current = 0;
    hasTriggeredRef.current = false;
    setIsTransitioning(false);
    lastChimeCpRef.current = 1;
    const firstImg = imagesRef.current[0];
    if (firstImg && (firstImg.complete || firstImg.naturalWidth > 0)) {
      drawFrame(firstImg);
      lastDrawnFrameRef.current = 0;
    }
    setDisplayPercent(0);
  };

  const activeCheckpoint = CHECKPOINTS.find(
    (cp) => displayPercent >= cp.range[0] && displayPercent <= cp.range[1]
  ) || CHECKPOINTS[0];

  const cpSpan = Math.max(1, activeCheckpoint.range[1] - activeCheckpoint.range[0]);
  const checkpointSubPercent = Math.max(
    0,
    Math.min(100, Math.round(((displayPercent - activeCheckpoint.range[0]) / cpSpan) * 100))
  );

  const ActiveIcon = activeCheckpoint.icon;

  return (
    <div className="relative w-full h-screen bg-[#0A0D14] overflow-hidden select-none z-0">
      {/* Loading Overlay */}
      {imagesLoaded < 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40 gap-3">
          <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Preparing 24fps Driving Experience ({loadPercent}%)...
          </span>
        </div>
      )}

      {/* Smooth Transition Crossfade Flash */}
      <div
        className={`absolute inset-0 bg-black z-30 pointer-events-none transition-opacity duration-700 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-white font-bold animate-pulse">
            Transitioning to 3D Studio Plane...
          </span>
        </div>
      </div>

      {/* Fullscreen High-DPI Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Subtle Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-black/60 pointer-events-none" />

      {/* TOP INTERACTIVE CHECKPOINTS TIMELINE BAR */}
      <div className="absolute top-20 sm:top-24 left-0 right-0 max-w-7xl mx-auto px-3 sm:px-6 pointer-events-auto z-20 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Driving Telemetry Tag */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C1018]/90 border border-white/10 backdrop-blur-xl shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
            THAR 4X4 • HIGHWAY TELEMETRY
          </span>
          <span className="text-[10px] font-mono font-extrabold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
            {displayPercent}%
          </span>
        </div>

        {/* Center: 4 Clickable Checkpoint Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-[#0C1018]/90 border border-white/[0.12] ring-1 ring-white/5 backdrop-blur-2xl shadow-xl">
          {CHECKPOINTS.map((cp) => {
            const isActive = activeCheckpoint.id === cp.id;
            const isPassed = displayPercent >= cp.range[1];
            const CpIcon = cp.icon;

            return (
              <button
                key={cp.id}
                onClick={() => seekToCheckpoint(cp)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : isPassed
                    ? 'bg-white/10 text-amber-300 hover:bg-white/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={`Jump to ${cp.title}`}
              >
                <CpIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline font-bold">{cp.label}</span>
                <span className="md:hidden font-bold">{cp.shortLabel}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Controls & Skip to 3D */}
        <div className="flex items-center gap-2">
          {displayPercent > 5 && (
            <button
              onClick={resetToBeginning}
              className="px-3 py-1.5 rounded-full bg-[#0C1018]/90 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:border-amber-400/40"
              title="Return to start of highway drive"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onEnterShowroom}
            className="px-4 py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 hover:shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <span>{displayPercent >= 90 ? 'Reveal 3D Plane' : 'Skip to 3D'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DYNAMIC CHECKPOINT MODIFICATION DETAILS POP-UP CARD (BOTTOM LEFT / RESPONSIVE MOBILE ISLAND) */}
      <div className="absolute bottom-5 sm:bottom-8 left-3 sm:left-8 right-3 sm:right-auto max-w-[420px] sm:max-w-[460px] z-30 pointer-events-auto">
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0C1018]/92 border border-white/[0.12] ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.92)] transition-all duration-300">
          {/* Header Row: Checkpoint Tag + Min-Max Toggle */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span className="truncate">{activeCheckpoint.tag}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {activeCheckpoint.category}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {activeCheckpoint.badge}
              </span>
              <button
                onClick={() => setCardMinimized(!cardMinimized)}
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title={cardMinimized ? 'Expand Specs' : 'Minimize Card'}
              >
                {cardMinimized ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {!cardMinimized && (
            <>
              {/* Checkpoint Title & Customization Details */}
              <div className="mt-2.5">
                <h3 className="text-sm sm:text-base font-heading font-black uppercase text-white tracking-wide leading-snug">
                  {activeCheckpoint.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 font-body leading-relaxed mt-1 line-clamp-2 sm:line-clamp-none">
                  {activeCheckpoint.desc}
                </p>
              </div>

              {/* 3 Technical Specs Badges */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/10">
                {activeCheckpoint.specs.map((s, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider truncate">
                      {s.label}
                    </div>
                    <div className="text-[11px] sm:text-xs font-bold text-white font-mono mt-0.5 truncate">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Checkpoint Phase Sub-Progress Meter */}
          <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-amber-400">
              <span>Phase Progress</span>
            </span>
            <span className="text-amber-400 font-bold">{checkpointSubPercent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75"
              style={{ width: `${checkpointSubPercent}%` }}
            />
          </div>

          {/* Scroll / Swipe Guidance Note */}
          <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>Scroll wheel / swipe to drive through checkpoints</span>
            <ChevronDown className="w-3 h-3 text-amber-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
