"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

/**
 * Cycles through words with a vertical mask swap. All words are stacked
 * invisibly in the same grid cell, so the width never jumps.
 */
export function RotatingText({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), reduce ? interval * 1.5 : interval);
    return () => window.clearInterval(id);
  }, [inView, reduce, interval, words.length]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span ref={ref} aria-hidden="true" className="relative inline-grid overflow-hidden align-bottom">
        {words.map((w) => (
          <span key={w} className="invisible col-start-1 row-start-1">
            {w}
          </span>
        ))}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={words[index]}
            className="col-start-1 row-start-1 text-foreground"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
