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

// Cinematic checkpoint stops where the vehicle comes to a clean, crisp halt
const CHECKPOINTS = [
  { id: 0, frame: 0, title: 'Atelier Start', subtitle: 'Highway Departure' },
  { id: 1, frame: 45, title: 'Atelier Philosophy', subtitle: 'Bespoke Engineering' },
  { id: 2, frame: 135, title: 'Chassis & Defense', subtitle: 'Performance Suspension' },
  { id: 3, frame: 210, title: 'Composite Armor', subtitle: 'Dry Carbon & 9H Shield' },
  { id: 4, frame: 275, title: 'Hydraulic Hoist', subtitle: 'Workshop Alignment' },
  { id: 5, frame: 299, title: '3D Studio Showroom', subtitle: 'Interactive Plane' },
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

  // Smooth checkpoint step tracking
  const activeCheckpointRef = useRef(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState(0);
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

      if (Math.abs(diff) < 0.18) {
        // Lock firmly onto target checkpoint integer frame to ensure ZERO motion blur
        currentFrameRef.current = targetFrameRef.current;
      } else {
        // Silky-smooth easing lerp (0.10) for graceful deceleration into each stop
        currentFrameRef.current += diff * 0.10;
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

  // NAVIGATION ACTIONS TO STEP CLEANLY BETWEEN CHECKPOINTS
  const goToNextCheckpoint = useCallback(() => {
    if (activeCheckpointRef.current < CHECKPOINTS.length - 1) {
      const nextIdx = activeCheckpointRef.current + 1;
      activeCheckpointRef.current = nextIdx;
      setActiveCheckpoint(nextIdx);
      targetFrameRef.current = CHECKPOINTS[nextIdx].frame;

      // When advancing to the final showroom step
      if (nextIdx === CHECKPOINTS.length - 1) {
        if (onEnterShowroom && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsTransitioning(true);
          setTimeout(() => {
            onEnterShowroom();
            setIsTransitioning(false);
          }, 450);
        }
      }
    } else {
      if (onEnterShowroom && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        onEnterShowroom();
      }
    }
  }, [onEnterShowroom]);

  const goToPrevCheckpoint = useCallback(() => {
    if (activeCheckpointRef.current > 0) {
      const prevIdx = activeCheckpointRef.current - 1;
      activeCheckpointRef.current = prevIdx;
      setActiveCheckpoint(prevIdx);
      targetFrameRef.current = CHECKPOINTS[prevIdx].frame;

      if (CHECKPOINTS[prevIdx].frame < TOTAL_FRAMES - 10) {
        hasTriggeredRef.current = false;
        setIsTransitioning(false);
      }
    }
  }, []);

  // DIRECT JUMP TO SPECIFIC CHECKPOINT (FOR INTERACTIVE DOTS)
  const jumpToCheckpoint = useCallback((idx) => {
    if (idx >= 0 && idx < CHECKPOINTS.length) {
      activeCheckpointRef.current = idx;
      setActiveCheckpoint(idx);
      targetFrameRef.current = CHECKPOINTS[idx].frame;
      if (CHECKPOINTS[idx].frame < TOTAL_FRAMES - 10) {
        hasTriggeredRef.current = false;
        setIsTransitioning(false);
      }
    }
  }, []);

  // DISCRETE SMOOTH CHECKPOINT CONTROLLER: PREVENTS MOBILE PAGE SCROLL DOWN
  useEffect(() => {
    let wheelDeltaAccumulator = 0;
    let touchDeltaAccumulator = 0;
    let touchStartY = 0;
    let lastStepTime = 0;
    let resetWheelTimer = null;
    let isInteractingHero = false;

    const onWheel = (e) => {
      // If user is scrolled down into the 3D showroom plane, allow native page scrolling!
      if (window.scrollY > 40) {
        return;
      }

      if (e.cancelable && window.scrollY <= 10) {
        e.preventDefault();
      }

      const now = Date.now();
      const timeSinceLastStep = now - lastStepTime;

      wheelDeltaAccumulator += e.deltaY;
      clearTimeout(resetWheelTimer);
      resetWheelTimer = setTimeout(() => {
        wheelDeltaAccumulator = 0;
      }, 200);

      // FORWARD SCROLL (wheel down): Glides smoothly to next checkpoint stop
      if (e.deltaY > 0 || wheelDeltaAccumulator > 25) {
        if (activeCheckpointRef.current < CHECKPOINTS.length - 1) {
          if (timeSinceLastStep > 400) {
            lastStepTime = now;
            wheelDeltaAccumulator = 0;
            goToNextCheckpoint();
          }
        } else {
          // Reached docking stage: smoothly transition down to 3D plane
          if (onEnterShowroom && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onEnterShowroom();
          }
        }
      }
      // REVERSE SCROLL (wheel up): Glides smoothly to previous checkpoint stop
      else if (e.deltaY < 0 || wheelDeltaAccumulator < -25) {
        if (window.scrollY <= 10 && activeCheckpointRef.current > 0) {
          if (timeSinceLastStep > 400) {
            lastStepTime = now;
            wheelDeltaAccumulator = 0;
            goToPrevCheckpoint();
          }
        }
      }
    };

    const onTouchStart = (e) => {
      if (window.scrollY <= 20) {
        isInteractingHero = true;
        touchStartY = e.touches[0].clientY;
        touchDeltaAccumulator = 0;
      } else {
        isInteractingHero = false;
      }
    };

    const onTouchMove = (e) => {
      if (!isInteractingHero || window.scrollY > 20) return;

      // CRUCIAL: Immediately cancel browser's native downward viewport scroll!
      if (e.cancelable) {
        e.preventDefault();
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;
      touchDeltaAccumulator += deltaY;

      const now = Date.now();
      const timeSinceLastStep = now - lastStepTime;

      // Touch swipe up: Step forward to next checkpoint
      if (touchDeltaAccumulator > 25) {
        touchDeltaAccumulator = 0;
        if (activeCheckpointRef.current < CHECKPOINTS.length - 1) {
          if (timeSinceLastStep > 380) {
            lastStepTime = now;
            goToNextCheckpoint();
          }
        } else {
          if (onEnterShowroom && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onEnterShowroom();
          }
        }
      }
      // Touch swipe down: Step backward to previous checkpoint
      else if (touchDeltaAccumulator < -25) {
        touchDeltaAccumulator = 0;
        if (activeCheckpointRef.current > 0) {
          if (timeSinceLastStep > 380) {
            lastStepTime = now;
            goToPrevCheckpoint();
          }
        }
      }
    };

    const onTouchEnd = () => {
      isInteractingHero = false;
      touchDeltaAccumulator = 0;
    };

    const onKeyDown = (e) => {
      if (window.scrollY > 40) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextCheckpoint();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeCheckpointRef.current > 0) {
          e.preventDefault();
          goToPrevCheckpoint();
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(resetWheelTimer);
    };
  }, [goToNextCheckpoint, goToPrevCheckpoint, onEnterShowroom]);

  const loadPercent = Math.round((imagesLoaded / TOTAL_FRAMES) * 100);

  const resetToBeginning = () => {
    activeCheckpointRef.current = 0;
    setActiveCheckpoint(0);
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
    <div className="relative w-full h-[100dvh] bg-[#0A0D14] overflow-hidden select-none z-0 touch-none overscroll-none">
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

      {/* CLEAN MINIMAL TOP HEADER */}
      <div className="absolute top-20 sm:top-24 right-3 sm:right-8 z-30 pointer-events-auto flex items-center gap-2">
        {displayPercent > 5 && (
          <button
            onClick={resetToBeginning}
            className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-md active:scale-95"
            title="Restart highway drive"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        )}

        <button
          onClick={onEnterShowroom}
          className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 bg-[#0C1018]/90 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95"
        >
          <span>{displayPercent >= 90 ? 'Reveal 3D' : 'Skip to 3D'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* POPUP 1: HIGHWAY DRIVE (TOP ON MOBILE FOR FULL CAR VISIBILITY, RIGHT ON DESKTOP) */}
      <div
        className={`fixed sm:absolute z-30 transition-all duration-500 ease-out pointer-events-none ${
          isMobile
            ? 'top-20 left-3 right-3 mx-auto max-w-[380px]'
            : 'right-6 lg:right-16 top-1/2 -translate-y-1/2 max-w-[420px]'
        }`}
        style={{
          opacity: op1,
          transform: isMobile
            ? `translateY(${(1 - op1) * -12}px)`
            : `translate(${(1 - op1) * 25}px, -50%)`,
          pointerEvents: op1 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#090C14]/90 border border-white/15 ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.92)] text-left">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>STOP 01 • ATELIER PHILOSOPHY</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">1 / 4</span>
          </div>

          <h3 className="text-base sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-1.5 sm:mb-2.5">
            WE CRAFT CUSTOM BUILDS WITH OBSESSIVE CARE
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
            Every machine that enters our Silverstone atelier receives bespoke engineering — dyno-proven power, millimeter-gap composite fabrication, and hand-tailored interiors.
          </p>

          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Bespoke Spec</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Silverstone</span>
            </div>
            <button
              onClick={goToNextCheckpoint}
              className="px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-500/40 font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95 ml-auto"
              title="Drive to next checkpoint"
            >
              <span>Next Stop</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* POPUP 2: CHASSIS & SUSPENSION (TOP ON MOBILE, LEFT ON DESKTOP) */}
      <div
        className={`fixed sm:absolute z-30 transition-all duration-500 ease-out pointer-events-none ${
          isMobile
            ? 'top-20 left-3 right-3 mx-auto max-w-[380px]'
            : 'left-6 lg:left-16 top-1/2 -translate-y-1/2 max-w-[420px]'
        }`}
        style={{
          opacity: op2,
          transform: isMobile
            ? `translateY(${(1 - op2) * -12}px)`
            : `translate(${-(1 - op2) * 25}px, -50%)`,
          pointerEvents: op2 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#090C14]/90 border border-white/15 ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.92)] text-left">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>STOP 02 • EXPEDITION CHASSIS</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">2 / 4</span>
          </div>

          <h3 className="text-base sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-1.5 sm:mb-2.5">
            PERFORMANCE SUSPENSION & TERRAIN DEFENSE
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
            Stage-3 nitrogen remote-reservoir dampers, forged monoblock beadlock wheels, and high-clearance expedition geometry engineered to conquer extreme mountain passes.
          </p>

          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Stage-3 Lift</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Beadlocks</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={goToPrevCheckpoint}
                className="px-2.5 py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Previous stop"
              >
                Prev
              </button>
              <button
                onClick={goToNextCheckpoint}
                className="px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-500/40 font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Drive to next checkpoint"
              >
                <span>Next Stop</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP 3: AEROSPACE COMPOSITE (TOP ON MOBILE, RIGHT ON DESKTOP) */}
      <div
        className={`fixed sm:absolute z-30 transition-all duration-500 ease-out pointer-events-none ${
          isMobile
            ? 'top-20 left-3 right-3 mx-auto max-w-[380px]'
            : 'right-6 lg:right-16 top-1/2 -translate-y-1/2 max-w-[420px]'
        }`}
        style={{
          opacity: op3,
          transform: isMobile
            ? `translateY(${(1 - op3) * -12}px)`
            : `translate(${(1 - op3) * 25}px, -50%)`,
          pointerEvents: op3 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#090C14]/90 border border-white/15 ring-1 ring-amber-400/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.92)] text-left">
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>STOP 03 • COMPOSITE & ARMOR</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">3 / 4</span>
          </div>

          <h3 className="text-base sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-1.5 sm:mb-2.5">
            AUTOCLAVE CARBON & 9H CERAMIC ARMOR
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
            Aerodynamic dry carbon splitters, valved Inconel performance downpipes, and multi-layer 10-mil self-healing PPF ceramic armor protecting body panels.
          </p>

          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Dry Carbon</span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">9H Shield</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={goToPrevCheckpoint}
                className="px-2.5 py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                title="Previous stop"
              >
                Prev
              </button>
              <button
                onClick={goToNextCheckpoint}
                className="px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-500/40 font-heading text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Drive to next checkpoint"
              >
                <span>Next Stop</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP 4: WORKSHOP DOCKING (BOTTOM DOCK) */}
      <div
        className="fixed sm:absolute z-30 transition-all duration-500 ease-out left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 bottom-5 sm:bottom-12 max-w-[460px] sm:w-full mx-auto pointer-events-none"
        style={{
          opacity: op4,
          transform: `translate(${isMobile ? '0' : '-50%'}, ${(1 - op4) * 20}px)`,
          pointerEvents: op4 > 0.2 ? 'auto' : 'none',
        }}
      >
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#090C14]/95 border border-white/15 ring-1 ring-amber-400/30 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-2 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>STOP 04 • WORKSHOP DOCKING COMPLETE</span>
          </div>
          <h3 className="text-base sm:text-2xl font-heading font-black uppercase text-white tracking-wide leading-tight mb-1 sm:mb-2">
            HYDRAULIC LIFT ENGAGED • ENTER 3D ATELIER
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed mb-3 sm:mb-5">
            The vehicle is aligned on the hoist. Tap below to inspect, customize paint & wheels in the 3D studio.
          </p>
          <button
            onClick={onEnterShowroom}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl sm:rounded-2xl font-heading font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 hover:shadow-xl transition-all cursor-pointer active:scale-98"
          >
            <span>Reveal 3D Showroom Plane</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SLEEK MOBILE & DESKTOP CHECKPOINT NAVIGATOR AT BOTTOM */}
      {displayPercent < 82 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-1.5 pointer-events-auto select-none">
          {/* Minimal 4-Checkpoint Switcher Pills */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-xl shadow-lg">
            {[1, 2, 3, 4].map((step) => {
              const isCurrent = activeCheckpoint === step;
              const isPassed = activeCheckpoint > step;
              return (
                <button
                  key={step}
                  onClick={() => jumpToCheckpoint(step)}
                  className={`transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center font-mono text-[10px] ${
                    isCurrent
                      ? 'w-7 h-5 bg-amber-400 text-black font-bold shadow-md shadow-amber-400/40'
                      : isPassed
                      ? 'w-5 h-5 bg-white/20 text-slate-300 hover:bg-white/30'
                      : 'w-5 h-5 bg-white/5 text-slate-500 hover:bg-white/15'
                  }`}
                  title={`Jump to Checkpoint ${step}`}
                >
                  {step}
                </button>
              );
            })}
          </div>

          {/* Subtle swipe / click hint */}
          <button
            onClick={goToNextCheckpoint}
            className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-amber-300 transition-colors"
          >
            <span>
              {activeCheckpoint === 0
                ? 'Swipe Up / Click • Start Drive'
                : `Swipe Up / Click • Stop ${Math.min(4, activeCheckpoint + 1)}`}
            </span>
            <ChevronDown className="w-3 h-3 text-amber-400 animate-bounce" />
          </button>
        </div>
      )}
    </div>
  );
}
