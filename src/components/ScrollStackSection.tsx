import { useRef, useState, useEffect, ReactNode } from "react";

interface ScrollStackSectionProps {
  children: ReactNode;
  zIndex: number;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const ScrollStackSection = ({
  children,
  zIndex,
  className = "",
  isFirst = false,
}: ScrollStackSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState<number>(0);

  useEffect(() => {
    const updateStickyOffset = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.offsetHeight;
      const vh = window.innerHeight;
      const offset = Math.min(0, vh - height);
      setStickyTop(offset);
    };

    updateStickyOffset();

    const ro = new ResizeObserver(updateStickyOffset);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", updateStickyOffset);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateStickyOffset);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        zIndex,
        top: `${stickyTop}px`,
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
      }}
      className={`sticky w-full min-h-screen transform-gpu will-change-transform ${className}`}
    >
      <div
        style={{
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
        }}
        className={`w-full min-h-screen relative flex flex-col justify-between transform-gpu will-change-transform ${
          isFirst
            ? "bg-transparent"
            : "bg-slate-50 dark:bg-[#070b14] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] lg:rounded-t-[4rem] border-t-2 border-slate-200/90 dark:border-white/15 shadow-[0_-30px_90px_rgba(0,0,0,0.5)] dark:shadow-[0_-40px_100px_rgba(0,0,0,0.95)] before:absolute before:inset-x-12 sm:before:inset-x-32 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-blue-500/80 before:to-transparent before:z-30"
        }`}
      >
        {!isFirst && (
          <div className="pt-3.5 pb-1 flex justify-center pointer-events-none select-none relative z-30">
            <div className="w-16 sm:w-24 h-1 sm:h-1.5 rounded-full bg-slate-300 dark:bg-white/25 shadow-sm" />
          </div>
        )}

        <div className="relative z-10 w-full pb-14 sm:pb-20 md:pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollStackSection;
