"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function RadarSphere({ isWarping, isHovering }: { isWarping: boolean; isHovering: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      let rotSpeed = 0.1;
      if (isHovering) rotSpeed = 0.5; // speed up on hover
      if (isWarping) rotSpeed = 2.0;  // crazy speed during warp
      meshRef.current.rotation.y += delta * rotSpeed;
      meshRef.current.rotation.x += delta * (rotSpeed * 0.5);
    }

    if (groupRef.current && isWarping) {
      // Exponentially scale up during warp to fly past camera
      groupRef.current.scale.lerp(new THREE.Vector3(50, 50, 50), 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <Sphere ref={meshRef} args={[2.5, 32, 32]}>
        <meshBasicMaterial 
          color="#00FFFF" 
          wireframe={true} 
          transparent 
          opacity={isWarping ? 1 : 0.2} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
}

function MagneticButton({ children, onClick, onHover }: { children: React.ReactNode; onClick: () => void; onHover: (v: boolean) => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    onHover(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative px-12 py-5 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/50 backdrop-blur-md rounded-full text-white text-sm font-bold tracking-widest uppercase overflow-hidden group transition-colors duration-500"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
    </motion.button>
  );
}

export default function FooterGateway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!textRef.current || !subtitleRef.current || !containerRef.current) return;

    const text = "Connecting to global rescue channels...";
    let currentText = "";
    let i = 0;
    
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      onEnter: () => {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 100, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            onComplete: () => {
              // Typewriter effect
              const interval = setInterval(() => {
                if (i < text.length) {
                  currentText += text.charAt(i);
                  if (subtitleRef.current) subtitleRef.current.innerText = currentText;
                  i++;
                } else {
                  clearInterval(interval);
                }
              }, 40);
            }
          }
        );
      },
      once: true
    });

    return () => { trigger.kill(); };
  }, []);

  const handlePortalClick = () => {
    setIsWarping(true);
    
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Sequence
    setTimeout(() => {
      setFlash(true);
    }, 1200);

    setTimeout(() => {
      // Redirect
      window.location.href = "http://localhost/pet-rescue/index.php";
    }, 1500);
  };

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] bg-[#0a0a0c] overflow-hidden flex flex-col items-center justify-center -mt-40 z-0">
      
      {/* 3D WebGL Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.5} />
          <RadarSphere isWarping={isWarping} isHovering={isHovering} />
        </Canvas>
      </div>

      {/* Volumetric ambient glow */}
      <div className={`absolute bottom-0 w-[100vw] h-[50vh] bg-cyan-500/20 blur-[120px] pointer-events-none transition-opacity duration-1000 ${isHovering ? 'opacity-100' : 'opacity-30'}`} />

      {/* Flash Overlay */}
      <div className={`absolute inset-0 bg-white z-[100] transition-opacity duration-300 pointer-events-none ${flash ? 'opacity-100' : 'opacity-0'}`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" style={{ pointerEvents: isWarping ? 'none' : 'auto' }}>
        
        <div ref={textRef} className="opacity-0">
          <h2 className="font-display text-5xl sm:text-7xl md:text-9xl text-white tracking-tighter" style={{ letterSpacing: "-3px", lineHeight: 0.9 }}>
            THE NETWORK <br />
            <em className="italic text-cyan-400 mix-blend-screen pr-2">IS ACTIVE.</em>
          </h2>
          
          <p ref={subtitleRef} className="mt-8 mb-12 text-cyan-400/80 font-mono text-sm tracking-widest min-h-[20px]">
            {/* Populated by JS */}
          </p>

          <MagneticButton onClick={handlePortalClick} onHover={setIsHovering}>
            Enter Command Center
          </MagneticButton>
        </div>

      </div>

    </section>
  );
}
