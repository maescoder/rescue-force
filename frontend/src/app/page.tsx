"use client";
import dynamic from "next/dynamic";
import VideoHero from "@/components/VideoHero";

import gsap from "gsap";

const AnimalScroll = dynamic(() => import("@/components/ScrollExperience"), { ssr: false });
const PremiumFooter = dynamic(() => import("@/components/PremiumFooter"), { ssr: false });

export default function Home() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, transitionType: "fade" | "slideUp" | "curtain") => {
    e.preventDefault();
    
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Create an overlay div for the transition effect
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);

    if (transitionType === "fade") {
      overlay.style.backgroundColor = "#000000";
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.inOut", onComplete: () => window.location.href = url });
    } else if (transitionType === "slideUp") {
      overlay.style.backgroundColor = "#0a0a0c";
      gsap.fromTo(overlay, { y: "100%" }, { y: "0%", duration: 0.8, ease: "power4.inOut", onComplete: () => window.location.href = url });
    } else if (transitionType === "curtain") {
      overlay.style.backgroundColor = "#ffffff";
      gsap.fromTo(overlay, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, duration: 0.6, ease: "expo.inOut", onComplete: () => window.location.href = url });
    }
  };

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost/pet-rescue";

  return (
    <main className="relative w-full overflow-hidden bg-white">

      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO SECTION                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full overflow-hidden">

        {/* Video Background */}
        <VideoHero />

        {/* ── NAVIGATION BAR ── */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          {/* Logo */}
          <a href="/" onClick={(e) => handleNavClick(e, "/", "fade")} className="text-3xl tracking-tight text-black font-display cursor-pointer">
            RescueForce<sup className="text-sm align-super">®</sup>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" onClick={(e) => handleNavClick(e, "/", "fade")} className="text-sm text-black transition-colors hover:text-black/60 cursor-pointer">Home</a>
            <a href="/adopt" onClick={(e) => handleNavClick(e, "/adopt", "slideUp")} className="text-sm text-[#6F6F6F] transition-colors hover:text-black cursor-pointer">Adopt</a>
            <a href="/report" onClick={(e) => handleNavClick(e, "/report", "curtain")} className="text-sm text-[#6F6F6F] transition-colors hover:text-black cursor-pointer">Report</a>
            <a href="/admin" onClick={(e) => handleNavClick(e, "/admin", "slideUp")} className="text-sm text-[#6F6F6F] transition-colors hover:text-black cursor-pointer">Admin</a>
          </div>
        </nav>

        {/* ── HERO CONTENT ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
          style={{ paddingTop: "calc(8rem - 75px)" }}
        >
          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal animate-fade-rise"
            style={{ lineHeight: 0.95, letterSpacing: "-2.46px", color: "#000000" }}
          >
            Beyond <em className="text-[#6F6F6F] italic">silence,</em> we rescue{" "}
            <em className="text-[#6F6F6F] italic">the voiceless.</em>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium animate-fade-rise-delay">
            Building an intelligent rescue network for brilliant minds, fearless
            volunteers, and compassionate souls. Through the chaos, we create
            digital havens for every creature in need.
          </p>

          {/* CTA Button */}
          <a
            href="/adopt"
            onClick={(e) => handleNavClick(e, "/adopt", "slideUp")}
            className="rounded-full px-14 py-5 text-base font-medium bg-white/30 backdrop-blur-md text-black border border-white/50 mt-12 hover:bg-white/60 transition-colors animate-fade-rise-delay-2 cursor-pointer shadow-sm"
          >
            Begin Journey
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 3D ANIMAL SCROLL EXPERIENCE                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <AnimalScroll />

      {/* ═══════════════════════════════════════════════════ */}
      {/* PREMIUM FOOTER                                     */}
      {/* ═══════════════════════════════════════════════════ */}
      <PremiumFooter />

    </main>
  );
}
