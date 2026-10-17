"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { scrollToPagePosition, useMotionProfile } from "@/components/motion-system";

const chapters = [
  { year: "1977", label: "THE BEGINNING", headline: <>AN INDIAN<br /><em>Original.</em></>, copy: "Born in 1977, Campa became a familiar taste of growing up in India. A name shared across neighbourhood shops, summer afternoons and everyday celebrations.", footnote: "As multinational brands returned in the 1990s, Campa’s presence became quieter. The memories stayed.", theme: "origin" },
  { year: "2023", label: "THE RETURN", headline: <>THE<br /><em>Return.</em></>, copy: "Some stories deserve another chapter. Acquired by Reliance in 2022, Campa returned on 9 March 2023 with Reliance Consumer Products Limited.", footnote: "A familiar name. A fresh wave of possibility.", theme: "return" },
  { year: "NOW", label: "A LEGACY, REIMAGINED", headline: <>A LEGACY,<br /><em>Reimagined.</em></>, copy: "The original spirit, with a whole new energy. Cola, Orange and Lemon. A taste of where we come from, made for wherever we go next.", footnote: "Still our kind of refreshment. Now our kind of moment.", theme: "now" },
];

function JourneyChapter({ index, progress, active, sequential, reduce, chapterRef }: { index: number; progress: MotionValue<number>; active: boolean; sequential: boolean; reduce: boolean; chapterRef: (element: HTMLElement | null) => void }) {
  const chapter = chapters[index];
  const opacity = useTransform(progress, index === 0 ? [0, .27, .35, 1] : index === 1 ? [0, .27, .35, .62, .7, 1] : [0, .62, .7, 1], index === 0 ? [1, 1, 0, 0] : index === 1 ? [0, 0, 1, 1, 0, 0] : [0, 0, 1, 1]);
  const visibility = useTransform(opacity, value => value < .001 ? "hidden" : "visible");
  // Let each headline leave before the next enters; imagery carries the crossfade.
  const copyOpacity = useTransform(progress, index === 0 ? [0, .27, .305, 1] : index === 1 ? [0, .315, .35, .62, .655, 1] : [0, .665, .7, 1], index === 0 ? [1, 1, 0, 0] : index === 1 ? [0, 0, 1, 1, 0, 0] : [0, 0, 1, 1]);
  const imageY = useTransform(progress, index === 1 ? [.27, .4, .62, .7] : [.62, .77, 1], index === 1 ? [48, 0, 0, -16] : [24, 0, -12]);
  const copyY = useTransform(progress, index === 0 ? [.27, .305] : index === 1 ? [.315, .35, .62, .655] : [.665, .7], index === 0 ? [0, -12] : index === 1 ? [18, 0, 0, -12] : [18, 0]);
  const reveal = sequential && !reduce;

  return <motion.article
    id={`journey-${chapter.year.toLowerCase()}`}
    ref={chapterRef}
    className={`journey-chapter journey-${chapter.theme}`}
    aria-labelledby={`journey-title-${index}`}
    aria-hidden={sequential ? undefined : !active}
    style={{ opacity: sequential ? 1 : opacity, visibility: sequential ? "visible" : visibility, pointerEvents: sequential || active ? "auto" : "none" }}
  >
    <div className="journey-art" aria-hidden="true">
      {index === 0 ? <><div className="journey-print-rings" /><span className="journey-giant-year">1977</span><div className="journey-origin-mark"><span>THE GREAT INDIAN TASTE</span><img src="/images/campa-logo.svg" alt="" width={280} height={165} /><span>AN ORIGINAL SINCE 1977</span></div><span className="journey-print-caption">A VINTAGE-INSPIRED TRIBUTE</span></> : index === 1 ? <><span className="journey-return-year">2023</span><div className="journey-bottle-halo" /><motion.img className="journey-return-bottle" src="/images/campa-bottle.png" alt="" width={195} height={430} loading="lazy" style={{ y: sequential ? 0 : imageY }} /><span className="journey-visual-note">THE FAMILIAR FEELING.<br />THE FRESH CHAPTER.</span></> : <><picture className="journey-modern-picture"><source media="(max-width: 850px)" srcSet="/images/flavour-cola-duo.webp" /><motion.img className="journey-modern-photo" src="/images/campaign-cola-duo.webp" alt="" width={1672} height={941} loading="lazy" onError={event => { if (!event.currentTarget.src.endsWith("/images/campaign-hero.webp")) event.currentTarget.src = "/images/campaign-hero.webp"; }} style={{ y: sequential ? 0 : imageY }} /></picture><div className="journey-modern-shade" /><span className="journey-modern-stamp">THE NEXT<br /><strong>ORIGINAL.</strong></span></>}
      <div className="journey-grain" />
    </div>
    <motion.div
      className="journey-copy"
      initial={reveal ? { opacity: 0, y: 22 } : false}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: .15 }}
      transition={{ duration: .65, ease: [.22, 1, .36, 1] }}
      style={sequential ? undefined : { y: copyY, opacity: copyOpacity }}
    >
      <span className="journey-chapter-label"><span>{chapter.year}</span><i />{chapter.label}</span>
      <h3 id={`journey-title-${index}`}>{chapter.headline}</h3>
      <p>{chapter.copy}</p>
      <p className="journey-footnote">{chapter.footnote}</p>
      {index === 2 && <a className="journey-next" href="#flavours" tabIndex={sequential || active ? 0 : -1}>FIND YOUR ORIGINAL <ArrowUpRight size={18} /></a>}
    </motion.div>
    <span className="journey-chapter-number" aria-hidden="true">0{index + 1}<span> / 03</span></span>
  </motion.article>;
}

