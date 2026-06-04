"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PremiumFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <footer ref={containerRef} className="relative w-full bg-[#0a0a0c] pt-40 pb-16 flex flex-col items-center justify-center text-center -mt-32 z-0">
      
      {/* Top Border Glow */}
      <div className="absolute top-0 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={textRef} className="opacity-0">
        <h3 className="text-white font-display text-4xl sm:text-6xl mb-6 tracking-tight">
          RescueForce.
        </h3>
        <p className="text-white/50 text-sm font-mono tracking-[0.3em] uppercase mb-16">
          Thank you by the GC coders.
        </p>
        
        <div className="flex gap-6 justify-center items-center text-white/30 text-xs tracking-wider">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span>|</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>

    </footer>
  );
}
