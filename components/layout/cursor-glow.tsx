"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * A soft light that trails the mouse. Desktop only, purely decorative, and
 * disabled for reduced motion. Nothing depends on pointer position.
 */
export function CursorGlow() {
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const opacity = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });
  const fade = useSpring(opacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };
    const leave = () => opacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen light:mix-blend-multiply"
      style={{
        x: springX,
        y: springY,
        opacity: fade,
        background:
          "radial-gradient(circle, rgb(110 139 255 / 0.10) 0%, rgb(167 123 255 / 0.05) 35%, transparent 70%)",
      }}
    />
  );
}
