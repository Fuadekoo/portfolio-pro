"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { Check } from "lucide-react";
import { portrait } from "@/content/media.generated";
import { site } from "@/content/site";
import { TechIcon } from "@/components/tech-icon";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

function FloatingCard({
  children,
  className,
  delay,
  from,
  floatDelay = "0s",
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  from: { x?: number; y?: number };
  floatDelay?: string;
}) {
  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      initial={{ opacity: 0, ...from }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO, delay }}
    >
      <div className="animate-float" style={{ animationDelay: floatDelay }}>
        {children}
      </div>
    </motion.div>
  );
}

/** Portrait with a rotating light border, mask reveal, pointer tilt and floating detail cards. */
export function HeroPortrait() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 20 });
  // The photo drifts slightly against the tilt for depth.
  const imgX = useSpring(useTransform(px, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });
  const imgY = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[420px] perspective-[1200px]"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgb(110_139_255/0.35),rgb(167_123_255/0.12)_45%,transparent_70%)] blur-2xl"
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.3 }}
        className="relative"
      >
        {/* Rotating light border */}
        <div className="relative overflow-hidden rounded-[2rem] p-[1.5px] shadow-[0_50px_120px_-30px_rgb(110_139_255/0.55)]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_9s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,rgb(110_139_255)_60deg,rgb(167_123_255)_110deg,transparent_160deg,transparent_220deg,rgb(69_208_255)_280deg,transparent_330deg)]"
          />
          <div className="relative aspect-4/5 overflow-hidden rounded-[calc(2rem-1.5px)] bg-card">
            <motion.div
              className="absolute -inset-4"
              style={{ x: imgX, y: imgY }}
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.18 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              transition={{ duration: 1.5, ease: EASE_OUT_EXPO, delay: 0.45 }}
            >
              <Image
                src={portrait.src}
                alt={`${site.name}, ${site.role}`}
                fill
                priority
                sizes="(min-width: 1024px) 420px, 80vw"
                placeholder="blur"
                blurDataURL={portrait.blurDataURL}
                className="object-cover object-[50%_30%]"
              />
            </motion.div>
            {/* Grade the photo into the dark theme */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_6_9/0.95)_0%,rgb(6_6_9/0.35)_32%,transparent_55%),radial-gradient(ellipse_at_top,transparent_40%,rgb(6_6_9/0.35))]"
            />
            <div aria-hidden="true" className="absolute inset-0 mix-blend-overlay [background:linear-gradient(160deg,rgb(110_139_255/0.25),transparent_50%,rgb(167_123_255/0.2))]" />

            {/* Name plate */}
            <motion.div
              className="absolute inset-x-4 bottom-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 1.2 }}
            >
              <div className="glass flex items-center justify-between gap-3 rounded-2xl border border-white/12 px-4 py-3">
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
        </div>
      </motion.div>

      {/* Deploy terminal */}
      <FloatingCard className="-left-6 top-[14%] sm:-left-14" delay={1.35} from={{ x: -24 }}>
        <div aria-hidden="true" className="glass rounded-xl border border-white/12 px-3.5 py-2.5 font-mono text-[11px] leading-[1.7] shadow-2xl">
          <p>
            <span className="text-brand">$</span> git push origin main
          </p>
          <p className="flex items-center gap-1.5 text-success">
            <Check className="size-3" strokeWidth={3} />
            deployed to production
          </p>
        </div>
      </FloatingCard>

      {/* Stack */}
      <FloatingCard className="-right-4 top-[52%] sm:-right-10" delay={1.5} from={{ x: 24 }} floatDelay="-3s">
        <div aria-hidden="true" className="glass flex items-center gap-2.5 rounded-xl border border-white/12 px-3 py-2.5 shadow-2xl">
          {(["nextjs", "typescript", "node", "postgresql", "docker"] as const).map((n) => (
            <TechIcon key={n} name={n} className="size-4" />
          ))}
        </div>
      </FloatingCard>
    </div>
  );
}
