"use client";

import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/providers";

export function BackToTop() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      className="group inline-flex items-center gap-1.5 rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      Back to top
      <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
