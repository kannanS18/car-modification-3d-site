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
      // Smooth bidirectional scrubbing: deltaY > 0 advances, deltaY < 0 reverses
      const nextTarget = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, targetFrameRef.current + deltaY / SCROLL_SENSITIVITY)
      );
      targetFrameRef.current = nextTarget;

      // When scrubbing in reverse away from the end, reset trigger flag so transition can trigger again
      if (nextTarget < TOTAL_FRAMES - 10) {
        hasTriggeredRef.current = false;
        setIsTransitioning(false);
      }
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
        // SCROLL BACKWARD: Smoothly scrub the car and popups in reverse
        if (currentFrameRef.current > 0.1 || targetFrameRef.current > 0.1) {
          e.preventDefault();
          advanceByDelta(e.deltaY);
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
      } else if (deltaY < 0 && (currentFrameRef.current > 0.1 || targetFrameRef.current > 0.1)) {
        // TOUCH SWIPE DOWN: Smoothly scrub frames in reverse on mobile
        e.preventDefault();
        advanceByDelta(deltaY);
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

  const resetToBeginning = () => {
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
  };

  // Opacity & transform calculation for each popup window to fade in and out smoothly
  const calcWindowOpacity = (pct, start, peakIn, peakOut, end) => {
    if (pct < start || pct > end) return 0;
    if (pct < peakIn) return (pct - start) / (peakIn - start);
    if (pct > peakOut) return (end - pct) / (end - peakOut);
    return 1;
  };

  // Window 1: Highway Drive (Empty space on the RIGHT)
  const op1 = calcWindowOpacity(displayPercent, 4, 8, 22, 26);

  // Window 2: Turning to Workshop (Empty space on the LEFT)
  const op2 = calcWindowOpacity(displayPercent, 30, 34, 49, 54);

  // Window 3: Workshop Entry (Empty space on the RIGHT)
  const op3 = calcWindowOpacity(displayPercent, 58, 62, 75, 80);

  // Window 4: Workshop Docking (Centered at bottom)
  const op4 = calcWindowOpacity(displayPercent, 84, 88, 98, 99.5);

  // Trigger delicate audio chime when a new popup begins to fade in
  const lastChimeWindowRef = useRef(0);
  useEffect(() => {
    const currentActiveWin = op1 > 0.4 ? 1 : op2 > 0.4 ? 2 : op3 > 0.4 ? 3 : op4 > 0.4 ? 4 : 0;
    if (currentActiveWin !== 0 && currentActiveWin !== lastChimeWindowRef.current) {
      lastChimeWindowRef.current = currentActiveWin;
      playCheckpointChime(currentActiveWin);
    }
  }, [op1, op2, op3, op4]);

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

      {/* CLEAN MINIMAL TOP HEADER (NO CLUTTERED BANNER CHECKPOINT BUTTONS) */}
      <div className="absolute top-24 right-4 sm:right-8 z-30 pointer-events-auto flex items-center gap-2.5">
        {displayPercent > 5 && (
          <button
            onClick={resetToBeginning}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-md"
            title="Restart highway drive"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        )}

        <button
          onClick={onEnterShowroom}
          className="px-4 py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 bg-[#0C1018]/80 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95"
        >
          <span>{displayPercent >= 90 ? 'Reveal 3D Plane' : 'Skip to 3D'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* POPUP 1: HIGHWAY DRIVE - IN THE EMPTY GAP ON THE RIGHT (FADES IN & FADES OUT) */}
      <div
        className={`fixed sm:absolute z-30 transition-all duration-500 ease-out pointer-events-none ${
          isMobile
            ? 'bottom-10 left-4 right-4 mx-auto max-w-[390px]'
            : 'right-6 lg:right-16 top-1/2 -translate-y-1/2 max-w-[420px]'
        }`}
        style={{
          opacity: op1,
          transform: isMobile
            ? `translateY(${(1 - op1) * 20}px)`
            : `translate(${(1 - op1) * 25}px, -50%)`,
          pointerEvents: op1 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-6 sm:p-7 rounded-3xl bg-[#090C14]/85 border border-white/15 ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.92)] text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>ATELIER PHILOSOPHY</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-2.5">
            WE CRAFT CUSTOM BUILDS WITH OBSESSIVE CARE
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-4">
            Every machine that enters our Silverstone atelier receives bespoke engineering — dyno-proven power, millimeter-gap composite fabrication, and hand-tailored interiors built for true automotive connoisseurs.
          </p>
          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 text-[11px] font-mono font-bold text-amber-300">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Bespoke Commission</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Dyno Certified</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Silverstone Atelier</span>
          </div>
        </div>
      </div>

      {/* POPUP 2: TURNING INTO COMPOUND - IN THE EMPTY GAP ON THE LEFT (FADES IN & FADES OUT) */}
      <div
        className={`fixed sm:absolute z-30 transition-all duration-500 ease-out pointer-events-none ${
          isMobile
            ? 'bottom-10 left-4 right-4 mx-auto max-w-[390px]'
            : 'left-6 lg:left-16 top-1/2 -translate-y-1/2 max-w-[420px]'
        }`}
        style={{
          opacity: op2,
          transform: isMobile
            ? `translateY(${(1 - op2) * 20}px)`
            : `translate(${-(1 - op2) * 25}px, -50%)`,
          pointerEvents: op2 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-6 sm:p-7 rounded-3xl bg-[#090C14]/85 border border-white/15 ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.92)] text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>EXPEDITION & CHASSIS SERVICES</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-2.5">
            PERFORMANCE SUSPENSION & TERRAIN DEFENSE
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-4">
            Stage-3 nitrogen remote-reservoir dampers, forged monoblock beadlock wheels, and high-clearance expedition geometry engineered to conquer 18,000ft mountain passes.
          </p>
          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 text-[11px] font-mono font-bold text-amber-300">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Stage-3 Nitrogen Lift</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Forged Beadlocks</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Dual-Stage Valving</span>
          </div>
        </div>
      </div>

      {/* POPUP 3: WORKSHOP ENTRY - IN THE EMPTY GAP ON THE RIGHT (FADES IN & FADES OUT) */}
      <div
        className={`fixed sm:absolute z-30 transition-all duration-500 ease-out pointer-events-none ${
          isMobile
            ? 'bottom-10 left-4 right-4 mx-auto max-w-[390px]'
            : 'right-6 lg:right-16 top-1/2 -translate-y-1/2 max-w-[420px]'
        }`}
        style={{
          opacity: op3,
          transform: isMobile
            ? `translateY(${(1 - op3) * 20}px)`
            : `translate(${(1 - op3) * 25}px, -50%)`,
          pointerEvents: op3 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-6 sm:p-7 rounded-3xl bg-[#090C14]/85 border border-white/15 ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.92)] text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>AEROSPACE COMPOSITE & DEFENSE</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-2.5">
            AUTOCLAVE CARBON & 9H CERAMIC ARMOR
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-4">
            Aerodynamic dry carbon splitters, valved Inconel performance downpipes, and multi-layer 10-mil self-healing PPF ceramic armor protecting high-strike body panels against extreme debris.
          </p>
          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10 text-[11px] font-mono font-bold text-amber-300">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Dry Carbon Aero</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">Valved Inconel</span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">9H Ceramic Armor</span>
          </div>
        </div>
      </div>

      {/* POPUP 4: WORKSHOP DOCKING - CENTERED (FADES IN & FADES OUT) */}
      <div
        className="fixed sm:absolute z-30 transition-all duration-500 ease-out left-1/2 -translate-x-1/2 bottom-8 sm:bottom-12 max-w-[460px] w-[92%] sm:w-full pointer-events-none"
        style={{
          opacity: op4,
          transform: `translate(-50%, ${(1 - op4) * 20}px)`,
          pointerEvents: op4 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-6 sm:p-7 rounded-3xl bg-[#090C14]/90 border border-white/15 ring-1 ring-amber-400/30 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>WORKSHOP DOCKING COMPLETE</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-2">
            HYDRAULIC LIFT ENGAGED • ENTER 3D ATELIER
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-5">
            The vehicle is aligned on the hoist. Scroll down or click below to enter the interactive 3D showroom plane.
          </p>
          <button
            onClick={onEnterShowroom}
            className="w-full py-3.5 px-6 rounded-2xl font-heading font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 hover:shadow-xl transition-all cursor-pointer"
          >
            <span>Reveal 3D Showroom Plane</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUBTLE SCROLL PROMPT AT BOTTOM */}
      {displayPercent < 80 && (
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-20 flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400/80 transition-opacity">
          <span>Scroll wheel / swipe to drive car</span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        </div>
      )}
    </div>
  );
}
