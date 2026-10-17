"use client";

// Adapted from React Bits BlurText, (c) 2026 David Haz. See ../LICENSES.md.
// https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/BlurText/BlurText.tsx
import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type BlurTextProps = {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
};

export default function BlurText({
  text,
  className,
  delay = 90,
  animateBy = "words",
  direction = "top",
}: BlurTextProps) {
  const reducedMotion = useReducedMotion();
  const pieces = animateBy === "words" ? text.split(" ") : Array.from(text);
  const y = direction === "top" ? -16 : 16;
  return (
    <motion.span
      className={cn("blur-text", className)}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reducedMotion ? 0 : delay / 1000 } },
      }}
    >
      <span className="blur-text-sr-only">{text}</span>
      {pieces.map((piece, index) => (
        <Fragment key={`${index}-${piece}`}>
          <motion.span
            aria-hidden="true"
            className="blur-text-piece"
            variants={{
              hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : y },
              visible: { opacity: 1, y: 0 },
            }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {piece === " " ? "\u00a0" : piece}
          </motion.span>
          {animateBy === "words" && index < pieces.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
