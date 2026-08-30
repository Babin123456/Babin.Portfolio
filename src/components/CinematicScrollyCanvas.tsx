import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface CinematicScrollyCanvasProps {
  totalFrames?: number;
  className?: string;
}

const TOTAL_FRAMES_DEFAULT = 102;

export const CinematicScrollyCanvas: React.FC<CinematicScrollyCanvasProps> = ({
  totalFrames = TOTAL_FRAMES_DEFAULT,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // High precision scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth dampening physics for 120Hz/144Hz buttery scrub
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 24,
    mass: 0.2,
    restDelta: 0.0001,
  });

  const frameIndex = useTransform(smoothProgress, [0.05, 0.95], [0, totalFrames - 1]);

  // Preload all WebP frames into memory asynchronously
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${String(i).padStart(4, "0")}.webp`;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [totalFrames]);

  // Draw current frame to canvas
  const drawFrame = useCallback((indexRaw: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const index = Math.min(totalFrames - 1, Math.max(0, Math.round(indexRaw)));
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Draw with high fidelity
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Maintain aspect ratio cover / contain
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      renderW = height * imgAspect;
      offsetX = (width - renderW) / 2;
    } else {
      renderH = width / imgAspect;
      offsetY = (height - renderH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }, [totalFrames]);

  // Draw initial frame once loaded
  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(0);
    }
  }, [imagesLoaded, drawFrame]);

  // Render on scroll update
  useEffect(() => {
    return frameIndex.on("change", (latest) => {
      drawFrame(latest);
    });
  }, [frameIndex, drawFrame]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        width={544}
        height={678}
        className="w-full h-full object-cover rounded-[2.5rem] relative z-10 transition-opacity duration-500"
        style={{ opacity: imagesLoaded ? 1 : 0.6 }}
      />
      
      {/* Subtle loader glow if assets are still downloading */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-[2.5rem] z-20 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-[10px] text-muted-foreground font-mono">{loadProgress}%</span>
        </div>
      )}
    </div>
  );
};

export default CinematicScrollyCanvas;
