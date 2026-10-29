import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorType: "blue" | "teal";
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface StudyBackgroundProps {
  particleCount?: number;
  showLines?: boolean;
}

const StudyBackground = ({
  particleCount: customParticleCount,
  showLines = false,
}: StudyBackgroundProps = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const isDarkMode = () => document.documentElement.classList.contains("dark");

    // 1. Initialize particle pool
    const particleCount = customParticleCount !== undefined
      ? customParticleCount
      : Math.min(48, Math.max(20, Math.floor((window.innerWidth * 38) / 1440)));
    const particles: Particle[] = [];

    const initWidth = canvas.parentElement?.getBoundingClientRect().width || window.innerWidth;
    const initHeight = canvas.parentElement?.getBoundingClientRect().height || 800;

    for (let i = 0; i < particleCount; i++) {
      const isTeal = i % 2 === 0;
      particles.push({
        x: Math.random() * initWidth,
        y: Math.random() * initHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isTeal ? 1.6 + Math.random() * 1.5 : 1.4 + Math.random() * 1.4,
        colorType: isTeal ? "teal" : "blue",
        baseAlpha: 0.35 + Math.random() * 0.35,
        alpha: 0.5,
        pulseSpeed: 0.018 + Math.random() * 0.018,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Define render loop
    let tick = 0;

    const render = () => {
      // Keep RAF loop alive continuously so resizing and visibility toggles never permanently freeze it
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible || width === 0 || height === 0) {
        return;
      }

      tick += 0.025;
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();

      // Optional: Draw connecting constellation lines if explicitly enabled
      if (showLines) {
        const maxDist = 110;
        const maxDistSq = maxDist * maxDist;
        ctx.lineWidth = dark ? 0.95 : 1.15;
        const tealLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
        const blueLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              if (p1.colorType === "teal") {
                tealLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
              } else {
                blueLines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
              }
            }
          }
        }

        if (tealLines.length > 0) {
          ctx.beginPath();
          for (let i = 0; i < tealLines.length; i++) {
            const l = tealLines[i];
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
          }
          ctx.strokeStyle = dark ? "rgba(137, 211, 189, 0.22)" : "rgba(13, 148, 136, 0.28)";
          ctx.stroke();
        }

        if (blueLines.length > 0) {
          ctx.beginPath();
          for (let i = 0; i < blueLines.length; i++) {
            const l = blueLines[i];
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
          }
          ctx.strokeStyle = dark ? "rgba(59, 130, 246, 0.22)" : "rgba(29, 78, 216, 0.28)";
          ctx.stroke();
        }
      }

      // Mouse interaction: Gentle organic repulsion away from cursor on hover (clean without lines)
      const isScrolling = Boolean(window.lenis?.isScrolling);
      if (mouse.active && !isScrolling) {
        const mouseRepelDist = 130;
        const mouseRepelDistSq = mouseRepelDist * mouseRepelDist;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRepelDistSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const force = ((mouseRepelDist - dist) / mouseRepelDist) * 1.4;
            p.vx += (dx / dist) * force * 0.35;
            p.vy += (dy / dist) * force * 0.35;
          }
        }
      }

      // 3. Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;

        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > 1.44) {
          const speed = Math.sqrt(speedSq);
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.alpha = p.baseAlpha + Math.sin(tick * p.pulseSpeed * 10 + p.pulseOffset) * 0.2;
        p.alpha = Math.max(0.2, Math.min(1, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.colorType === "teal") {
          ctx.fillStyle = dark
            ? `rgba(137, 211, 189, ${p.alpha})`
            : `rgba(13, 148, 136, ${Math.min(1, p.alpha * 1.15)})`;
        } else {
          ctx.fillStyle = dark
            ? `rgba(59, 130, 246, ${p.alpha})`
            : `rgba(29, 78, 216, ${Math.min(1, p.alpha * 1.15)})`;
        }

        ctx.fill();
      }
    };

    // 3. Define resize handler (now particles and render are both in scope)
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const oldWidth = width;
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // When expanding width (e.g. switching from mobile to desktop), redistribute particles across full width
      if (oldWidth > 0 && width > oldWidth) {
        particles.forEach((p) => {
          if (p.x < oldWidth && Math.random() > 0.4) {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
          }
        });
      }
    };

    // Initial resize setup
    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Mouse tracker attached to section
    const section = canvas.closest("section") || canvas.parentElement;
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.active = false;
    };

    if (section) {
      section.addEventListener("mousemove", handleMouseMove, { passive: true });
      section.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // Intersection observer to track visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    // Start animation loop
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      observer.disconnect();
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [customParticleCount, showLines]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-90 dark:opacity-85 transform-gpu will-change-transform"
      aria-hidden="true"
    />
  );
};

export default StudyBackground;
