"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type ScrollApi = {
  /** Smoothly scroll to a selector (e.g. "#about") or a pixel offset. */
  scrollTo: (target: string | number) => void;
  /** Pause / resume smooth scrolling, e.g. while a modal is open. */
  lock: () => void;
  unlock: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export function useSmoothScroll() {
  const api = useContext(ScrollContext);
  if (!api) throw new Error("useSmoothScroll must be used inside <Providers>");
  return api;
}

export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Users who ask for reduced motion get native, instant scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      // Sections set `scroll-margin-top` to clear the fixed header; Lenis honours it.
      anchors: true,
      // Respect scrollable regions such as the mobile menu.
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo(target) {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target);
          return;
        }
        if (typeof target === "number") {
          window.scrollTo({ top: target });
        } else {
          document.querySelector(target)?.scrollIntoView();
        }
      },
      lock: () => lenisRef.current?.stop(),
      unlock: () => lenisRef.current?.start(),
    }),
    [],
  );

  return (
    <ScrollContext.Provider value={api}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ScrollContext.Provider>
  );
}
