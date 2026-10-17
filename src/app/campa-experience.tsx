"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ArrowRight, ArrowDown, ArrowLeft, X, Menu, Plus, MoveUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/magicui/marquee";
import { Spotlight } from "@/components/aceternity/spotlight";
import BlurText from "@/components/reactbits/blur-text";
import StoreDialog from "@/components/store-dialog";
import BrandJourney from "@/components/brand-journey";
import { SmoothScroll, useMotionProfile } from "@/components/motion-system";

const editorialEase = [.22, 1, .36, 1] as const;

const flavours = [
  { name: "Cola", title: "THE ORIGINAL.", line: "A bold classic. A feeling like no other.", image: "/images/flavour-cola-duo.webp", color: "#b598db", number: "01", position: "cola-world" },
  { name: "Orange", title: "THE BRIGHT SIDE.", line: "Big citrus energy. Zero dull moments.", image: "/images/flavour-orange-duo.webp", color: "#ff9c4d", number: "02", position: "orange-world" },
  { name: "Lemon", title: "THE FRESH TAKE.", line: "A crisp little twist on the everyday.", image: "/images/flavour-lemon-duo.webp", color: "#d4eb56", number: "03", position: "lemon-world" },
];
const stories = [
  { image: "/images/campaign-rooftop.webp", title: "GOLDEN HOUR. OUR KIND OF HOUR.", tag: "01 — YOUR PEOPLE", className: "culture-wide", alt: "Indian friends sharing Campa on a Mumbai rooftop at golden hour" },
  { image: "/images/campaign-skate.webp", title: "MAKE YOUR OWN MOVES.", tag: "02 — YOUR PLAYGROUND", className: "culture-tall", alt: "Indian skateboarder with a Campa Cola can at a sunlit skate spot" },
  { image: "/images/campaign-citrus.webp", title: "A LITTLE EXTRA ZEST.", tag: "03 — YOUR FLAVOUR", className: "culture-small", alt: "Campa Orange and Lemon in a burst of citrus, ice and sparkling water" },
  { image: "/images/campaign-hero.webp", title: "THAT FIRST-SIP FEELING.", tag: "04 — YOUR MOMENT", className: "culture-detail", alt: "Condensation on a purple Campa Cola can surrounded by ice and cola" },
];

function Logo({ className = "" }: { className?: string }) {
  return <img className={`brand-logo ${className}`} src="/images/campa-logo.svg" alt="Campa" width={165} height={96} />;
}
function Spark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="m50 0 10 32L87 13 68 40l32 10-32 10 19 27-27-19-10 32-10-32-27 19 19-27L0 50l32-10-19-27 27 19Z" /></svg>;
}
function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 26, mass: .6 }), sy = useSpring(y, { stiffness: 180, damping: 26, mass: .6 });
  const bounds = useRef<DOMRect | null>(null);
  const { finePointer, reducedMotion, compact } = useMotionProfile();
  const enabled = finePointer && !reducedMotion && !compact;
  return <div className={`magnetic ${className}`} onPointerEnter={event => { if (enabled && event.pointerType === "mouse") bounds.current = event.currentTarget.getBoundingClientRect(); }} onPointerMove={event => { const rect = bounds.current; if (!enabled || event.pointerType !== "mouse" || !rect) return; x.set(Math.max(-10, Math.min(10, (event.clientX - rect.left - rect.width / 2) * .1))); y.set(Math.max(-10, Math.min(10, (event.clientY - rect.top - rect.height / 2) * .1))); }} onPointerLeave={() => { x.set(0); y.set(0); bounds.current = null; }}><motion.div className="magnetic-target" style={{ x: enabled ? sx : 0, y: enabled ? sy : 0 }}>{children}</motion.div></div>;
}
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { reducedMotion, compact } = useMotionProfile();
  return <motion.div className={className} initial={reducedMotion ? false : { y: compact ? 18 : 32, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: .1, margin: "0px 0px -24px 0px" }} transition={{ duration: compact ? .62 : .85, delay: compact ? Math.min(delay, .08) : delay, ease: editorialEase }}>{children}</motion.div>;
}
function Gallery({ selected, onClose }: { selected: number; onClose: () => void }) {
  const [index, setIndex] = useState(selected);
  const ref = useRef<HTMLDialogElement>(null);
  const { reducedMotion } = useMotionProfile();
  useEffect(() => {
    const el = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const paddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${parseFloat(window.getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    el?.showModal();
    for (const image of stories) { const preload = new window.Image(); preload.src = image.image; preload.decoding = "async"; }
    return () => { el?.close(); document.body.style.overflow = overflow; document.body.style.paddingRight = paddingRight; previous?.focus({ preventScroll: true }); };
  }, []);
  const story = stories[index];
  return <dialog className="campaign-gallery" data-native-scroll data-lenis-prevent ref={ref} aria-label="The Campa world campaign gallery" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div className="gallery-inner" initial={reducedMotion ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .45, ease: editorialEase }}><button className="round-button gallery-close" aria-label="Close gallery" onClick={onClose}><X /></button><div className="gallery-media"><AnimatePresence initial={false}><motion.img key={story.image} src={story.image} alt={story.alt} initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .38, ease: editorialEase }} /></AnimatePresence></div><div className="gallery-bottom"><div><span className="micro">{story.tag}</span><h3>{story.title}</h3></div><div className="gallery-controls"><button className="round-button" aria-label="Previous campaign image" onClick={() => setIndex((index + stories.length - 1) % stories.length)}><ArrowLeft size={20} /></button><span>{index + 1} / {stories.length}</span><button className="round-button" aria-label="Next campaign image" onClick={() => setIndex((index + 1) % stories.length)}><ArrowRight size={20} /></button></div></div></motion.div>
  </dialog>;
}

