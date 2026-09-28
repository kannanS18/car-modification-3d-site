import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GarageCanvas } from './3d/GarageCanvas';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorkshopSection } from './components/WorkshopSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { FooterSection } from './components/FooterSection';

export default function App() {
  // Real-world Scroll Progress (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);

  // Vehicle Customization States
  const [carModel, setCarModel] = useState('thar');
  const [carColor, setCarColor] = useState('#C2A382'); // Rocky Desert Sand (Mahindra Thar)
  const [wheelFinish, setWheelFinish] = useState('black');
  const [ledBarActive, setLedBarActive] = useState(true);
  const [bullBarActive, setBullBarActive] = useState(true);
  const [subwooferActive, setSubwooferActive] = useState(true);
  const [roofRackActive, setRoofRackActive] = useState(true);
  const [liftActive, setLiftActive] = useState(false);
  const [underglow, setUnderglow] = useState(true);
  const [headlights, setHeadlights] = useState(true);
  const [drlColor, setDrlColor] = useState('#FFFFFF');

  // Track window scroll for real-time driving simulation
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.max(0, Math.min(1, window.scrollY / scrollHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWorkshop = () => {
    document.getElementById('workshop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white font-body relative selection:bg-[#FF4D00] selection:text-white overflow-x-hidden">
      {/* Default Global Navigation */}
      <Navbar onOpenBooking={scrollToContact} />

      {/* Fixed Full-Viewport 3D Highway & Modification Bay */}
      <GarageCanvas
        scrollProgress={scrollProgress}
        carModel={carModel}
        carColor={carColor}
        wheelFinish={wheelFinish}
        ledBarActive={ledBarActive}
        bullBarActive={bullBarActive}
        subwooferActive={subwooferActive}
        roofRackActive={roofRackActive}
        liftActive={liftActive}
        underglow={underglow}
        headlights={headlights}
        drlColor={drlColor}
      />

      {/* Foreground Content Stack */}
      <div className="relative z-10 pointer-events-none">
        {/* Stage 1: Highway Drive & Indian Car Banner (Scroll: 0 - 0.25) */}
        <HeroSection
          onOpenBooking={scrollToContact}
          onDriveToGarage={scrollToWorkshop}
          scrollProgress={scrollProgress}
        />

        {/* Transitional spacer to appreciate highway scenery */}
        <div className="h-40 sm:h-56 pointer-events-none" />

        {/* Stage 2: About the Atelier & Turn to Garage Gates */}
        <div className="pointer-events-auto">
          <AboutSection onDriveToGarage={scrollToWorkshop} />
        </div>

        {/* Transitional spacer into the workshop portal */}
        <div className="h-32 sm:h-48 pointer-events-none" />

        {/* Stage 3: Inside the Workshop & Hydraulic Lift Customizer */}
        <div className="pointer-events-auto">
          <WorkshopSection
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
            onOpenBooking={scrollToContact}
          />
        </div>

        {/* Stage 4: Engineering Services */}
        <div className="pointer-events-auto">
          <ServicesSection onOpenBooking={scrollToContact} />
        </div>

        {/* Stage 5: Bespoke Archive Gallery */}
        <div className="pointer-events-auto">
          <GallerySection onOpenBooking={scrollToContact} />
        </div>

        {/* Stage 6: Client Verdicts */}
        <div className="pointer-events-auto">
          <TestimonialsSection />
        </div>

        {/* Stage 7: Workshop Contact & Commission Booking */}
        <div className="pointer-events-auto">
          <ContactSection />
        </div>

        {/* Global Footer */}
        <div className="pointer-events-auto">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}