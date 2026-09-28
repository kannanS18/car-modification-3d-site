import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ChevronDown, ArrowRight, Wrench, Sparkles, CheckCircle } from 'lucide-react';

const TOTAL_FRAMES = 82;

export function FrameScrollHero({ onEnterShowroom }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

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

  // Preload all 82 extracted image frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${baseUrl}frames/${folder}/frame_${numStr}.jpg`;

      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (i === 1 && canvasRef.current) {
          drawFrame(img);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [folder, baseUrl]);

  // Draw image to canvas with 'cover' aspect ratio
  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    // Calculate scale and position to cover canvas completely
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, nx, ny, nw, nh);
  }, []);

  // Handle Resize for Canvas high DPI
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      // Re-draw current frame
      const currentImg = imagesRef.current[currentFrameIndex];
      if (currentImg) {
        drawFrame(currentImg);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [currentFrameIndex, drawFrame]);

  // Scroll Listener: Maps scroll progress directly to frame index
  useEffect(() => {
    let animId;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      // Progress 0 to 1
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

      if (targetIndex !== currentFrameIndex) {
        setCurrentFrameIndex(targetIndex);
        const img = imagesRef.current[targetIndex];
        if (img) {
          drawFrame(img);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentFrameIndex, drawFrame]);

  const loadPercent = Math.round((imagesLoaded / TOTAL_FRAMES) * 100);
  const scrollPercent = Math.round(((currentFrameIndex + 1) / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[180vh] bg-[#0B0B0C]"
      id="hero-drive"
    >
      {/* Sticky Fullscreen Canvas Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#0B0B0C]">
        {/* Loading Overlay */}
        {imagesLoaded < 15 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30 gap-3">
            <div className="w-12 h-12 border-3 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF4D00] font-bold">
              Caching Frame Sequence ({loadPercent}%)...
            </span>
          </div>
        )}

        {/* High-Performance Canvas for 60fps/120fps scrubbing */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Subtle Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/50 pointer-events-none" />

        {/* Top HUD Overlay */}
        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none z-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-mono font-bold tracking-wider text-[#FF4D00] uppercase mb-3 border border-[#FF4D00]/40 backdrop-blur-md shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
            <span>Mahindra Thar 4x4 • Frame-by-Frame Garage Entry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white uppercase tracking-tight drop-shadow-2xl">
            AutoForge <span className="theme-gradient-text">Motorsport Atelier</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-200 max-w-xl font-body drop-shadow">
            Scroll down to advance the vehicle through the workshop doors directly onto the modification hoist.
          </p>
        </div>

        {/* Bottom Interactive Control Deck */}
        <div className="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-4 pointer-events-auto z-20">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            {/* Status & Scrub Bar */}
            <div className="w-full sm:w-auto flex-1">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#FF4D00]" />
                  <span>
                    {scrollPercent < 35
                      ? 'Approaching Glass Workshop Doors'
                      : scrollPercent < 80
                      ? 'Entering Neon Modification Shed'
                      : 'Parked on Hydraulic Hoist Bay'}
                  </span>
                </span>
                <span className="text-[#FF4D00] font-bold">
                  Frame {currentFrameIndex + 1}/{TOTAL_FRAMES} ({scrollPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF4D00] to-yellow-500 transition-all duration-75"
                  style={{ width: `${scrollPercent}%` }}
                />
              </div>
            </div>

            {/* Direct Jump Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onEnterShowroom}
                className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-[#FF4D00] hover:bg-[#E03B00] text-white shadow-[0_0_20px_rgba(255,77,0,0.5)] transition-all cursor-pointer group"
              >
                <span>Enter 3D Studio Plane</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Downward Scroll Hint */}
          <div className="text-center mt-3 flex items-center justify-center gap-1 text-[11px] font-mono uppercase tracking-widest text-gray-400">
            <span>Scroll Down to Advance Car</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#FF4D00] animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