export default function BrandJourney({ relianceSourceUrl }: { relianceSourceUrl?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  const reduce = useReducedMotion();
  const { compact: touchLayout } = useMotionProfile();
  const sequential = compact || touchLayout || !!reduce;
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 500, damping: 32, mass: .25, restDelta: .0001 });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 850px), (max-height: 650px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useMotionValueEvent(progress, "change", value => {
    const next = value < .31 ? 0 : value < .66 ? 1 : 2;
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
  });

  function selectChapter(index: number) {
    if (sequential) {
      chapterRefs.current[index]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const viewport = root.querySelector<HTMLElement>(".journey-viewport");
    const travel = root.offsetHeight - (viewport?.offsetHeight ?? window.innerHeight);
    scrollToPagePosition(top + Math.max(0, travel) * [0, .48, .91][index], !!reduce);
  }

  return <section className={`brand-journey${sequential ? " is-sequential" : ""}`} id="our-story" ref={rootRef} aria-label="The Campa story, from 1977 to now">
    <h2 className="journey-a11y-title">Then to Now: The Campa story</h2>
    <div className="journey-viewport">
      <div className="journey-masthead"><span>01 / THEN → NOW</span><span>CAMPA / “A 50+ YEARS LEGACY”</span></div>
      <div className="journey-chapters">{chapters.map((chapter, index) => <JourneyChapter key={`${chapter.year}-${sequential ? "sequence" : "scroll"}`} index={index} progress={progress} active={active === index} sequential={sequential} reduce={!!reduce} chapterRef={element => { chapterRefs.current[index] = element; }} />)}</div>
      <div className="journey-bottom"><nav className="journey-timeline" aria-label="Choose a chapter of Campa’s story">{chapters.map((chapter, index) => <button key={chapter.year} type="button" aria-controls={`journey-${chapter.year.toLowerCase()}`} aria-current={active === index ? "step" : undefined} onClick={() => selectChapter(index)}><span className="journey-timeline-dot" /><span>{chapter.year}</span><span className="journey-timeline-label">{chapter.label}</span></button>)}</nav><span className="journey-scroll">SCROLL THROUGH THE YEARS <ArrowDown size={14} /></span></div>
    </div>
    <div className="journey-sources"><span>A STORY WITH ROOTS.</span><div><a href="https://campabeverages.com/" target="_blank" rel="noopener noreferrer">CAMPA <ArrowUpRight size={12} /></a>{relianceSourceUrl && <a href={relianceSourceUrl} target="_blank" rel="noopener noreferrer">THE RETURN, 2023 <ArrowUpRight size={12} /></a>}</div></div>
  </section>;
}
