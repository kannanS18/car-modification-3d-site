import React from 'react';
import { Wrench, Award } from 'lucide-react';

export function FooterSection() {
  return (
    <footer className="pt-16 pb-12 border-t border-white/10 bg-[#070708] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/40 flex items-center justify-center text-[#FF4D00]"><Wrench className="w-5 h-5" /></div>
              <span className="text-2xl font-bold font-heading tracking-wider">AUTOFORGE</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">Aerospace composite engineering, dyno-proven powertrain calibration, and titanium exhaust fabrication for supercars worldwide.</p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF4D00]">
              <Award className="w-4 h-4" />
              <span>FIA Homologated • SEMA Certified Atelier</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">Engineering</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>AWD Dyno Calibration</li>
              <li>Inconel & Titanium Exhausts</li>
              <li>Autoclave Dry Carbon Fiber</li>
              <li>Forged Monoblock Wheels</li>
              <li>PPF & Ceramic Surface Defense</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">Silverstone Paddock</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Paddock 07, Silverstone Innovation Park, Northamptonshire, UK<br/><br/>Direct: +44 (0) 20 8921 4400</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>© {new Date().getFullYear()} AUTOFORGE Atelier Ltd. All rights reserved. Powered by Three.js WebGL.</div>
          <div className="flex gap-6">
            <span>Track Protocols</span>
            <span>Terms of Commission</span>
            <span>Confidentiality</span>
          </div>
        </div>
      </div>
    </footer>
  );
}