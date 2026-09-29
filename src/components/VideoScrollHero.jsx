import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ArrowRight, Play, Wrench, Sparkles, Volume2 } from 'lucide-react';

export function VideoScrollHero({ onEnterShowroom, onProgressUpdate }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseUrl = import.meta.env.BASE_URL || '/';

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth Scroll-Driven Video Scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    let animId;
    let targetTime = 0;

    const handleScroll = () => {
      if (!containerRef.current || !video.duration) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const p = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      setProgress(p);
      if (onProgressUpdate) onProgressUpdate(p);

      // Map progress to video duration
      targetTime = p * video.duration;
    };

    const renderLoop = () => {
      if (video.duration && Math.abs(video.currentTime - targetTime) > 0.02) {
        // Fast, smooth lerp for instant responsive scrubbing
        video.currentTime += (targetTime - video.currentTime) * 0.35;
      }
      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animId = requestAnimationFrame(renderLoop);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [videoLoaded, isMobile]);

  const videoSource = isMobile
    ? `${baseUrl}videos/mobile_drive_opt.mp4`
    : `${baseUrl}videos/desktop_drive_opt.mp4`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[170vh] bg-[#0B0B0C]"
      id="hero-drive"
    >
      {/* Sticky Fullscreen Video Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Loading Spinner */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-3">
            <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Loading 4K Driving Sequence...
            </span>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          key={videoSource}
          src={videoSource}
          playsInline
          muted
          preload="auto"
          onLoadedMetadata={() => setVideoLoaded(true)}
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Subtle Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/40 pointer-events-none" />

        {/* Floating Driving HUD Overlay (Top & Center) */}
        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-mono font-bold tracking-wider text-amber-400 uppercase mb-3 border border-amber-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Mahindra Thar 4x4 • Live Highway Driving Simulation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white uppercase tracking-tight drop-shadow-2xl">
            AutoForge <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Motorsport Atelier</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-200 max-w-xl font-body drop-shadow">
            Scroll down to watch the vehicle cruise the highway, turn into the high-tech workshop shed, and enter the interactive 3D showroom plane.
          </p>
        </div>

        {/* Bottom Floating Interactive Bar */}
        <div className="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-4 pointer-events-auto z-10">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 backdrop-blur-2xl bg-[#0C1018]/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            {/* Status & Progress Bar */}
            <div className="w-full sm:w-auto flex-1">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300 font-bold uppercase flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {progress < 0.35
                      ? 'Cruising Indian Highway'
                      : progress < 0.75
                      ? 'Approaching Modification Shed'
                      : 'Docked in Workshop Bay'}
                  </span>
                </span>
                <span className="text-amber-400 font-bold">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75"
                  style={{ width: `${Math.max(5, progress * 100)}%` }}
                />
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onEnterShowroom}
                className="px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Enter 3D Showroom Plane</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Downward Scroll Hint */}
          <div className="text-center mt-3 flex items-center justify-center gap-1 text-[11px] font-mono uppercase tracking-widest text-slate-400">
            <span>Scroll Down to Drive</span>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
