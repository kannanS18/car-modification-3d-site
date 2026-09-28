import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronDown, ArrowRight, Wrench, Sparkles, CheckCircle } from 'lucide-react';

const TOTAL_FRAMES = 240; // Full 24fps 10-second sequence (240 frames)
const SCROLL_SENSITIVITY = 14; // Smooth wheel delta per frame

export function FrameScrollHero({ onEnterShowroom }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth lerp tracking
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const hasTriggeredRef = useRef(false);
  const lastDrawnFrameRef = useRef(-1);

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
        // Silky-smooth easing lerp (0.16)
        currentFrameRef.current += diff * 0.16;
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

        // Smooth 600ms cross-fade into 3D Studio Plane
        setTimeout(() => {
          if (onEnterShowroom) {
            onEnterShowroom();
          }
        }, 600);
      }

      animId = requestAnimationFrame(animateLoop);
    };

    animId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame, onEnterShowroom]);

  // LOCKED VIEWPORT WHEEL & TOUCH CONTROLLER (ZERO DOCUMENT SCROLL)
  useEffect(() => {
    let touchStartY = 0;

    const advanceByDelta = (deltaY) => {
      // Advance target frame continuously
      const nextTarget = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, targetFrameRef.current + deltaY / SCROLL_SENSITIVITY)
      );
      targetFrameRef.current = nextTarget;
    };

    const onWheel = (e) => {
      e.preventDefault();
      advanceByDelta(e.deltaY);
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * 1.3;
      touchStartY = currentY;
      advanceByDelta(deltaY);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const loadPercent = Math.round((imagesLoaded / TOTAL_FRAMES) * 100);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0B0B0C] overflow-hidden select-none z-0">
      {/* Loading Overlay */}
      {imagesLoaded < 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40 gap-3">
          <div className="w-12 h-12 border-3 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF4D00] font-bold">
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
          <div className="w-10 h-10 border-2 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-white font-bold animate-pulse">
            Docking on 3D Studio Plane...
          </span>
        </div>
      </div>

      {/* Fullscreen High-DPI Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Subtle Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-black/50 pointer-events-none" />

      {/* Top HUD Banner */}
      <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none z-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-mono font-bold tracking-wider text-[#FF4D00] uppercase mb-2 border border-[#FF4D00]/40 backdrop-blur-md shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
          <span>Mahindra Thar 4x4 • 24fps Smooth Wheel Driving Experience</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white uppercase tracking-tight drop-shadow-2xl">
          AutoForge <span className="theme-gradient-text">Motorsport Atelier</span>
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-lg font-body drop-shadow">
          Scroll down continuously. The screen stays locked while the car rolls through the workshop doors and automatically transforms into the 3D plane.
        </p>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-8 left-0 right-0 max-w-3xl mx-auto px-4 pointer-events-auto z-20">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl bg-black/85">
          {/* Status & Scrub Bar */}
          <div className="w-full sm:w-auto flex-1">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span>
                  {displayPercent < 45
                    ? '1. Cruising City Highway'
                    : displayPercent < 80
                    ? '2. Turning Into Workshop Doors'
                    : '3. Arriving on Modification Bay'}
                </span>
              </span>
              <span className="text-[#FF4D00] font-bold">
                {displayPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4D00] to-yellow-500 transition-all duration-75"
                style={{ width: `${displayPercent}%` }}
              />
            </div>
          </div>

          {/* Direct Transition Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(onEnterShowroom, 400);
              }}
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-[#FF4D00] hover:bg-[#E03B00] text-white shadow-[0_0_25px_rgba(255,77,0,0.6)] transition-all cursor-pointer group"
            >
              <span>{displayPercent >= 90 ? 'Docking in 3D...' : 'Skip to 3D Plane'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scroll Instruction */}
        <div className="text-center mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-gray-400">
          <span>Scroll Mouse Wheel / Swipe to Drive Car</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#FF4D00] animate-bounce" />
        </div>
      </div>
    </div>
  );
}
