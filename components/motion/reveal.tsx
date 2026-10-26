"use client";

import { motion, stagger, type Variants } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, amount: 0.2 } as const;

export function staggerContainer(interval = 0.08, startDelay = 0): Variants {
  return {
    hidden: {},
    show: { transition: { delayChildren: stagger(interval, { startDelay }) } },
  };
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

type RevealProps = Omit<ComponentProps<typeof motion.div>, "children"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
};

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = Omit<ComponentProps<typeof motion.div>, "children"> & {
  children: ReactNode;
  interval?: number;
  delay?: number;
};

/** Container that staggers its <StaggerItem> children when it enters view. */
export function Stagger({ children, interval = 0.08, delay = 0, ...props }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer(interval, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerList({
  children,
  interval = 0.08,
  delay = 0,
  ...props
}: Omit<ComponentProps<typeof motion.ul>, "children"> & {
  children: ReactNode;
  interval?: number;
  delay?: number;
}) {
  return (
    <motion.ul
      variants={staggerContainer(interval, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}

export function StaggerLi({ children, ...props }: ComponentProps<typeof motion.li>) {
  return (
    <motion.li variants={fadeUp} {...props}>
      {children}
    </motion.li>
  );
}
