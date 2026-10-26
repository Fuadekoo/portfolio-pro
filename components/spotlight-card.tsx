"use client";

import type { ComponentProps, CSSProperties, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/** Writes the pointer position to CSS variables so `.spotlight` can follow it without re-rendering. */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

type SpotlightCardProps = ComponentProps<"div"> & {
  /** Any CSS colour for the glow. */
  spotColor?: string;
};

export function SpotlightCard({ className, spotColor, style, onPointerMove, ...props }: SpotlightCardProps) {
  return (
    <div
      className={cn("spotlight relative", className)}
      style={{ ...(spotColor ? { "--spot-color": spotColor } : {}), ...style } as CSSProperties}
      onPointerMove={(e) => {
        trackPointer(e);
        onPointerMove?.(e);
      }}
      {...props}
    />
  );
}
