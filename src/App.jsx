import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FrameScrollHero } from './components/FrameScrollHero';
import { StudioShowroomCanvas } from './3d/StudioShowroomCanvas';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { FooterSection } from './components/FooterSection';

export default function App() {
  // Vehicle Customization States for the 3D Showroom Plane
  const [carModel, setCarModel] = useState('ferrari'); // 'ferrari' or 'thar'
  const [carColor, setCarColor] = useState('#FF4D00'); // Rosso Corsa Red default
  const [wheelFinish, setWheelFinish] = useState('gold');
  const [underglow, setUnderglow] = useState(true);
  const [headlights, setHeadlights] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [liftActive, setLiftActive] = useState(false);
  const [subwooferActive, setSubwooferActive] = useState(true);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToShowroom = () => {
    document.getElementById('showroom-plane')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white font-body relative selection:bg-[#FF4D00] selection:text-white overflow-x-hidden">
      {/* Global Navigation Bar */}
      <Navbar onOpenBooking={scrollToContact} />

      {/* Page 1: Scroll-Driven Frame-by-Frame SUV Driving into the Garage Shed (starts at 5s) */}
      <FrameScrollHero
        onEnterShowroom={scrollToShowroom}
      />

      {/* Page 2: The 3D Studio Plane (360° Inspection, Reflective Floor, PBR Customizer) */}
      <StudioShowroomCanvas
        carModel={carModel}
        setCarModel={setCarModel}
        carColor={carColor}
        setCarColor={setCarColor}
        wheelFinish={wheelFinish}
        setWheelFinish={setWheelFinish}
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
        onOpenBooking={scrollToContact}
      />

      {/* Supporting Content Sections */}
      <div className="relative z-10">
        <AboutSection onDriveToGarage={scrollToShowroom} />
        <ServicesSection onOpenBooking={scrollToContact} />
        <GallerySection onOpenBooking={scrollToContact} />
        <TestimonialsSection />
        <ContactSection />
        <FooterSection />
      </div>
    </div>
  );
}