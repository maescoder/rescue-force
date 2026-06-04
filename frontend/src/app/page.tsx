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
          <a href="/" onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/index.php", "fade")} className="text-3xl tracking-tight text-black font-display cursor-pointer">
            RescueForce<sup className="text-sm align-super">®</sup>
          </a>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-8">
            <a href="http://localhost/pet-rescue/index.php" onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/index.php", "fade")} className="text-sm text-black transition-colors hover:text-black/60 cursor-pointer">Home</a>
            <a href="http://localhost/pet-rescue/adoption.php" onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/adoption.php", "slideUp")} className="text-sm text-[#6F6F6F] transition-colors hover:text-black cursor-pointer">Adopt</a>
            <a href="http://localhost/pet-rescue/report_submit.php" onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/report_submit.php", "curtain")} className="text-sm text-[#6F6F6F] transition-colors hover:text-black cursor-pointer">Report</a>
            <a href="http://localhost/pet-rescue/admin_dashboard.php" onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/admin_dashboard.php", "slideUp")} className="text-sm text-[#6F6F6F] transition-colors hover:text-black cursor-pointer">Admin</a>
          </div>

          {/* CTA */}
          <a
            href="http://localhost/pet-rescue/adoption.php"
            onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/adoption.php", "slideUp")}
            className="rounded-full px-6 py-2.5 text-sm bg-black text-white hover:scale-[1.03] transition-transform cursor-pointer"
          >
            Begin Journey
          </a>
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
          <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] animate-fade-rise-delay">
            Building an intelligent rescue network for brilliant minds, fearless
            volunteers, and compassionate souls. Through the chaos, we create
            digital havens for every creature in need.
          </p>

          {/* CTA Button */}
          <a
            href="http://localhost/pet-rescue/adoption.php"
            onClick={(e) => handleNavClick(e, "http://localhost/pet-rescue/adoption.php", "slideUp")}
            className="rounded-full px-14 py-5 text-base bg-black text-white mt-12 hover:scale-[1.03] transition-transform animate-fade-rise-delay-2 cursor-pointer"
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
