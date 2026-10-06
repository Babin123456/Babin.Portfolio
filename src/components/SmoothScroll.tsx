import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis for buttery-smooth 120Hz/144Hz physics-based inertial scrolling
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchInertiaExponent: 1.75,
      autoResize: true,
    });

    // Add lenis classes to html root so index.css scroll-behavior override takes effect
    document.documentElement.classList.add('lenis', 'lenis-smooth');
    window.lenis = lenis;

    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Refresh dimensions on window resize
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      delete window.lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
