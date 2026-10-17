"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, X, ShoppingBag } from "lucide-react";
import RetailerLinks from "@/components/retailer-links";
export default function StoreDialog({ onClose }: { onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const paddingRight = document.body.style.paddingRight;
    const overscroll = document.body.style.overscrollBehavior;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(window.getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "Tab") {
        const elements = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        else if (!dialogRef.current?.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.body.style.overscrollBehavior = overscroll;
      document.removeEventListener("keydown", handler);
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
  return <motion.div className="modal-backdrop" data-native-scroll initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition} onClick={onClose}>
    <motion.div className="store-dialog" data-native-scroll role="dialog" aria-modal="true" aria-labelledby="store-title" ref={dialogRef} initial={reducedMotion ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reducedMotion ? 0 : 16, opacity: 0 }} transition={transition} onClick={event => event.stopPropagation()}>
      <button className="dialog-close" aria-label="Close store finder" onClick={onClose}><X size={22} /></button>
      <span className="eyebrow"><ShoppingBag size={15} /> YOUR GOOD TIMES, YOUR WAY.</span>
      <h2 id="store-title">GOOD TIMES.<br /><em>DELIVERED.</em></h2>
      <p>Pick your platform. Find your Campa.<br />Set your delivery location with the retailer.</p>
      <RetailerLinks />
      <span className="retailer-availability">Product selection, stock and delivery depend on your location and are confirmed by each retailer.</span>
      <a className="nearby-store-link" href="https://www.google.com/maps/search/Campa+Cola+near+me" target="_blank" rel="noopener noreferrer">Or find a neighbourhood shop <ArrowUpRight size={16} /></a>
    </motion.div>
  </motion.div>;
}


