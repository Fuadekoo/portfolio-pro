"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

/*
 * Note: the in-view trigger always lives on the unclipped wrapper. The moving
 * child starts outside its overflow mask, so IntersectionObserver would never
 * report it as visible.
 */

type MaskLineProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
};

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: (delay: number) => ({ y: "0%", transition: { duration: 1.05, ease: EASE_OUT_EXPO, delay } }),
};

/**
 * Slides a line of text up from behind a clipping mask.
 * Bottom padding keeps descenders from being clipped.
 */
export function MaskLine({ children, delay = 0, className, immediate = false }: MaskLineProps) {
  return (
    <motion.span
      className={cn("block overflow-hidden pb-[0.12em] mb-[-0.12em]", className)}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.6 } })}
    >
      <motion.span className="block will-change-transform" variants={lineVariants} custom={delay}>
        {children}
      </motion.span>
    </motion.span>
  );
}

const wordVariants: Variants = {
  hidden: { y: "105%", opacity: 0 },
  show: (delay: number) => ({ y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay } }),
};

/**
 * Splits a heading into words that rise from individual masks.
 * Screen readers get the plain text once from a visually hidden copy.
 */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  interval = 0.045,
}: {
  text: string;
  className?: string;
  /** Applied to each animated word, e.g. a background-clip gradient. */
  wordClassName?: string;
  delay?: number;
  interval?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] mb-[-0.12em] align-bottom"
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={wordVariants}
            custom={delay + i * interval}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
