"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, X, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function StoreDialog({ onClose }: { onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
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
      <span className="eyebrow"><MapPin size={15} /> GOOD TIMES, CLOSE BY</span>
      <h2 id="store-title">YOUR NEXT<br /><em>CAMPA MOMENT.</em></h2>
      <p>Find a nearby shop or look for your favourite flavour online.</p>
      <form onSubmit={event => { event.preventDefault(); if (!/^[1-9][0-9]{5}$/.test(pin)) { setError("Enter a valid 6-digit Indian PIN code."); setSearched(false); } else { setError(""); setSearched(true); } }}>
        <label htmlFor="pincode">YOUR PIN CODE</label>
        <div className="pin-row"><input id="pincode" placeholder="e.g. 400001" inputMode="numeric" autoComplete="postal-code" value={pin} maxLength={6} aria-invalid={!!error} aria-describedby={error ? "pin-error" : undefined} onChange={event => { setPin(event.target.value.replace(/\D/g, "")); setSearched(false); setError(""); }} /><Button type="submit" aria-label="Search this PIN code"><ArrowRight size={21} /></Button></div>
        {error && <p className="form-error" id="pin-error" role="alert">{error}</p>}
      </form>
      {searched && <div className="store-results" role="status"><p>Explore stores around <strong>{pin}</strong>.</p><a href={`https://www.google.com/maps/search/Campa+Cola+near+${pin}+India`} target="_blank" rel="noopener noreferrer">Find nearby shops <ArrowUpRight size={17} /></a><small>Store stock and opening hours may vary.</small></div>}
      <a className="retailer-link" href="https://www.jiomart.com/search/campa" target="_blank" rel="noopener noreferrer">Explore Campa on JioMart <ExternalLink size={16} /></a>
      <span className="dialog-note">Availability and delivery are confirmed by the retailer.</span>
    </motion.div>
  </motion.div>;
}


