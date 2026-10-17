"use client";

// Adapted from Magic UI, MIT (c) Magic UI. See ../LICENSES.md.
// Official registry: https://magicui.design/r/marquee.json
import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const updatePlayback = () => {
      root.dataset.motionPaused = String(!inView || document.hidden || reducedMotion.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.01 });

    observer.observe(root);
    document.addEventListener("visibilitychange", updatePlayback);
    reducedMotion.addEventListener("change", updatePlayback);
    updatePlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      reducedMotion.removeEventListener("change", updatePlayback);
    };
  }, []);

  return (
    <div
      {...props}
      ref={rootRef}
      data-motion-paused="true"
      className={cn(
        "magic-marquee",
        vertical && "magic-marquee-vertical",
        reverse && "magic-marquee-reverse",
        pauseOnHover && "magic-marquee-pause",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div key={index} className="magic-marquee-track" aria-hidden={index > 0 ? true : undefined}>
          {children}
        </div>
      ))}
    </div>
  );
}
