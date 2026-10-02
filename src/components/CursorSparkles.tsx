import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const CursorSparkles = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if user is on mobile/touch device
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const sparkles: Sparkle[] = [];
    const colors = [
      "rgba(137, 211, 189, ", // Teal primary
      "rgba(59, 130, 246, ",  // Sky blue
      "rgba(147, 197, 253, ", // Soft cyan
      "rgba(255, 255, 255, ", // White shimmer
    ];

    let lastX = -1;
    let lastY = -1;
    let isHoveringInteractive = false;

    // Detect if mouse cursor is currently over a button, link, CTA, or option
    const checkInteractive = (target: EventTarget | null) => {
      if (!target || !(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          'button, a, [role="button"], input, select, textarea, [data-interactive], [data-clickable], .cursor-pointer'
        )
      );
    };

    const handleMouseOver = (e: MouseEvent) => {
      isHoveringInteractive = checkInteractive(e.target);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const curX = e.clientX;
      const curY = e.clientY;
      isHoveringInteractive = checkInteractive(e.target);

      const dist = lastX === -1 ? 0 : Math.hypot(curX - lastX, curY - lastY);
      if (dist > 3 || lastX === -1) {
        const count = isHoveringInteractive
          ? Math.min(4, Math.max(2, Math.floor(dist / 8)))
          : Math.min(2, Math.max(1, Math.floor(dist / 14)));

        for (let i = 0; i < count; i++) {
          const colorBase = colors[Math.floor(Math.random() * colors.length)];
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.5;

          sparkles.push({
            x: curX + (Math.random() - 0.5) * 8,
            y: curY + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed + 0.15,
            size: 2.5 + Math.random() * 4,
            alpha: 0.95,
            decay: 0.02 + Math.random() * 0.02,
            color: colorBase,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
          });
        }
        lastX = curX;
        lastY = curY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    let animId: number;
    let frameCount = 0;

    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      // When hovering over buttons, CTAs, or options, continuously emit sparkles spreading outward
      if (isHoveringInteractive && lastX >= 0 && lastY >= 0 && frameCount % 3 === 0) {
        // Emit 1-2 spreading sparkles per tick
        const burstCount = Math.random() > 0.4 ? 2 : 1;
        for (let b = 0; b < burstCount; b++) {
          const colorBase = colors[Math.floor(Math.random() * colors.length)];
          const angle = Math.random() * Math.PI * 2;
          const spreadSpeed = 0.8 + Math.random() * 1.8;

          sparkles.push({
            x: lastX + (Math.random() - 0.5) * 10,
            y: lastY + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * spreadSpeed,
            vy: Math.sin(angle) * spreadSpeed - 0.2, // gentle float upward
            size: 3 + Math.random() * 4,
            alpha: 1,
            decay: 0.018 + Math.random() * 0.015,
            color: colorBase,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.25,
          });
        }
      }

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        ctx.fillStyle = `${s.color}${s.alpha})`;
        drawStar(0, 0, 4, s.size, s.size * 0.35);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default CursorSparkles;
