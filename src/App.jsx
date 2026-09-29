import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FrameScrollHero } from './components/FrameScrollHero';
import { StudioShowroomCanvas } from './3d/StudioShowroomCanvas';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { ModelSandboxView } from './components/ModelSandboxView';
import { FooterSection } from './components/FooterSection';

export default function App() {
  // Default to 'home' so the driving video entry is ALWAYS shown first
  const [currentPage, setCurrentPage] = useState('home');

  // Vehicle Customization States for the 3D Showroom Plane
  const [carModel, setCarModel] = useState('thar'); // 'thar' (new Meshy Thar) or 'ferrari'
  const [carColor, setCarColor] = useState('original'); // 'original' (Factory Original Spec default)
  const [wheelType, setWheelType] = useState('maxxis_bimbra'); // 'maxxis_bimbra' | 'fuel_contra' | 'method_bronze' | 'thar_oem'
  const [bumperLights, setBumperLights] = useState(true); // Extra Bumper Fog Pod Lights
  const [roofLights, setRoofLights] = useState(true); // Extra Roof High-Power Light Bar
  const [bullBar, setBullBar] = useState(true); // Front Heavy-Duty Bull Bar & Electric Winch
  const [roofRack, setRoofRack] = useState(true); // Overland Expedition Roof Rack & Sand Boards
  const [underglow, setUnderglow] = useState(true);
  const [headlights, setHeadlights] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [liftActive, setLiftActive] = useState(false);
  const [subwooferActive, setSubwooferActive] = useState(true);

  // Sync with URL hash for browser back/forward and deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'showroom', 'sandbox', 'services', 'about', 'gallery', 'contact'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    // On initial mount/refresh, ALWAYS default to 'home' so the driving video is seen first!
    const initialHash = window.location.hash.replace('#/', '').replace('#', '');
    if (!initialHash || initialHash === 'home') {
      setCurrentPage('home');
      window.location.hash = '#/home';
    } else if (['showroom', 'sandbox', 'services', 'about', 'gallery', 'contact'].includes(initialHash)) {
      setCurrentPage(initialHash);
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
    <div className="min-h-screen bg-[#0B0B0C] text-white font-body relative selection:bg-[#FF4D00] selection:text-white">
      {/* Global Multi-Page Navigation Bar */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* PAGE 1: DRIVING ENTRY SEQUENCE (LOCKED 100vh VIEWPORT, ZERO SCREEN MOVEMENT) */}
      {currentPage === 'home' && (
        <div className="h-screen w-screen overflow-hidden">
          <FrameScrollHero
            onEnterShowroom={() => navigateTo('showroom')}
          />
        </div>
      )}

      {/* PAGE 2: 3D STUDIO SHOWROOM PLANE (DEDICATED FULL-SCREEN 360° INSPECTION) */}
      {currentPage === 'showroom' && (
        <div className="pt-20 min-h-screen flex flex-col justify-between">
          <StudioShowroomCanvas
            carModel={carModel}
            setCarModel={setCarModel}
            carColor={carColor}
            setCarColor={setCarColor}
            wheelType={wheelType}
            setWheelType={setWheelType}
            bumperLights={bumperLights}
            setBumperLights={setBumperLights}
            roofLights={roofLights}
            setRoofLights={setRoofLights}
            bullBar={bullBar}
            setBullBar={setBullBar}
            roofRack={roofRack}
            setRoofRack={setRoofRack}
            underglow={underglow}
            setUnderglow={setUnderglow}
            headlights={headlights}
            setHeadlights={setHeadlights}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            liftActive={liftActive}
            setLiftActive={setLiftActive}
            subwooferActive={subwooferActive}
            setSubwooferActive={setSubwooferActive}
            onOpenBooking={() => navigateTo('contact')}
            onOpenSandbox={() => navigateTo('sandbox')}
          />
          <FooterSection />
        </div>
      )}

      {/* PAGE: 3D MODEL SANDBOX & ASSET INSPECTOR */}
      {currentPage === 'sandbox' && (
        <div className="min-h-screen flex flex-col justify-between">
          <ModelSandboxView onNavigate={navigateTo} />
          <FooterSection />
        </div>
      )}

      {/* PAGE 3: ENGINEERING SERVICES */}
      {currentPage === 'services' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <ServicesSection onOpenBooking={() => navigateTo('contact')} />
          <FooterSection />
        </div>
      )}

      {/* PAGE 4: ABOUT ATELIER */}
      {currentPage === 'about' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <AboutSection onDriveToGarage={() => navigateTo('showroom')} />
          <FooterSection />
        </div>
      )}

      {/* PAGE 5: BESPOKE ARCHIVE GALLERY */}
      {currentPage === 'gallery' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <GallerySection onOpenBooking={() => navigateTo('contact')} />
          <TestimonialsSection />
          <FooterSection />
        </div>
      )}

      {/* PAGE 6: COMMISSION & CONTACT */}
      {currentPage === 'contact' && (
        <div className="pt-28 min-h-screen flex flex-col justify-between">
          <ContactSection />
          <FooterSection />
        </div>
      )}
    </div>
  );
}