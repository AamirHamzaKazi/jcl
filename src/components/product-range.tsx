"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { productRanges } from "@/lib/campa-catalog";
import { useMotionProfile } from "@/components/motion-system";
import "./product-range.css";

const categories = [
  { id: "all", label: "All drinks" },
  { id: "classics", label: "Classics" },
  { id: "energy", label: "Energy" },
  { id: "refreshers", label: "Refreshers" },
] as const;

const ease = [.22, 1, .36, 1] as const;
type Category = typeof categories[number]["id"];

export default function ProductRange({ onShop }: { onShop: () => void }) {
  const [category, setCategory] = useState<Category>("all");
  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  const { compact, finePointer, reducedMotion } = useMotionProfile();
  const products = category === "all" ? productRanges : productRanges.filter(product => product.category === category);

  function moveFilter(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") next = (index + categories.length - 1) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;
    event.preventDefault();
    setCategory(categories[next].id);
    controls.current[next]?.focus({ preventScroll: true });
  }

  return <section className="campa-range" id="house-of-campa" aria-labelledby="range-title">
    <div className="range-topline"><span>THE HOUSE OF CAMPA</span><span>ONE ORIGINAL SPIRIT. A WHOLE WORLD TO DISCOVER.</span></div>
    <div className="range-heading">
      <motion.div initial={reducedMotion ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease }}>
        <span className="range-eyebrow"><span /> GO BEYOND YOUR USUAL</span>
        <h2 id="range-title">MORE WAYS<br /><span>to make it yours.</span></h2>
      </motion.div>
      <div className="range-heading-note"><span className="range-asterisk" aria-hidden="true">✳</span><p>From the classics you love to<br className="range-desktop-break" /> new energy and fresh discoveries.<br className="range-desktop-break" /> Find your next first sip.</p><ArrowDown size={24} strokeWidth={1.3} aria-hidden="true" /></div>
    </div>

    <div className="range-toolbar">
      <div className="range-filters" role="group" aria-label="Explore Campa product categories">{categories.map((item, index) => <button key={item.id} type="button" ref={element => { controls.current[index] = element; }} className={category === item.id ? "is-selected" : undefined} aria-pressed={category === item.id} aria-controls="range-products" onClick={() => setCategory(item.id)} onKeyDown={event => moveFilter(event, index)}>{item.label}{item.id === "energy" && <span className="range-filter-spark" aria-hidden="true">↗</span>}</button>)}</div>
      <span className="range-count" aria-live="polite" aria-atomic="true">{String(products.length).padStart(2, "0")} ORIGINALS TO EXPLORE</span>
    </div>

    <div id="range-products" className="range-grid">{products.map((product, index) => <motion.article
      key={`${category}-${product.id}`}
      className={`range-card range-card-${product.category}`}
      style={{ "--range-accent": product.accent } as CSSProperties}
      initial={reducedMotion ? false : { opacity: 0, y: compact ? 12 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .1 }}
      transition={{ duration: compact ? .45 : .65, delay: compact ? 0 : Math.min(index % 3 * .07, .14), ease }}
    >
      <button className="range-card-link" type="button" onClick={onShop} aria-label={`Find ${product.name} at a retailer`}>
        <div className="range-art">
          <div className="range-art-meta"><span>{product.eyebrow}</span><Plus size={17} strokeWidth={1.3} aria-hidden="true" /></div>
          <span className="range-art-word" aria-hidden="true">{product.category === "energy" ? "GO." : product.category === "refreshers" ? "AHH." : "OG."}</span>
          <span className="range-art-ring" aria-hidden="true" />
          <span className="range-pack-shadow" aria-hidden="true" />
          <motion.img className="range-pack" src={product.image} alt={`${product.name} product packaging`} width={600} height={600} loading="lazy" decoding="async" whileHover={finePointer && !compact && !reducedMotion ? { y: -8, rotate: -3, scale: 1.035 } : undefined} transition={{ duration: .65, ease }} />
          <span className="range-art-category">CAMPA / {product.category.toUpperCase()}</span>
          <span className="range-art-index" aria-hidden="true">{String(productRanges.indexOf(product) + 1).padStart(2, "0")}</span>
        </div>
        <div className="range-card-copy"><div className="range-card-formats">{product.formats.join(" / ")}</div><div className="range-card-title"><h3>{product.name.replace(/^Campa\s+/i, "")}</h3><span className="range-card-arrow"><ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" /></span></div><p>{product.description}</p><span className="range-card-cta">FIND YOUR CAMPA <ArrowUpRight size={13} aria-hidden="true" /></span></div>
      </button>
    </motion.article>)}</div>

    <div className="range-footer"><p>Different moods. Different moments.<br /><strong>Always your kind of Campa.</strong></p><button type="button" onClick={onShop}>FIND YOUR NEXT FAVOURITE <ArrowUpRight size={18} aria-hidden="true" /></button></div>
  </section>;
}
