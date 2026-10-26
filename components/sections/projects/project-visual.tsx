"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, ViewTransition, type CSSProperties, type PointerEvent } from "react";
import type { MediaImage } from "@/content/media.generated";
import { getShowcase, type Project } from "@/content/projects";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// One tick every 2.4s; the laptop and phone take turns changing screen.
const TICK_MS = 2400;

function useTicker(enabled: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, [enabled]);
  return tick;
}

/** Stacked screens that cross-fade; all stay mounted so the next one is already loaded. */
function Screens<T>({
  items,
  active,
  render,
}: {
  items: T[];
  active: number;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return items.map((item, i) => (
    <motion.div
      key={i}
      aria-hidden={i !== active || undefined}
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.035 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
    >
      {render(item, i)}
    </motion.div>
  ));
}

function Laptop({
  screens,
  active,
  sizes,
  priority,
  shine,
}: {
  screens: MediaImage[];
  active: number;
  sizes: string;
  priority: boolean;
  shine: boolean;
}) {
  return (
    <div className="absolute left-[5%] top-[9%] w-[76%]">
      {/* Lid */}
      <div className="relative rounded-t-[1.6cqw] rounded-b-[0.3cqw] bg-[#0b0b10] p-[1.1cqw] pt-[1.5cqw] shadow-[0_3cqw_6cqw_-1.5cqw_rgb(0_0_0/0.85)] ring-1 ring-[#34343f]">
        <span aria-hidden="true" className="absolute left-1/2 top-[0.5cqw] size-[0.5cqw] -translate-x-1/2 rounded-full bg-[#262631]" />
        <div className="relative aspect-16/10 overflow-hidden rounded-[0.35cqw] bg-[#0e0e16]">
          <Screens
            items={screens}
            active={active}
            render={(image, i) =>
              image.composed ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={sizes}
                  priority={priority && i === 0}
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  className="object-cover"
                />
              ) : (
                <>
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-[2.4cqw] items-center gap-[0.45cqw] border-b border-white/6 bg-[#15151d] px-[1cqw]">
                    <span className="size-[0.55cqw] rounded-full bg-[#ff5f57]/80" />
                    <span className="size-[0.55cqw] rounded-full bg-[#febc2e]/80" />
                    <span className="size-[0.55cqw] rounded-full bg-[#28c840]/80" />
                    <span className="mx-auto h-[1.1cqw] w-[38%] rounded-full bg-white/6" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 top-[2.4cqw]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={sizes}
                      priority={priority && i === 0}
                      placeholder="blur"
                      blurDataURL={image.blurDataURL}
                      className="object-cover object-top-left"
                    />
                  </div>
                </>
              )
            }
          />
          {/* Glass: a fixed glare plus an occasional light sweep. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/7 via-transparent to-transparent" />
          {/* Always rendered (parked off-screen when still) so server and client markup match. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent"
            initial={{ left: "-40%" }}
            animate={shine ? { left: "140%" } : undefined}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
          />
        </div>
      </div>
      {/* Base */}
      <div className="relative -mx-[7%] h-[1.5cqw] rounded-b-[1.2cqw] rounded-t-[0.2cqw] bg-linear-to-b from-[#4a4a57] via-[#2a2a34] to-[#15151c] shadow-[0_1.5cqw_3cqw_-0.5cqw_rgb(0_0_0/0.9)]">
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-[0.45cqw] w-[15%] -translate-x-1/2 rounded-b-[0.5cqw] bg-[#1b1b23]" />
      </div>
    </div>
  );
}

function Phone({
  screens,
  active,
  sizes,
  priority,
}: {
  screens: { image: MediaImage; focus?: string }[];
  active: number;
  sizes: string;
  priority: boolean;
}) {
  // Mobile screenshots come pre-framed by the media script; desktop screens get a CSS bezel.
  const framed = screens[active]?.image.device === "mobile";
  return (
    <div
      className={cn(
        "relative aspect-[0.48] transition-[border-radius] duration-500",
        !framed && "rounded-[2.6cqw] bg-[#0b0b10] p-[0.55cqw] shadow-[0_2.5cqw_5cqw_-1cqw_rgb(0_0_0/0.9)] ring-1 ring-[#3a3a48]",
      )}
    >
      <div className={cn("relative h-full", !framed && "overflow-hidden rounded-[2.1cqw]")}>
        <Screens
          items={screens}
          active={active}
          render={({ image, focus }, i) => (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={image.device === "mobile" ? "(min-width: 768px) 20vw, 40vw" : sizes}
              priority={priority && i === 0}
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className={cn(
                image.device === "mobile" ? "object-contain drop-shadow-[0_2.5cqw_2.5cqw_rgb(0_0_0/0.7)]" : "bg-[#0e0e16] object-cover",
              )}
              style={focus ? { objectPosition: focus } : undefined}
            />
          )}
        />
        {!framed && (
          <span aria-hidden="true" className="absolute left-1/2 top-[0.9cqw] h-[1cqw] w-[32%] -translate-x-1/2 rounded-full bg-black" />
        )}
      </div>
    </div>
  );
}

/**
 * Project cover at 16:10: a laptop and a phone over a tinted backdrop.
 * `animated` (the case-study hero) cycles through screens, floats the phone
 * and tilts the scene toward the pointer; cards stay still apart from hover.
 */
export function ProjectVisual({
  project,
  className,
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
  animated = false,
  transitionName,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
  animated?: boolean;
  /** Shared view-transition name so a card can morph into the case-study hero. */
  transitionName?: string;
}) {
  const showcase = getShowcase(project);
  // Cards only need the first screens.
  const laptop = animated ? showcase.laptop : showcase.laptop.slice(0, 1);
  const phone = animated ? showcase.phone : showcase.phone.slice(0, 1);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const live = animated && !reduced;
  const tick = useTicker(live && inView);
  const laptopIndex = Math.floor((tick + 1) / 2) % laptop.length;
  const phoneIndex = Math.floor(tick / 2) % Math.max(phone.length, 1);

  // Pointer tilt: springs keep it smooth; the phone moves a little more for depth.
  const rotateX = useSpring(0, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18 });
  const phoneX = useTransform(rotateY, (v) => v * 1.4);
  const phoneY = useTransform(rotateX, (v) => v * -1.4);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!live || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rotateX.set(((e.clientY - r.top) / r.height - 0.5) * -5);
  }
  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Describe whichever device actually changes screens.
  const captionFromLaptop = laptop.length > 1 || phone.length === 0;
  const captionItems = captionFromLaptop ? laptop.map((s) => s.alt) : phone.map((s) => s.image.alt);
  const captionIndex = captionFromLaptop ? laptopIndex : phoneIndex;

  const scene = (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("theme-dark @container relative aspect-16/10 overflow-hidden bg-[#0b0b12]", className)}
      style={{ "--h": project.hue } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 25% 0%, hsl(var(--h) 85% 58% / 0.38), transparent 70%), radial-gradient(ellipse 50% 50% at 100% 100%, hsl(calc(var(--h) + 40) 85% 60% / 0.2), transparent 70%)",
        }}
      />
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50 [--grid-size:28px]" />
      {/* Soft floor glow under the devices. */}
      <div
        aria-hidden="true"
        className="absolute bottom-[2%] left-[8%] h-[14%] w-[84%] rounded-[50%] blur-2xl"
        style={{ background: "hsl(var(--h) 80% 55% / 0.22)" }}
      />

      <div className="project-visual-inner absolute inset-0 perspective-[1600px]">
        <motion.div className="absolute inset-0 transform-3d" style={{ rotateX, rotateY }}>
          <Laptop screens={laptop} active={laptopIndex} sizes={sizes} priority={priority} shine={live} />

          {phone.length > 0 && (
            <motion.div className="absolute bottom-[5%] right-[5%] w-[18%]" style={{ x: phoneX, y: phoneY }}>
              <motion.div
                className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-[1.2cqw]"
                initial={animated ? { opacity: 0, x: 40 } : false}
                animate={live ? { opacity: 1, x: 0, y: [0, -8, 0] } : { opacity: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.35, ease: EASE_OUT_EXPO },
                  x: { duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO },
                  y: { duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.2 },
                }}
              >
                <Phone screens={phone} active={phoneIndex} sizes={sizes} priority={priority} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );

  const wrapped = transitionName ? (
    <ViewTransition name={transitionName} share="morph" default="none">
      {scene}
    </ViewTransition>
  ) : (
    scene
  );

  if (!animated) return wrapped;

  return (
    <figure>
      {wrapped}
      <figcaption className="flex items-center gap-4 px-3 pb-1 pt-3.5 sm:px-4">
        {captionItems.length > 1 && (
          <span aria-hidden="true" className="flex shrink-0 gap-1.5">
            {captionItems.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-700 ease-out-expo",
                  i === captionIndex ? "w-6 bg-foreground/80" : "w-1.5 bg-foreground/20",
                )}
              />
            ))}
          </span>
        )}
        <span className="relative min-h-5 flex-1 overflow-hidden text-sm text-muted-foreground">
          {captionItems.map((text, i) => (
            <motion.span
              key={i}
              aria-hidden={i !== captionIndex || undefined}
              className="absolute inset-0 truncate"
              initial={false}
              animate={{ opacity: i === captionIndex ? 1 : 0, y: i === captionIndex ? 0 : 6 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              {text}
            </motion.span>
          ))}
        </span>
        <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle sm:block">
          {project.platform}
        </span>
      </figcaption>
    </figure>
  );
}
