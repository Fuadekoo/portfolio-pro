"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { portraitCutout } from "@/content/media.generated";
import { site } from "@/content/site";
import { TechIcon, type TechIconName } from "@/components/tech-icon";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

const ORBIT: TechIconName[] = ["nextjs", "typescript", "docker", "postgresql"];
const ORBIT_SECONDS = 48;

/** Pointer-driven offset for one depth layer (stronger = closer to the viewer). */
function useLayer(px: MotionValue<number>, py: MotionValue<number>, strength: number) {
  const spring = { stiffness: 110, damping: 20 };
  return {
    x: useSpring(useTransform(px, [-0.5, 0.5], [-strength, strength]), spring),
    y: useSpring(useTransform(py, [-0.5, 0.5], [-strength * 0.6, strength * 0.6]), spring),
  };
}

/**
 * Background-removed portrait standing in front of an arch, head breaking the
 * frame, with a slow orbit of tech badges behind and layered pointer parallax.
 */
export function HeroPortrait() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const back = useLayer(px, py, -8);
  const mid = useLayer(px, py, 5);
  const front = useLayer(px, py, 14);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div
      className="relative mx-auto aspect-[1/1.12] w-full max-w-[460px] select-none"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* Breathing glow */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-[5%] top-[18%] bottom-[10%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand)_45%,transparent),color-mix(in_oklab,var(--brand-2)_18%,transparent)_45%,transparent_70%)] blur-3xl"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: [0.75, 1, 0.75], scale: [1, 1.06, 1] }}
        transition={reduce ? { duration: 0.6 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit ring with tech badges (behind everything else) */}
      <motion.div
        aria-hidden="true"
        className="absolute left-[3%] right-[3%] top-[2%] aspect-square"
        style={back}
        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.2 }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-ink/15" />
        <div className="absolute inset-[9%] rounded-full border border-ink/6" />
        <div className="absolute inset-0" style={{ animation: `spin ${ORBIT_SECONDS}s linear infinite` }}>
          {ORBIT.map((name, i) => {
            const angle = (360 / ORBIT.length) * i + 20;
            return (
              <div key={name} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                {/* Undo the placement rotation, then counter-spin so badges stay upright. */}
                <div className="absolute left-1/2 top-0" style={{ transform: `translate(-50%, -50%) rotate(-${angle}deg)` }}>
                  <div style={{ animation: `spin ${ORBIT_SECONDS}s linear infinite reverse` }}>
                    <div className="glass grid size-11 place-items-center rounded-full border border-ink/12 shadow-lg">
                      <TechIcon name={name} className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Arch backdrop */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-[9%] right-[9%] top-[30%] origin-bottom"
        style={mid}
        initial={{ opacity: 0, scaleY: 0.55 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
      >
        <div className="border-gradient relative size-full overflow-hidden rounded-t-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand)_28%,var(--card))_0%,var(--card)_70%)]">
          <div className="bg-grid absolute inset-0 opacity-70 [--grid-size:30px]" />
          <div className="absolute -top-1/4 left-1/2 size-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--brand-3)_35%,transparent),transparent_65%)] blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent" />
        </div>
      </motion.div>

      {/* Portrait: rises out of a blur, then floats gently */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[106%] -translate-x-1/2"
        style={front}
        initial={{ opacity: 0, y: 70, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.3, ease: EASE_OUT_EXPO, delay: 0.4 }}
      >
        <div className="animate-[float_9s_ease-in-out_infinite]">
          <Image
            src={portraitCutout.src}
            alt={`${site.name}, ${site.role}`}
            width={portraitCutout.width}
            height={portraitCutout.height}
            priority
            sizes="(min-width: 1024px) 490px, 90vw"
            // No blur placeholder: Next renders it as an opaque box, which shows behind a transparent cutout.
            className="h-auto w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.35)] mask-[linear-gradient(to_bottom,#000_72%,transparent_98%)]"
          />
        </div>
      </motion.div>

      {/* Name plate */}
      <motion.div
        className="absolute bottom-[5%] left-1/2 w-[84%] -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 1.1 }}
      >
        <div className="glass flex items-center justify-between gap-3 rounded-2xl border border-ink/12 px-4 py-3 shadow-xl">
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight">{site.name}</p>
            <p className="truncate text-xs text-muted-foreground">{site.role}</p>
          </div>
          {site.availability.available && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
                <span className="relative size-1.5 rounded-full bg-success" />
              </span>
              Available
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