function CampaignHeader({ menuOpen, onMenuChange, onShop }: { menuOpen: boolean; onMenuChange: (open: boolean) => void; onShop: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const lastScrolled = useRef(false);
  const { scrollY } = useScroll();
  useEffect(() => {
    if (!menuOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onMenuChange(false); };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", escape); };
  }, [menuOpen, onMenuChange]);
  useMotionValueEvent(scrollY, "change", value => {
    const next = value > 56;
    if (lastScrolled.current !== next) { lastScrolled.current = next; setScrolled(next); }
  });
  return <header className={`campaign-header ${scrolled ? "is-scrolled" : ""}`}>
    <a href="#" aria-label="Campa home"><Logo /></a>
    <nav className={menuOpen ? "campaign-nav is-open" : "campaign-nav"} data-native-scroll aria-label="Main navigation"><a href="#flavours" onClick={() => onMenuChange(false)}>Flavours <span>01</span></a><a href="#our-story" onClick={() => onMenuChange(false)}>Our story <span>02</span></a><a href="#campa-culture" onClick={() => onMenuChange(false)}>Campa culture <span>03</span></a></nav>
    <div className="header-right"><Magnetic><button className="header-shop" onClick={onShop}>GET YOUR CAMPA <ArrowUpRight size={17} /></button></Magnetic><button className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => onMenuChange(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
  </header>;
}

function FlavourWorlds({ onShop }: { onShop: () => void }) {
  const [active, setActive] = useState(0);
  const { compact, finePointer, reducedMotion } = useMotionProfile();
  return <div className="flavour-worlds">{flavours.map((flavour, index) => <motion.article key={flavour.name} className={`flavour-world ${flavour.position} ${active === index ? "is-active" : ""}`} style={{ "--world-colour": flavour.color, "--duo-image": `url("${flavour.image}")` } as CSSProperties} onPointerEnter={event => { if (finePointer && !compact && event.pointerType === "mouse") setActive(index); }} onFocus={() => setActive(index)} initial={reducedMotion ? false : { opacity: 0, y: compact ? 16 : 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: compact ? .6 : .85, delay: compact ? 0 : index * .1, ease: editorialEase }}>
    <div className="world-image"><img src={flavour.image} alt={`Campa ${flavour.name} can and bottle together with ice and sparkling splashes`} width={1122} height={1402} loading="lazy" decoding="async" /></div><div className="world-shade" />
    <button className="world-selector" onClick={() => setActive(index)} aria-label={`Explore Campa ${flavour.name}`} aria-pressed={active === index}><span className="micro">{flavour.number} /</span><ArrowUpRight size={24} /></button>
    <div className="world-caption"><span className="micro">{flavour.title}</span><h3>{flavour.name.toUpperCase()}<span>®</span></h3><span className="world-formats">IN CANS. IN BOTTLES. ALWAYS CAMPA.</span><p>{flavour.line}</p><button className="world-shop" onClick={onShop}>FIND YOUR {flavour.name.toUpperCase()} <ArrowRight size={18} /></button></div>
  </motion.article>)}</div>;
}

export default function CampaExperience() {
  const [storeOpen, setStoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gallery, setGallery] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const cultureRef = useRef<HTMLElement>(null);
  const togetherRef = useRef<HTMLElement>(null);
  const { reducedMotion: reduce, compact } = useMotionProfile();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroMotion = useSpring(heroProgress, { stiffness: 170, damping: 30, mass: .5 });
  const heroY = useTransform(heroMotion, [0, 1], [0, compact ? 12 : 64]);
  const heroScale = useTransform(heroMotion, [0, 1], [1.01, compact ? 1.015 : 1.055]);
  const copyY = useTransform(heroMotion, [0, .8], [0, compact ? 0 : -40]);
  const copyOpacity = useTransform(heroMotion, [0, .8], compact ? [1, 1] : [1, .05]);
  const { scrollYProgress: cultureProgress } = useScroll({ target: cultureRef, offset: ["start end", "end start"] });
  const cultureMotion = useSpring(cultureProgress, { stiffness: 170, damping: 30, mass: .5 });
  const cultureY = useTransform(cultureMotion, [0, 1], compact ? [0, 0] : [18, -18]);
  const { scrollYProgress: togetherProgress } = useScroll({ target: togetherRef, offset: ["start end", "end start"] });
  const togetherMotion = useSpring(togetherProgress, { stiffness: 170, damping: 30, mass: .5 });
  const togetherY = useTransform(togetherMotion, [0, 1], compact ? [10, -10] : [28, -28]);
  const closeStore = useCallback(() => setStoreOpen(false), []);
  const closeGallery = useCallback(() => setGallery(null), []);
  const openStore = useCallback(() => { setMenuOpen(false); setStoreOpen(true); }, []);

  return <MotionConfig reducedMotion="user" transition={{ duration: .75, ease: editorialEase }}>
    <SmoothScroll paused={storeOpen || gallery !== null || menuOpen} />
    <a className="skip-link" href="#main">Skip to content</a>
    <motion.div className="reading-progress" style={{ scaleX: progress }} />
    <CampaignHeader menuOpen={menuOpen} onMenuChange={setMenuOpen} onShop={openStore} />
    <main id="main">
      <section className="campaign-hero" ref={heroRef} aria-labelledby="hero-title">
        <motion.div className="hero-photograph" style={{ y: reduce ? 0 : heroY, scale: reduce ? 1 : heroScale }}><picture><source media="(max-width: 560px)" srcSet="/images/flavour-cola-duo.webp" /><img src="/images/campaign-cola-duo.webp" width={1672} height={941} alt="An ice-cold Campa Cola can and bottle together in a splash of cola and ice" fetchPriority="high" /></picture></motion.div>
        <div className="hero-shade" /><div className="film-grain" />
        <motion.div className="hero-copy" style={{ y: reduce ? 0 : copyY, opacity: reduce ? 1 : copyOpacity }}>
          <motion.div className="hero-kicker micro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3, duration: .8 }}><span className="status-dot" /> AN INDIAN ORIGINAL. AN ALL-NEW ENERGY.</motion.div>
          <h1 id="hero-title"><span className="headline-mask"><motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .15, ease: [.16, 1, .3, 1] }}>BORN</motion.span></span><span className="headline-mask"><motion.span className="outline-text" initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .3, ease: [.16, 1, .3, 1] }}>ORIGINAL.</motion.span></span></h1>
          <motion.div className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: 1 }}><p>Some flavours follow the crowd.<br />This one has a country behind it.</p><a className="line-link" href="#flavours">MEET YOUR NEW OLD FAVOURITE <ArrowUpRight size={19} /></a></motion.div>
        </motion.div>
        <Magnetic className="hero-orb-wrap"><a className="hero-orb" href="#flavours" aria-label="Explore the Campa flavours"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="circle-path" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" /></defs><text><textPath href="#circle-path" textLength="282">CRACK OPEN A GOOD TIME · CRACK OPEN A GOOD TIME · </textPath></text></svg><ArrowDown size={29} /></a></Magnetic>
        <div className="hero-bottom"><span className="micro">EST. 1977 <span className="tiny-cross">✳</span> ALWAYS AHEAD OF THE CURVE.</span><a href="#our-story" className="hero-scroll micro"><span className="scroll-track"><i /></span> SCROLL TO FEEL IT</a><span className="hero-index micro">01 <span>/ THE ORIGINAL</span></span></div>
        <span className="hero-side micro">REFRESHMENT, WITH A POINT OF VIEW.</span>
      </section>

      <BrandJourney relianceSourceUrl="https://www.ril.com/ar2022-23/financial-performance-and-review.html" />

      <section className="campaign-film" aria-label="The Campa life: same roots, no rules"><motion.img src="/images/campaign-rooftop.webp" alt="Friends on a Mumbai rooftop sharing Campa at sunset" width={1536} height={1024} loading="lazy" decoding="async" initial={reduce ? false : { scale: compact ? 1.025 : 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: compact ? .85 : 1.3, ease: editorialEase }} /><div className="film-shade" /><div className="film-topline micro"><span>THE CAMPA LIFE / VOL. 01</span><span>MUMBAI, INDIA ↗</span></div><Reveal className="film-title"><h2>SAME ROOTS.<br /><span>NO RULES.</span></h2></Reveal><button className="film-button" onClick={() => setGallery(0)} aria-label="Open the rooftop campaign photograph"><Plus size={23} /><span>STEP INTO OUR WORLD</span></button></section>

      <section className="flavour-universe" id="flavours" aria-labelledby="flavour-title"><div className="section-meta"><span className="micro">02 / THE FLAVOUR UNIVERSE</span><span className="micro">THREE ORIGINALS. ENDLESS POSSIBILITIES.</span></div><div className="flavour-intro"><Reveal><h2 id="flavour-title">PICK A MOOD.<br /><span className="serif-line">Make it yours.</span></h2></Reveal><Reveal delay={.1}><p>Bold, bright or a little unexpected.<br />There’s a Campa with your name on it.</p><ArrowDown size={30} strokeWidth={1} /></Reveal></div>
        <FlavourWorlds onShop={openStore} />
      </section>

      <div className="energy-marquee" aria-hidden="true"><Marquee pauseOnHover><span>MADE OF INDIA.</span><Spark /><span className="marquee-outline">MADE FOR NOW.</span><Spark /></Marquee></div>

      <section className="culture-section" id="campa-culture" ref={cultureRef} aria-labelledby="culture-title"><div className="section-meta"><span className="micro">03 / CULTURE, UNCAPPED</span><span className="micro">OUT OF THE ORDINARY. INTO YOUR EVERYDAY.</span></div><div className="culture-heading"><Reveal><span className="micro culture-eyebrow">THE STREETS. THE SUNSETS. THE SPONTANEOUS.</span><h2 id="culture-title">THIS IS<br /><span className="serif-line">our kind of</span><span>GOOD TIME.</span></h2></Reveal><motion.div className="culture-note" style={{ y: reduce ? 0 : cultureY }}><Spark /><p>For the ones who make<br />their own plans.<br />And their own rules.</p><span className="micro">#THECAMPAKIND</span></motion.div></div>
        <div className="culture-grid">{stories.map((story, index) => <Reveal key={story.tag} className={`culture-tile ${story.className}`} delay={index % 2 * .1}><button className="culture-photo" onClick={() => setGallery(index)} aria-label={`View ${story.title}`}><img src={story.image} alt={story.alt} loading="lazy" width={1200} height={900} /><span className="photo-plus"><Plus size={24} /></span><span className="photo-label micro">{story.tag}</span></button><div className="culture-caption"><h3>{story.title}</h3><ArrowUpRight size={19} /></div></Reveal>)}</div>
      </section>

      <section className="together-section" ref={togetherRef} aria-labelledby="together-title"><Spotlight className="together-spotlight" fill="#b56ace" /><div className="section-meta micro"><span>BEST SERVED CHILLED.</span><span>BETTER SERVED TOGETHER.</span></div><h2 id="together-title"><span>GOOD.</span><span className="serif-line">Together.</span></h2><motion.img className="together-hands" src="/images/campa-hero-bottles.png" alt="Friends raising Campa bottles together with splashes of cola" width={1440} height={760} loading="lazy" style={{ y: reduce ? 0 : togetherY }} /><span className="together-caption micro">HERE’S TO THE MOMENTS THAT BECOME MEMORIES.</span></section>

      <section className="find-section"><Reveal><span className="micro">YOUR NEXT GOOD TIME STARTS HERE.</span><h2>LESS THINKING.<br /><span className="serif-line"><BlurText text="More sipping." delay={70} /></span></h2></Reveal><Magnetic><Button className="find-button" onClick={() => setStoreOpen(true)}><span>FIND YOUR<br />CAMPA</span><MoveUpRight size={36} strokeWidth={1} /></Button></Magnetic></section>
    </main>
    <footer className="campaign-footer"><div className="footer-topline"><a href="#" aria-label="Campa home"><Logo /></a><span className="micro">AN INDIAN ORIGINAL.<br />A FEELING LIKE NO OTHER.</span><a className="line-link" href="#main">BACK TO THE TOP <ArrowUpRight size={18} /></a></div><div className="footer-word" aria-hidden="true">CAMPA<span>®</span></div><div className="footer-credits micro"><span>© 2026 CAMPA / CONCEPT EXPERIENCE</span><span className="jcl-credit">JIO CREATIVITY LABS <span>✳</span> MADE TO FEEL DIFFERENT.</span><span>PRODUCT MARKS BELONG TO THEIR OWNERS.</span></div></footer>
    <AnimatePresence>{storeOpen && <StoreDialog onClose={closeStore} />}</AnimatePresence>
    {gallery !== null && <Gallery selected={gallery} onClose={closeGallery} />}
  </MotionConfig>;
}
