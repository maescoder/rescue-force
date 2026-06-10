"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DynamicMap from '@/components/DynamicMap';
import HLSBackground from '@/components/HLSBackground';
import LoadingScreen from '@/components/LoadingScreen';
import EmergencyBeacon from '@/components/EmergencyBeacon';

gsap.registerPlugin(ScrollTrigger);

export default function Report() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('Medium');
  const [locationInput, setLocationInput] = useState<string>('');

  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Life", "Rescue", "Soul", "Friend"];

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');
    const formData = new FormData(e.currentTarget);
    formData.set('urgency', urgency);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/submit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  const getUrgencyColor = (level: string) => {
    if (level === 'High') return 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    if (level === 'Medium') return 'bg-orange-500 text-white border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]';
    return 'bg-yellow-500 text-white border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]';
  };

  // Rotating roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // GSAP Animations after loading completes
  useEffect(() => {
    if (isLoading) return;

    const tl = gsap.timeline();
    tl.fromTo(".name-reveal", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: "power3.out" }
    );
    tl.fromTo(".blur-in", 
      { opacity: 0, filter: "blur(10px)", y: 20 }, 
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1, delay: 0.3, ease: "power3.out" },
      "-=1"
    );

    // Marquee animation
    gsap.to(".marquee-inner", {
      xPercent: -50,
      ease: "none",
      duration: 20,
      repeat: -1,
    });

  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <div className={`min-h-screen bg-[#050505] text-white selection:bg-red-500 selection:text-white font-sans ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* ── HERO SECTION ── */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-20">
          
          <HLSBackground src="https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8" overlayClassName="bg-black/70" />
          
          <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <div className="inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-white/5 px-2 py-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#050505] rounded-full border border-red-500/50">
                <EmergencyBeacon className="w-4 h-4 scale-75" />
                <span className="text-[13px] font-display italic text-red-400">Response</span>
              </div>
              <div className="w-px h-5 bg-white/20 mx-3"></div>
              <a href="/" className="text-sm px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">Return to Gallery</a>
            </div>
          </nav>

          <div className="relative z-10 text-center px-6 mt-12 w-full flex flex-col items-center justify-center flex-1">
            <p className="text-xs text-red-500 uppercase tracking-[0.3em] mb-8 blur-in">EMERGENCY PROTOCOL</p>
            <h1 className="text-7xl md:text-9xl font-display italic leading-[0.9] tracking-tight text-white mb-6 name-reveal text-shadow-xl">
              Report an <br />Incident
            </h1>
            <p className="text-xl md:text-3xl font-light text-gray-300 blur-in h-12">
              A <span key={roleIndex} className="font-display italic text-white animate-[role-fade-in_0.4s_ease-out] inline-block">{roles[roleIndex]}</span> is waiting for you.
            </p>

            {/* GSAP Scroll Down Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center blur-in">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">Scroll to Deploy</span>
              <div className="w-px h-16 bg-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-red-500 to-transparent animate-[scroll-down_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        </section>

        {/* ── BENTO GRID SECTION (Map & Form) ── */}
        <section className="relative z-20 bg-[#050505] py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live Map Box (Span 5) */}
            <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-[2rem] relative overflow-hidden aspect-square lg:aspect-auto group">
              {/* Halftone pattern overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
              
              <DynamicMap setLocationInput={setLocationInput} />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between z-[999] pointer-events-none">
                <span className="text-sm font-medium">Auto-Tracking Radar</span>
                <span className="text-xs text-green-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Locked</span>
              </div>
            </div>

            {/* Emergency Form Box (Span 7) */}
            <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
              {/* Halftone pattern */}
              <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

              <h2 className="text-3xl font-light mb-8 relative z-10 flex items-center gap-3">
                <EmergencyBeacon className="scale-75" /> Incident Details
              </h2>

              {status === 'success' ? (
                <div className="text-center py-20 relative z-10">
                  <div className="w-24 h-24 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-display italic text-white mb-4">Signal Broadcasted</h3>
                  <p className="text-gray-400 text-lg">Our units are converging on the coordinates.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  
                  {/* Urgency Bento Row */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> Threat Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['High', 'Medium', 'Low'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setUrgency(level)}
                          className={`py-4 rounded-2xl text-sm font-medium border transition-all duration-300 ${
                            urgency === level 
                              ? getUrgencyColor(level) 
                              : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5 hover:border-white/20'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">Target Species</label>
                      <input required name="type" placeholder="e.g. Dog, Cat, Unknown" className="w-full p-4 bg-[#050505] border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 text-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">Your Comm-Link</label>
                      <input required name="contact" placeholder="Phone or Email" className="w-full p-4 bg-[#050505] border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 text-white transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">Verified Coordinates</label>
                    <input required name="location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="Drag the map pin to auto-fill..." className="w-full p-4 bg-[#050505] border border-red-500/30 rounded-2xl focus:outline-none focus:border-red-500 text-white transition-colors" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.2em] text-gray-500 mb-3">Tactical Details</label>
                    <textarea required name="details" rows={3} placeholder="Provide situational awareness..." className="w-full p-4 bg-[#050505] border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 text-white transition-colors"></textarea>
                  </div>

                  <button type="submit" disabled={status === 'Submitting...'} className="w-full py-5 bg-white text-black font-medium rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 relative overflow-hidden group">
                    <span className="relative z-10 flex items-center gap-2">
                      {status === 'Submitting...' ? 'Transmitting...' : (
                        <>Deploy Rescue Team <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </span>
                    {/* Accent gradient hover border effect behind */}
                    <div className="absolute inset-[-2px] bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-0 animate-[gradient-shift_3s_ease_infinite]" />
                    <div className="absolute inset-[2px] bg-white rounded-xl z-0" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── MARQUEE FOOTER ── */}
        <section className="bg-[#050505] pt-12 pb-24 overflow-hidden border-t border-white/5">
          <div className="flex whitespace-nowrap marquee-inner opacity-40">
            {Array.from({ length: 15 }).map((_, i) => (
              <h2 key={i} className="text-6xl md:text-8xl font-display italic px-6 tracking-tight">
                EVERY SECOND COUNTS • RESCUE FORCE •
              </h2>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
