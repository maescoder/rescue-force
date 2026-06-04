"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { X, Target } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

// ─── DATA PANEL ────────────────────────────────────────────────────────
function DataPanel({ animal, close }: { animal: any; close: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const narrative = animal?.narrative || "";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < narrative.length) { setTypedText(narrative.slice(0, i + 1)); i++; }
      else clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [narrative]);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  const statusColor = animal?.status === "Critical" ? "text-red-500" : animal?.status === "approved" ? "text-cyan-400" : "text-amber-400";
  const statusDot = animal?.status === "Critical" ? "bg-red-500 animate-pulse" : "bg-cyan-400";

  return (
    <div ref={panelRef} className="absolute right-0 top-0 h-full w-[45%] min-w-[320px] p-8 flex flex-col justify-center z-20 pointer-events-auto">
      <div className="bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <button onClick={close} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${statusDot}`} />
          <span className={`text-[10px] tracking-[0.3em] uppercase font-mono ${statusColor}`}>{animal?.statusLabel || "TRACKING"}</span>
        </div>

        <div className="text-white/30 text-[10px] font-mono tracking-widest mb-2">CASE #{animal?.id || "RF-0000"}</div>
        <h3 className="text-3xl font-display text-white mb-1">{animal?.name || "Unknown"}</h3>
        <p className="text-white/50 text-xs font-mono mb-8">Species: {animal?.species || "—"} • {animal?.location || "—"}</p>

        <div className="bg-white/5 rounded-xl p-4 mb-8 min-h-[80px] border border-white/5">
          <p className="text-white/70 text-xs font-mono leading-relaxed">
            <span className="text-cyan-400 font-bold">SYS &gt; </span>{typedText}<span className="animate-pulse text-white">▎</span>
          </p>
        </div>

        <a href="http://localhost/pet-rescue/adoption.php" className="block w-full py-4 bg-white hover:bg-gray-200 text-black text-xs font-bold uppercase text-center rounded-full transition-colors tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          Fund Recovery
        </a>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────
export default function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [activeCase, setActiveCase] = useState<any | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Asset mapping based on user's assets/images
  const photoMapping = [
    "/images/gallery/bruno.jpg",
    "/images/gallery/luna.jpg",
    "/images/gallery/rescue1.jpeg",
    "/images/gallery/rescue10.jpg",
    "/images/gallery/rescue11.jpg",
    "/images/gallery/rescue12.jpg",
    "/images/gallery/rescue13.jpg",
    "/images/gallery/rescue14.jpg",
    "/images/gallery/rescue2.jpg",
  ];

  useEffect(() => {
    fetch("http://localhost/pet-rescue/api/get_adoptions.php")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAdoptions(data); })
      .catch(() => {});
  }, []);

  const galleryCases = useMemo(() => {
    const customCases = [
      { id: "RF-8201", image: "/images/gallery/bruno.jpg", name: "Bruno", species: "Canis lupus familiaris", statusLabel: "RESCUED", status: "approved", location: "Suburban Zone", narrative: "Canine located trapped under debris. Minor abrasions. Fully rehabilitated and cleared for adoption." },
      { id: "RF-4922", image: "/images/gallery/luna.jpg", name: "Luna", species: "Felis catus", statusLabel: "IN PROGRESS", status: "pending", location: "Urban Grid", narrative: "Feline rescued from high-rise ledge. Severe dehydration. Responding well to IV fluids. Awaiting final clearance." },
      { id: "RF-1055", image: "/images/gallery/rescue1.jpeg", name: "Bessie", species: "Bos taurus (Cow)", statusLabel: "STABILIZED", status: "approved", location: "Rural Farm Sector", narrative: "Livestock stranded in flooded pasture. Safely relocated using heavy transport. Currently grazing in sanctuary." },
      { id: "RF-9043", image: "/images/gallery/rescue10.jpg", name: "Macaque Alpha", species: "Macaca fascicularis (Monkey)", statusLabel: "CRITICAL", status: "Critical", location: "Jungle Perimeter", narrative: "Confiscated from illegal wildlife trade. Malnourished and stressed. Extensive behavioral therapy required." },
      { id: "RF-3318", image: "/images/gallery/rescue11.jpg", name: "Stallion 7", species: "Equus ferus caballus", statusLabel: "RESCUED", status: "approved", location: "Open Range", narrative: "Equine recovered from abandoned property. Hooves required extensive farrier work. Now running free." },
      { id: "RF-7721", image: "/images/gallery/rescue12.jpg", name: "Scout", species: "Canis lupus familiaris", statusLabel: "STABILIZED", status: "pending", location: "Highway Sector", narrative: "Stray canine found navigating dense traffic. Secured by response team. Microchip scanned but unregistered." },
      { id: "RF-5109", image: "/images/gallery/rescue13.jpg", name: "Shadow", species: "Felis catus", statusLabel: "RESCUED", status: "approved", location: "Industrial Zone", narrative: "Feral feline colony rescue. Subject was trapped in machinery. Extracted without injury. Spayed and released." },
      { id: "RF-2290", image: "/images/gallery/rescue14.jpg", name: "Avian Subject", species: "Psittaciformes (Parrot)", statusLabel: "CRITICAL", status: "Critical", location: "Canopy Grid", narrative: "Exotic bird found with clipped wings in freezing temperatures. In incubator. Prognosis is guarded." },
      { id: "RF-6401", image: "/images/gallery/rescue2.jpg", name: "Wildlife X", species: "Vulpes vulpes (Fox)", statusLabel: "STABILIZED", status: "pending", location: "Forest Border", narrative: "Wild fox found entangled in fencing. Mild lacerations sutured. Awaiting release back into native habitat." }
    ];

    return customCases.map((a, i) => ({
      ...a,
      uid: `case-${i}`
    }));
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    
    const columns = gsap.utils.toArray('.gallery-column');
    columns.forEach((col: any, index: number) => {
      const speed = index === 1 ? -150 : index === 0 ? -50 : -100;
      gsap.to(col, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [galleryCases]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.02, ease: "none" });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const handlePhotoClick = (item: any) => {
    if (activeCase?.uid === item.uid) return;
    
    const state = Flip.getState('.gallery-item');
    setActiveCase(item);
    
    // Disable scrolling when modal is open
    document.body.style.overflow = "hidden";
    
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: "power4.inOut",
        absolute: true,
        zIndex: 50,
      });
    });
  };

  const closeActiveCase = () => {
    const state = Flip.getState('.gallery-item');
    setActiveCase(null);
    
    // Re-enable scrolling
    document.body.style.overflow = "";
    
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: "power4.inOut",
        absolute: true,
      });
    });
  };

  return (
    <div ref={containerRef} className="relative bg-[#0a0a0c] overflow-hidden transition-colors duration-1000 pb-0 z-10">
      
      {/* Background gradient transition from white to dark */}
      <div className="absolute top-0 left-0 w-full h-[80vh] bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

      {/* Custom Cursor Reticle */}
      <div 
        ref={cursorRef} 
        className={`fixed top-0 left-0 w-12 h-12 -ml-6 -mt-6 rounded-full border border-cyan-400/50 flex items-center justify-center pointer-events-none z-[100] transition-all duration-150 ${isHovering && !activeCase ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      >
        <Target size={16} className="text-cyan-400 animate-[spin_4s_linear_infinite]" />
        <span className="absolute -bottom-6 text-[8px] font-mono text-cyan-400 tracking-widest whitespace-nowrap">VIEW DATA</span>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-[25vh]">
        
        {/* Section Header */}
        <div className="mb-32 text-center relative z-10">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Live Rescue Network</p>
          <h2 className="font-display text-5xl sm:text-7xl text-white mix-blend-difference" style={{ letterSpacing: "-2px", lineHeight: 0.95 }}>
            Active <em className="text-white/60 italic">rescue</em> cases.
          </h2>
        </div>

        {/* Masonry Grid */}
        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 transition-opacity duration-500 ${activeCase ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          
          <div className="gallery-column flex flex-col gap-8 md:gap-12 mt-12">
            {galleryCases.slice(0, 3).map((item) => (
              <GalleryPhoto key={item.uid} item={item} isActive={activeCase?.uid === item.uid} onClick={() => handlePhotoClick(item)} onHover={setIsHovering} />
            ))}
          </div>

          <div className="gallery-column flex flex-col gap-8 md:gap-12 mt-32">
            {galleryCases.slice(3, 6).map((item) => (
              <GalleryPhoto key={item.uid} item={item} isActive={activeCase?.uid === item.uid} onClick={() => handlePhotoClick(item)} onHover={setIsHovering} />
            ))}
          </div>

          <div className="gallery-column flex flex-col gap-8 md:gap-12 mt-0">
            {galleryCases.slice(6, 9).map((item) => (
              <GalleryPhoto key={item.uid} item={item} isActive={activeCase?.uid === item.uid} onClick={() => handlePhotoClick(item)} onHover={setIsHovering} />
            ))}
          </div>

        </div>
      </div>

      {/* FLIP OVERLAY STATE */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-colors duration-700 ${activeCase ? 'bg-[#050505]/90 backdrop-blur-md pointer-events-auto' : 'bg-transparent'}`}>
        {activeCase && <div className="absolute inset-0 cursor-crosshair" onClick={closeActiveCase} />}
        
        {activeCase && (
          <div className="absolute top-1/2 left-[5%] md:left-[15%] -translate-y-1/2 w-[90vw] md:w-[70vw] max-w-[1000px] h-[65vh] flex items-center pointer-events-none">
            {/* The flipping element */}
            <div className="gallery-item h-full aspect-[3/4] relative z-10 pointer-events-auto shadow-[0_0_80px_rgba(0,255,255,0.1)]" data-flip-id={activeCase.uid}>
              <img src={activeCase.image} alt={activeCase.name} className="w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
            </div>
            
            <DataPanel animal={activeCase} close={closeActiveCase} />
          </div>
        )}
      </div>

    </div>
  );
}

function GalleryPhoto({ item, isActive, onClick, onHover }: { item: any; isActive: boolean; onClick: () => void; onHover: (v: boolean) => void }) {
  if (isActive) {
    return <div className="w-full aspect-[3/4] rounded-xl bg-transparent" />;
  }

  return (
    <div 
      className="group relative w-full aspect-[3/4] cursor-none overflow-hidden rounded-xl bg-white/5"
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div 
        className="gallery-item w-full h-full relative" 
        data-flip-id={item.uid}
      >
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] grayscale contrast-125 opacity-70 group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 shadow-[0_0_40px_rgba(0,255,255,0)] group-hover:shadow-[inset_0_0_80px_rgba(0,255,255,0.15)] transition-shadow duration-300 pointer-events-none rounded-xl" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
      </div>
    </div>
  );
}
