"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import Lenis from "lenis";

const compactQuery = "(max-width: 900px), (pointer: coarse), (hover: none)";
const finePointerQuery = "(pointer: fine) and (hover: hover)";

let activeScroll: Lenis | null = null;

function subscribeToProfile(onChange: () => void) {
  const queries = [window.matchMedia(compactQuery), window.matchMedia(finePointerQuery)];
  queries.forEach(query => query.addEventListener("change", onChange));
  return () => queries.forEach(query => query.removeEventListener("change", onChange));
}

function getProfileSnapshot() {
  return (window.matchMedia(compactQuery).matches ? 1 : 0)
    | (window.matchMedia(finePointerQuery).matches ? 2 : 0);
}

function getServerProfileSnapshot() {
  return 1;
}

export function useMotionProfile() {
  const profile = useSyncExternalStore(subscribeToProfile, getProfileSnapshot, getServerProfileSnapshot);
  const reducedMotion = useReducedMotion();

  return {
    compact: (profile & 1) !== 0,
    finePointer: (profile & 2) !== 0,
    reducedMotion: reducedMotion === true,
  };
}

export function SmoothScroll({ paused }: { paused: boolean }) {
  const { compact, finePointer, reducedMotion } = useMotionProfile();
  const instance = useRef<Lenis | null>(null);

  useEffect(() => {
    if (compact || !finePointer || reducedMotion) return;

    // Touch keeps its native inertia; desktop uses one animation frame loop.
    const scroll = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
      prevent: node => node.hasAttribute("data-native-scroll") || node.hasAttribute("data-lenis-prevent"),
    });

    instance.current = scroll;
    activeScroll = scroll;

    return () => {
      if (activeScroll === scroll) activeScroll = null;
      instance.current = null;
      scroll.destroy();
    };
  }, [compact, finePointer, reducedMotion]);

  useEffect(() => {
    if (paused) instance.current?.stop();
    else instance.current?.start();
  }, [paused, compact, finePointer, reducedMotion]);

  return null;
}

export function scrollToPagePosition(top: number, immediate = false) {
  if (typeof window === "undefined") return;

  const instant = immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (activeScroll) {
    activeScroll.scrollTo(top, { immediate: instant });
    return;
  }

  window.scrollTo({ top, behavior: instant ? "auto" : "smooth" });
}
