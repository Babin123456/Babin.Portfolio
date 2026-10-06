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

const StudyBackground = () => {
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

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle pool
    const particleCount = Math.min(50, Math.max(24, Math.floor((window.innerWidth * 45) / 1440)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isTeal = i % 2 === 0;
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || 800),
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: isTeal ? 1.8 + Math.random() * 1.6 : 1.5 + Math.random() * 1.5,
        colorType: isTeal ? "teal" : "blue",
        baseAlpha: 0.45 + Math.random() * 0.4,
        alpha: 0.6,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        pulseOffset: Math.random() * Math.PI * 2,
      });
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

    // Intersection observer to halt render when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let tick = 0;

    const render = () => {
      if (!isVisible) {
        return;
      }

      tick += 0.03;
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();
      const maxDist = 110;
      const maxDistSq = maxDist * maxDist;

      // 1. Draw entanglement connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            // In light mode, use higher contrast opacity
            const factor = dark ? 0.35 : 0.45;
            const lineAlpha = (1 - dist / maxDist) * factor * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            const isTeal = p1.colorType === "teal";
            ctx.strokeStyle = isTeal
              ? dark
                ? `rgba(137, 211, 189, ${lineAlpha})`
                : `rgba(13, 148, 136, ${lineAlpha * 1.2})`
              : dark
                ? `rgba(59, 130, 246, ${lineAlpha})`
                : `rgba(29, 78, 216, ${lineAlpha * 1.2})`;

            ctx.lineWidth = dark ? 0.95 : 1.15;
            ctx.stroke();
          }
        }
      }

      // 2. Mouse interaction: Web spreading away from cursor on hover (repel force)
      const isScrolling = Boolean((window as any).lenis?.isScrolling);
      if (mouse.active && !isScrolling) {
        const mouseRepelDist = 150;
        const mouseRepelDistSq = mouseRepelDist * mouseRepelDist;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRepelDistSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            // Strong dynamic repulsion pushing particles outward away from cursor
            const force = ((mouseRepelDist - dist) / mouseRepelDist) * 1.8;
            p.vx += (dx / dist) * force * 0.45;
            p.vy += (dy / dist) * force * 0.45;

            // Draw subtle tension web lines while pushing away
            const factor = dark ? 0.4 : 0.55;
            const laserAlpha = (1 - dist / mouseRepelDist) * factor;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);

            const tealLaser = dark
              ? `rgba(137, 211, 189, ${laserAlpha * 0.6})`
              : `rgba(13, 148, 136, ${laserAlpha * 0.6})`;
            const blueLaser = dark
              ? `rgba(59, 130, 246, ${laserAlpha * 0.6})`
              : `rgba(29, 78, 216, ${laserAlpha * 0.6})`;

            ctx.strokeStyle = p.colorType === "teal" ? tealLaser : blueLaser;
            ctx.lineWidth = dark ? 0.8 : 1.0;
            ctx.stroke();
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

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-90 dark:opacity-85 transform-gpu will-change-transform"
      aria-hidden="true"
    />
  );
};

export default StudyBackground;
