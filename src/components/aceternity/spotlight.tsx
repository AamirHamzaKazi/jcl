"use client";

// Adapted from the free Aceternity UI Spotlight by Manu Arora.
// Official source: https://ui.aceternity.com/registry/spotlight.json
// Docs: https://ui.aceternity.com/components/spotlight
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({ className, fill = "white" }: { className?: string; fill?: string }) {
  return (
    <div
      className={cn("aceternity-spotlight", className)}
      style={{ "--spotlight-colour": fill } as CSSProperties}
      aria-hidden="true"
    />
  );
}
