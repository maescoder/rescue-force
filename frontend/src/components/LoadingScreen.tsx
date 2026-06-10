"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Protect", "Rescue", "Save"];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2700;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(Math.floor((progress / duration) * 100), 100);
      setCount(percentage);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 400);
      }
    };

    requestAnimationFrame(animate);

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col justify-between p-6 overflow-hidden">
      {/* Top Left Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-xs text-red-500 uppercase tracking-[0.3em]"
      >
        Emergency Response
      </motion.div>

      {/* Center Rotating Words */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-white/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Layout */}
      <div className="w-full flex flex-col items-end gap-4">
        {/* Counter */}
        <div className="text-6xl md:text-8xl lg:text-9xl font-display text-white tabular-nums leading-none">
          {String(count).padStart(3, "0")}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[3px] bg-white/10 overflow-hidden relative shadow-[0_0_15px_rgba(255,75,75,0.2)]">
          <div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-600 to-red-400 origin-left"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}
