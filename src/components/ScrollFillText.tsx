import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StudyBackground from "./StudyBackground";

// Ensure GSAP ScrollTrigger plugin is registered once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollFillTextProps {
  text?: string;
  className?: string;
}

const ScrollFillText: React.FC<ScrollFillTextProps> = ({
  text = "Babin Bid",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textFillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textFillRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const fillEl = textFillRef.current;

    const setClip = (percentage: number) => {
      if (!fillEl) return;
      const val = `inset(${percentage.toFixed(2)}% 0 0 0)`;
      fillEl.style.clipPath = val;
      (fillEl.style as CSSStyleDeclaration & { WebkitClipPath: string }).WebkitClipPath = val;
    };

    if (prefersReducedMotion) {
      setClip(0);
      return;
    }

    // Set initial unrevealed state
    setClip(100);

    // Use GSAP's matchMedia so switching between mobile and desktop automatically
    // rebuilds the triggers and recalculates positions without breaking animations
    const mm = gsap.matchMedia();

    // Mobile viewport
    mm.add("(max-width: 767px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 96%",
        end: "top 83%",
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const inset = p >= 0.94 ? 0 : Math.max(0, (1 - p) * 100);
          setClip(inset);
        },
      });
    });

    // Tablet and Desktop viewports
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 95%",
        end: "top 78%",
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const inset = p >= 0.94 ? 0 : Math.max(0, (1 - p) * 100);
          setClip(inset);
        },
      });
    });

    // Fail-safe scroll listener: If the user is near or at the bottom of the page,
    // guarantee the text is 100% fully filled regardless of device viewport nuances
    const handleScrollSafety = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && maxScroll - scrollY <= 60) {
        setClip(0);
      }
    };

    window.addEventListener("scroll", handleScrollSafety, { passive: true });

    // Handle window resize dynamically to refresh Lenis and recalculate triggers
    const handleWindowResize = () => {
      if (window.lenis) {
        window.lenis.resize();
      }
      ScrollTrigger.refresh();
      handleScrollSafety();
    };

    window.addEventListener("resize", handleWindowResize);

    // Sync seamlessly with Lenis smooth scrolling if active
    const handleLenisScroll = () => {
      ScrollTrigger.update();
      handleScrollSafety();
    };

    if (window.lenis) {
      window.lenis.on("scroll", handleLenisScroll);
    }

    // Refresh ScrollTrigger when web fonts finish loading
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Recalculate dimensions shortly after mount to ensure layout stability
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      handleScrollSafety();
    }, 250);

    // Watch for dynamic size changes (e.g. mobile address bar or image loads)
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
      handleScrollSafety();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScrollSafety);
      window.removeEventListener("resize", handleWindowResize);
      if (window.lenis) {
        window.lenis.off("scroll", handleLenisScroll);
      }
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`footer-section w-full min-h-[22vh] sm:min-h-[26vh] lg:min-h-[28vh] pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 flex flex-col items-center justify-center relative overflow-hidden select-none ${className}`}
      role="img"
      aria-label={text}
    >
      {/* 1. Interactive Floating Dot-Dot Particles */}
      <StudyBackground particleCount={18} showLines={false} />

      {/* 2. Compact Centered Animated Text Layer */}
      <div className="scroll-fill-container relative z-10 my-auto mb-2 sm:mb-4">
        {/* Base text (muted/unfilled state) */}
        <span
          className="scroll-text-base select-none pointer-events-none"
          aria-hidden="true"
        >
          {text}
        </span>
        {/* Filled text layer revealed smoothly on scroll */}
        <span
          ref={textFillRef}
          className="scroll-text-fill text-fill-glow select-none pointer-events-none"
          aria-hidden="true"
        >
          {text}
        </span>
      </div>

      {/* 3. Luminous Glowing Light Curve - anchored to bottom-0 */}
      <div className="absolute bottom-0 inset-x-0 w-full pointer-events-none z-0 overflow-hidden leading-none h-16 sm:h-20 lg:h-24">
        {/* Soft Ambient Light Glow based on theme */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80vw] max-w-4xl h-20 bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgba(29,78,216,0.18)_0%,rgba(2,132,199,0.12)_40%,transparent_75%)] dark:bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgba(137,211,189,0.25)_0%,rgba(34,211,238,0.18)_40%,rgba(59,130,246,0.08)_65%,transparent_80%)] blur-2xl pointer-events-none" />

        {/* Luminous Light Arc SVG */}
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 inset-x-0 w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Dark mode glowing stroke */}
            <linearGradient id="lightArcGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="15%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#89D3BD" stopOpacity="1" />
              <stop offset="65%" stopColor="#22d3ee" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>

            {/* Light mode glowing stroke */}
            <linearGradient id="lightArcGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0" />
              <stop offset="15%" stopColor="#1d4ed8" stopOpacity="0.35" />
              <stop offset="35%" stopColor="#2563eb" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="1" />
              <stop offset="65%" stopColor="#0d9488" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#1d4ed8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </linearGradient>

            {/* Glow blur filter */}
            <filter id="arcGlowFilter" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Soft ambient under-fill */}
          <path
            d="M 0,120 C 380,120 520,38 720,38 C 920,38 1060,120 1440,120 Z"
            className="fill-blue-500/[0.03] dark:fill-[#89D3BD]/[0.04]"
          />

          {/* Primary glowing light curve */}
          <path
            d="M 0,120 C 380,120 520,38 720,38 C 920,38 1060,120 1440,120"
            className="stroke-[url(#lightArcGradLight)] dark:stroke-[url(#lightArcGradDark)]"
            strokeWidth="2.5"
            filter="url(#arcGlowFilter)"
          />

          {/* Core bright filament beam */}
          <path
            d="M 160,110 C 440,110 550,38 720,38 C 890,38 1000,110 1280,110"
            className="stroke-blue-600/30 dark:stroke-[#89D3BD]/70"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ScrollFillText;
