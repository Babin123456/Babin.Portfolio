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
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleCheckDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    const updateStickyOffset = () => {
      if (window.innerWidth < 1024) {
        setStickyTop(0);
        return;
      }
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
    window.addEventListener("resize", handleCheckDesktop);
    window.addEventListener("resize", updateStickyOffset);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleCheckDesktop);
      window.removeEventListener("resize", updateStickyOffset);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-scroll-stack="true"
      style={
        isDesktop
          ? {
              zIndex,
              top: `${stickyTop}px`,
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
            }
          : undefined
      }
      className={`relative lg:sticky w-full min-h-auto lg:min-h-screen lg:transform-gpu lg:will-change-transform ${className}`}
    >
      <div
        style={
          isDesktop
            ? {
                transform: "translate3d(0, 0, 0)",
                backfaceVisibility: "hidden",
              }
            : undefined
        }
        className={`w-full relative flex flex-col justify-between lg:min-h-screen lg:transform-gpu lg:will-change-transform ${
          isFirst
            ? "bg-transparent"
            : "bg-slate-50 dark:bg-[#070b14] rounded-t-[1.5rem] sm:rounded-t-[2.5rem] lg:rounded-t-[4rem] border-t border-slate-200/90 dark:border-white/10 lg:border-t-2 lg:border-slate-200/90 lg:dark:border-white/15 shadow-none lg:shadow-[0_-30px_90px_rgba(0,0,0,0.5)] lg:dark:shadow-[0_-40px_100px_rgba(0,0,0,0.95)] lg:before:absolute lg:before:inset-x-32 lg:before:top-0 lg:before:h-[2px] lg:before:bg-gradient-to-r lg:before:from-transparent lg:before:via-blue-500/80 lg:before:to-transparent lg:before:z-30"
        }`}
      >
        {!isFirst && (
          <div className="pt-2 sm:pt-3.5 pb-1 flex justify-center pointer-events-none select-none relative z-30">
            <div className="w-12 sm:w-20 lg:w-24 h-1 sm:h-1.5 rounded-full bg-slate-300 dark:bg-white/20 shadow-sm" />
          </div>
        )}

        <div className="relative z-10 w-full pb-8 sm:pb-14 lg:pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollStackSection;
