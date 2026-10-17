"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionProfile } from "@/components/motion-system";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
  wobbleDistance: number;
  angle: number;
  opacity: number;
  hue: number;
  highlight: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function HeroLiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useMotionProfile();
  const [interactiveCount, setInteractiveCount] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate rising carbonation bubbles
    const bubbleCount = Math.min(85, Math.floor(width / 18));
    const bubbles: Bubble[] = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.5 + 1.2,
      speed: Math.random() * 1.8 + 0.6,
      wobbleSpeed: Math.random() * 0.04 + 0.02,
      wobbleDistance: Math.random() * 2.5 + 1,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.55 + 0.25,
      hue: Math.random() > 0.4 ? 275 : 45, // Purple & Golden Fizz
      highlight: Math.random() * 0.7 + 0.3,
    }));

    const sparks: Spark[] = [];

    // Mouse tracking for dispersion & fizzy burst
    let mouse = { x: -1000, y: -1000, active: false };

    const handlePointerMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn carbonated micro-bursts on movement
      if (Math.random() > 0.45 && sparks.length < 90) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 3.5,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 2.5 + 1,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          color: Math.random() > 0.5 ? "#d4eb56" : "#cfa4ff",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Big pop of carbonation sparkles
      for (let i = 0; i < 28; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 6 + 2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 2,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          color: i % 2 === 0 ? "#e3ed9e" : "#b598db",
        });
      }
      setInteractiveCount(prev => prev + 1);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("click", handleClick);

    // Animation render loop
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing fluid ambient light pulses
      const grad = ctx.createRadialGradient(
        width * 0.65 + Math.sin(tick * 0.015) * 40,
        height * 0.45 + Math.cos(tick * 0.015) * 30,
        50,
        width * 0.65,
        height * 0.45,
        width * 0.55
      );
      grad.addColorStop(0, "rgba(138, 43, 226, 0.16)");
      grad.addColorStop(0.5, "rgba(75, 0, 130, 0.08)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw rising soda carbonation bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speed;
        b.angle += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.angle) * b.wobbleDistance;

        // Mouse repulsion / interactive fizz swirl
        if (mouse.active) {
          const dx = currentX - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (1 - dist / 140) * 4;
            b.x += (dx / dist) * force;
            b.y += (dy / dist) * force;
          }
        }

        // Reset if reached top
        if (b.y < -20) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        // Draw bubble body with glass/effervescent highlight
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.hue === 275 
          ? `rgba(200, 160, 255, ${b.opacity * 0.35})` 
          : `rgba(255, 230, 150, ${b.opacity * 0.35})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.75})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Bubble light reflection glint
        ctx.beginPath();
        ctx.arc(currentX - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.highlight})`;
        ctx.fill();
      }

      // 3. Draw active fizz sparks / pop micro-particles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // subtle gravity
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("click", handleClick);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-live-container" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-fizz-canvas" />
      <div className="live-fizz-badge">
        <span className="live-fizz-dot" />
        <span>FIZZ ENGINE ACTIVE · CLICK & HOVER TO DISPERSE</span>
      </div>
    </div>
  );
}
