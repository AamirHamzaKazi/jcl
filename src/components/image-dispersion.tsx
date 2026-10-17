"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { useMotionProfile } from "@/components/motion-system";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface ImageDispersionProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  intensity?: "subtle" | "vibrant" | "extreme";
  children?: React.ReactNode;
}

export default function ImageDispersion({
  src,
  alt,
  className = "",
  aspectRatio = "16/9",
  intensity = "vibrant",
  children,
}: ImageDispersionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion, compact } = useMotionProfile();
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isDispersingRef = useRef<boolean>(false);

  // Initialize interactive dispersion particles
  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const onResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // Create a grid of dispersion particles along the perimeter & surface
    const cols = 28;
    const rows = 18;
    const particles: Particle[] = [];

    const colors = [
      "#c59cf5", // Campa purple
      "#ffd15c", // Golden fizz
      "#d4eb56", // Electric lime
      "#ffffff", // Glint
      "#ea4438", // Warm red
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = (c / (cols - 1)) * width;
        const py = (r / (rows - 1)) * height;
        particles.push({
          originX: px,
          originY: py,
          x: px,
          y: py,
          vx: 0,
          vy: 0,
          size: Math.random() * 2.8 + 1.2,
          color: colors[(r + c) % colors.length],
          alpha: 0,
        });
      }
    }
    particlesRef.current = particles;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDispersing = isDispersingRef.current;
      let needsRedraw = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isDispersing) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94; // drag
          p.vy *= 0.94;
          p.alpha = Math.min(p.alpha + 0.08, 0.9);
          needsRedraw = true;
        } else {
          // Spring return to origin
          const dx = p.originX - p.x;
          const dy = p.originY - p.y;
          p.vx += dx * 0.09;
          p.vy += dy * 0.09;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(p.alpha - 0.04, 0);

          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || p.alpha > 0.01) {
            needsRedraw = true;
          }
        }

        if (p.alpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (needsRedraw || isDispersing) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  const handlePointerEnter = () => {
    setIsHovered(true);
    isDispersingRef.current = true;

    // Trigger explosive radial dispersion
    const mult = intensity === "extreme" ? 7 : intensity === "vibrant" ? 4.5 : 2.5;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    particlesRef.current.forEach(p => {
      const angle = Math.atan2(p.originY - cy, p.originX - cx) + (Math.random() - 0.5) * 0.5;
      const speed = (Math.random() * 0.8 + 0.5) * mult;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.alpha = Math.random() * 0.4 + 0.6;
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    isDispersingRef.current = false;
    setTilt({ rx: 0, ry: 0 });
  };

  const handlePointerMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || compact) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rx: -y * 14,
      ry: x * 14,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`image-dispersion-wrap ${className} ${isHovered ? "is-active" : ""}`}
      style={{ aspectRatio }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onMouseMove={handlePointerMove}
    >
      {/* 3D Tilt container */}
      <motion.div
        className="dispersion-inner"
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
      >
        <img
          src={src}
          alt={alt}
          className={`dispersion-image ${isHovered ? "dispersion-shimmer" : ""}`}
          loading="lazy"
        />

        {/* Liquid reflection sheen */}
        <div className="dispersion-sheen" aria-hidden="true" />

        {/* Effervescent particle dispersion canvas overlay */}
        <canvas ref={canvasRef} className="dispersion-canvas" aria-hidden="true" />

        {children}
      </motion.div>
    </div>
  );
}
