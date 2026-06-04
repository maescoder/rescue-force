"use client";

import { useRef, useEffect, useState } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animFrame: number;

    const checkTime = () => {
      if (!video.duration || video.paused) {
        animFrame = requestAnimationFrame(checkTime);
        return;
      }

      const { currentTime, duration } = video;
      const fadeInDuration = 0.5;
      const fadeOutStart = duration - 0.5;

      if (currentTime < fadeInDuration) {
        setVideoOpacity(currentTime / fadeInDuration);
      } else if (currentTime > fadeOutStart) {
        setVideoOpacity((duration - currentTime) / 0.5);
      } else {
        setVideoOpacity(1);
      }

      animFrame = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    video.play().catch(() => {});
    animFrame = requestAnimationFrame(checkTime);

    return () => {
      cancelAnimationFrame(animFrame);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="absolute z-0" style={{ top: "300px", inset: "auto 0 0 0" }}>
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ opacity: videoOpacity, transition: "opacity 0.15s ease" }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
    </div>
  );
}
