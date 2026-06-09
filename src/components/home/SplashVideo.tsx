"use client";

import { useEffect, useRef, useState } from "react";

export default function SplashVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("mahrea_splash_shown")) return;
    setVisible(true);

    const skipTimer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(skipTimer);
  }, []);

  const dismiss = () => {
    setFading(true);
    sessionStorage.setItem("mahrea_splash_shown", "1");
    setTimeout(() => setVisible(false), 600);
  };

  const handleVideoEnd = () => dismiss();

  // If video fails to load (file not added yet), skip silently
  const handleError = () => {
    sessionStorage.setItem("mahrea_splash_shown", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#3a0820] transition-opacity duration-600 ${fading ? "opacity-0" : "opacity-100"}`}
      style={{ transition: "opacity 0.6s ease" }}
    >
      <video
        ref={videoRef}
        src="/videos/opening.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleError}
        className="h-full w-full object-cover"
      />

      {/* Brand overlay — always visible */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c5962a]">
          <span
            className="text-2xl font-bold text-[#c5962a]"
            style={{ fontFamily: "serif" }}
          >
            MR
          </span>
        </div>
        <p
          className="text-3xl font-bold tracking-[0.3em] text-[#c5962a]"
          style={{ fontFamily: "serif" }}
        >
          MAHREA
        </p>
        <p className="mt-1 text-xs tracking-[0.4em] text-[#c5962a]/60">
          SPARKLE EVERYDAY
        </p>
      </div>

      {/* Skip button */}
      {showSkip && (
        <button
          onClick={dismiss}
          className="absolute bottom-10 right-8 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-black/50 hover:text-white"
          style={{ animation: "fadeIn 0.4s ease" }}
        >
          Skip
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 4l15 8-15 8V4z" />
            <line x1="19" y1="4" x2="19" y2="20" />
          </svg>
        </button>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
