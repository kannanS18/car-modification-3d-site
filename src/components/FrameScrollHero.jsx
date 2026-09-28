import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronDown, ArrowRight, Wrench, Sparkles, CheckCircle, RotateCcw } from 'lucide-react';

const TOTAL_FRAMES = 150; // 0s to 10s full driving sequence
const SCROLL_SENSITIVITY = 18; // Delta pixels per frame advance

export function FrameScrollHero({ onFinishDrive, onEnterShowroom }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const frameRef = useRef(0);
  const accumDeltaRef = useRef(0);

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

  // Draw frame to canvas with aspect ratio cover
  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Preload all 150 frames
  useEffect(() => {
    let loaded = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${baseUrl}frames/${folder}/frame_${numStr}.jpg`;

      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
        if (i === 1 && canvasRef.current) {
          drawFrame(img);
        }
      };
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

      const currentImg = imagesRef.current[frameRef.current];
      if (currentImg) {
        drawFrame(currentImg);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFrame]);

  // LOCKED VIEWPORT WHEEL & TOUCH CONTROLLER (ZERO DOCUMENT SCROLL)
  useEffect(() => {
    let touchStartY = 0;

    const advanceByDelta = (deltaY) => {
      accumDeltaRef.current += deltaY;

      // Calculate target frame
      const target = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(accumDeltaRef.current / SCROLL_SENSITIVITY))
      );

      if (target !== frameRef.current) {
        frameRef.current = target;
        setCurrentFrame(target);

        const img = imagesRef.current[target];
        if (img) {
          drawFrame(img);
        }

        // When reaching the last frame (car parked in the shed)
        if (target >= TOTAL_FRAMES - 1) {
          setHasFinished(true);
        }
      }
    };

    // Wheel listener with preventDefault: screen CANNOT scroll down at all
    const onWheel = (e) => {
      e.preventDefault();
      advanceByDelta(e.deltaY);
    };

    // Touch listener for mobile devices
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * 1.5;
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
  }, [drawFrame]);

  const loadPercent = Math.round((imagesLoaded / TOTAL_FRAMES) * 100);
  const playPercent = Math.round(((currentFrame + 1) / TOTAL_FRAMES) * 100);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0B0B0C] overflow-hidden select-none z-0">
      {/* Loading Overlay */}
      {imagesLoaded < 20 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30 gap-3">
          <div className="w-12 h-12 border-3 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF4D00] font-bold">
            Caching HD Sequence ({loadPercent}%)...
          </span>
        </div>
      )}

      {/* Fullscreen Canvas (Zero Document Scrolling, Only Frames Advance) */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-black/50 pointer-events-none" />

      {/* Top HUD Banner */}
      <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none z-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-mono font-bold tracking-wider text-[#FF4D00] uppercase mb-2 border border-[#FF4D00]/40 backdrop-blur-md shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
          <span>Mahindra Thar 4x4 • Locked Viewport Driving Simulation</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white uppercase tracking-tight drop-shadow-2xl">
          AutoForge <span className="theme-gradient-text">Motorsport Atelier</span>
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-lg font-body drop-shadow">
          Scroll your mouse wheel or swipe. The page stays locked in place while the car drives straight into the modification bay.
        </p>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-8 left-0 right-0 max-w-3xl mx-auto px-4 pointer-events-auto z-20">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl bg-black/80">
          {/* Status & Scrub Bar */}
          <div className="w-full sm:w-auto flex-1">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span>
                  {playPercent < 45
                    ? '1. Cruising City Highway'
                    : playPercent < 80
                    ? '2. Turning Into Workshop Doors'
                    : '3. Parked on Modification Bay'}
                </span>
              </span>
              <span className="text-[#FF4D00] font-bold">
                Frame {currentFrame + 1}/{TOTAL_FRAMES} ({playPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4D00] to-yellow-500 transition-all duration-75"
                style={{ width: `${playPercent}%` }}
              />
            </div>
          </div>

          {/* Direct Transition Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onEnterShowroom}
              className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                hasFinished || playPercent >= 90
                  ? 'bg-[#FF4D00] text-white shadow-[0_0_25px_rgba(255,77,0,0.7)] animate-pulse'
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
              }`}
            >
              <span>{hasFinished || playPercent >= 90 ? 'Open 3D Studio Plane →' : 'Skip to 3D Plane'}</span>
              <ArrowRight className="w-4 h-4" />
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
