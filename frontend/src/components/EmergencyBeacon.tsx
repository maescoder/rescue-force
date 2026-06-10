"use client";
import React from 'react';

export default function EmergencyBeacon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center w-8 h-8 ${className}`}>
      {/* Outer pulsing rings */}
      <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
      <div className="absolute inset-[-4px] rounded-full border border-red-500/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
      
      {/* Core glowing dot */}
      <div className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
      <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
    </div>
  );
}
