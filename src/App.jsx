import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FrameScrollHero } from './components/FrameScrollHero';
import { StudioShowroomCanvas } from './3d/StudioShowroomCanvas';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { BlogSection } from './components/BlogSection';
import { ModelSandboxView } from './components/ModelSandboxView';
import { FooterSection } from './components/FooterSection';

export default function App() {
  // Default to 'home' so the driving video entry and 3D showroom are shown first
  const [currentPage, setCurrentPage] = useState('home');

  // Vehicle Customization States for the 3D Showroom Plane
  const [carModel, setCarModel] = useState('thar'); // 'thar' (Mahindra Thar) or 'ferrari'
  const [carColor, setCarColor] = useState('original'); // 'original' (Factory Original Spec default)
  const [wheelType, setWheelType] = useState('user_custom'); // 'user_custom' | 'user_rim' | 'user_tyre'
  const [underglow, setUnderglow] = useState(true);
  const [headlights, setHeadlights] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [liftActive, setLiftActive] = useState(false);

  const scrollToShowroom = () => {
    const el = document.getElementById('showroom-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sync with URL hash for browser back/forward and deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'about', 'services', 'contact', 'blog', 'sandbox'].includes(hash)) {
        setCurrentPage(hash);
      } else if (hash === 'showroom') {
        setCurrentPage('home');
        setTimeout(scrollToShowroom, 350);
      }
    };

    // On initial mount/refresh, default to 'home'
    const initialHash = window.location.hash.replace('#/', '').replace('#', '');
    if (!initialHash || initialHash === 'home') {
      setCurrentPage('home');
      window.location.hash = '#/home';
    } else if (['about', 'services', 'contact', 'blog', 'sandbox'].includes(initialHash)) {
      setCurrentPage(initialHash);
    } else if (initialHash === 'showroom') {
      setCurrentPage('home');
      setTimeout(scrollToShowroom, 400);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-body relative selection:bg-amber-500 selection:text-black">
      {/* Global Multi-Page Navigation Bar */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* PAGE 1: HOME (VIDEO DRIVE BANNER + 3D SHOWROOM PLANE DIRECTLY BELOW) */}
      {currentPage === 'home' && (
        <div className="w-full relative">
          {/* Top Video Drive Banner */}
          <FrameScrollHero
            onEnterShowroom={scrollToShowroom}
          />

          {/* 3D STUDIO SHOWROOM PLANE (DIRECTLY BELOW BANNER WITH SEAMLESS DOCKING) */}
          <div id="showroom-section" className="relative w-full min-h-screen pt-20">
            <StudioShowroomCanvas
              carModel={carModel}
              setCarModel={setCarModel}
              carColor={carColor}
              setCarColor={setCarColor}
              wheelType={wheelType}
              setWheelType={setWheelType}
              underglow={underglow}
              setUnderglow={setUnderglow}
              headlights={headlights}
              setHeadlights={setHeadlights}
              autoRotate={autoRotate}
              setAutoRotate={setAutoRotate}
              liftActive={liftActive}
              setLiftActive={setLiftActive}
              onOpenBooking={() => navigateTo('contact')}
              onOpenSandbox={() => navigateTo('sandbox')}
            />
          </div>

          <FooterSection />
        </div>
      )}

      {/* PAGE 2: ABOUT ATELIER */}
      {currentPage === 'about' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <AboutSection onDriveToGarage={() => {
            navigateTo('home');
            setTimeout(scrollToShowroom, 400);
          }} />
          <TestimonialsSection />
          <FooterSection />
        </div>
      )}

      {/* PAGE 3: BESPOKE ENGINEERING SERVICES */}
      {currentPage === 'services' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <ServicesSection onOpenBooking={() => navigateTo('contact')} />
          <GallerySection onOpenBooking={() => navigateTo('contact')} />
          <FooterSection />
        </div>
      )}

      {/* PAGE 4: BLOG & MOTORSPORT CHRONICLES */}
      {currentPage === 'blog' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <BlogSection onOpenBooking={() => navigateTo('contact')} />
          <FooterSection />
        </div>
      )}

      {/* PAGE 5: COMMISSION & CONTACT */}
      {currentPage === 'contact' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <ContactSection />
          <FooterSection />
        </div>
      )}

      {/* 3D MODEL SANDBOX & CAD INSPECTOR */}
      {currentPage === 'sandbox' && (
        <div className="min-h-screen flex flex-col justify-between">
          <ModelSandboxView onNavigate={navigateTo} />
          <FooterSection />
        </div>
      )}
    </div>
  );
}