import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { carData } from '../data/carData';
import { Send, MapPin, Phone, Clock, Mail, CheckCircle2 } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', vehicle: '', budget: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#F59E0B', '#D4AF37', '#FFFFFF'] });
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', vehicle: '', budget: '', details: '' });
    }, 5000);
  };

  const { workshopInfo } = carData.contact;

  return (
    <section id="contact" className="py-24 bg-[#080B11] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Build Allocations</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading uppercase text-white tracking-tight">COMMISSION YOUR BUILD</h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto my-4 rounded-full" />
          <p className="text-slate-300 text-sm sm:text-base">Reserve your exclusive allocation in our Silverstone calibration workshop.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl bg-[#0F131C]/90">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-white">Commission Request Received</h3>
                <p className="text-sm text-slate-300 font-body">Our chief chassis engineer will review your specs within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">Your Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Alexander Vance" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 focus:outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">Email Address *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="vance@motorsport.com" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 focus:outline-none text-sm transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">Direct Phone / WhatsApp *</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+44 7911 123456" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 focus:outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">Vehicle Platform *</label>
                    <input type="text" required value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })} placeholder="e.g. Mahindra Thar 4x4 / Ferrari 458" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 focus:outline-none text-sm transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">Target Build Budget *</label>
                  <select required value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#121622] border border-white/10 text-white focus:border-amber-400 focus:outline-none text-sm cursor-pointer">
                    <option value="">Select Budget Tier</option>
                    <option value="$10k - $25k">$10,000 - $25,000 (Stage 1 Dyno & Exhaust)</option>
                    <option value="$25k - $60k">$25,000 - $60,000 (Aero Kit & Forged Wheels)</option>
                    <option value="$60k - $120k">$60,000 - $120,000 (Full Carbon Conversion)</option>
                    <option value="$120k+">$120,000+ (Twin Turbo Track Restomod)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-2">Build Directives & Specifications</label>
                  <textarea rows={3} value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} placeholder="Tell us about your target horsepower, track requirements, or desired aesthetic upgrades..." className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 focus:outline-none text-sm resize-none transition-all" />
                </div>

                <button type="submit" className="w-full py-4 rounded-xl font-heading font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/40 hover:shadow-xl transition-all cursor-pointer active:scale-[0.99]">
                  <span>Submit Commission Dossier</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 bg-[#0F131C]/90">
              <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wider">Skunkworks Workshop</h3>
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase">Track Paddock</div>
                    <div className="font-medium text-white mt-0.5">{workshopInfo.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><Phone className="w-5 h-5" /></div>
                  <div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase">Dyno Hotline</div>
                    <div className="font-bold text-amber-400 mt-0.5">{workshopInfo.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><Clock className="w-5 h-5" /></div>
                  <div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase">Operating Hours</div>
                    <div className="font-medium text-white mt-0.5">{workshopInfo.hours}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0"><Mail className="w-5 h-5" /></div>
                  <div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase">Encrypted Telegraph</div>
                    <div className="font-medium text-white mt-0.5">{workshopInfo.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}