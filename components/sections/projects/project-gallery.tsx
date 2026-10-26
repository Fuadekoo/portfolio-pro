"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { useCallback, useEffect, useState, ViewTransition, type CSSProperties, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { MediaImage } from "@/content/media.generated";
import { useSmoothScroll } from "@/components/providers";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, scale: 0.98 }),
};

function Slide({ image, priority, large = false }: { image: MediaImage; priority?: boolean; large?: boolean }) {
  // Full-bleed for composed covers; everything else is shown whole, never cropped.
  if (image.composed) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(min-width: 1152px) 1152px, 100vw"
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        className="object-cover"
      />
    );
  }
  const mobile = image.device === "mobile";
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", mobile ? "p-[4%]" : large ? "p-0" : "p-[4%]")}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes="(min-width: 1152px) 1152px, 100vw"
        // Transparent phone frames skip the blur placeholder (Next renders it as an opaque box).
        {...(mobile ? {} : { placeholder: "blur" as const, blurDataURL: image.blurDataURL })}
        className={cn(
          "h-auto max-h-full w-auto max-w-full object-contain",
          !mobile && "rounded-xl border border-ink/10 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)]",
          mobile && "drop-shadow-[0_30px_40px_rgb(0_0_0/0.6)]",
        )}
      />
    </div>
  );
}

/** Screenshot gallery: animated stage, thumbnails, keyboard support and a fullscreen viewer. */
export function ProjectGallery({ slug, images, hue }: { slug: string; images: MediaImage[]; hue: number }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [open, setOpen] = useState(false);
  const { lock, unlock } = useSmoothScroll();
  const count = images.length;

  const go = useCallback(
    (delta: number) => setState(([i]) => [(i + delta + count) % count, delta]),
    [count],
  );

  useEffect(() => {
    if (!open) return;
    lock();
    return unlock;
  }, [open, lock, unlock]);

  function onKey(e: KeyboardEvent) {
    if (count < 2) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  }

  const image = images[index];
  const backdrop = {
    background: `radial-gradient(ellipse 70% 60% at 30% 0%, hsl(${hue} 85% 58% / 0.28), transparent 70%), radial-gradient(ellipse 50% 50% at 100% 100%, hsl(${hue + 40} 85% 60% / 0.16), transparent 70%), #0b0b12`,
  } satisfies CSSProperties;

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Project screenshots"
        tabIndex={0}
        onKeyDown={onKey}
        className="theme-dark overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ViewTransition name={`project-${slug}`} share="morph" default="none">
          <div className="group relative aspect-16/10 overflow-hidden rounded-[18px]" style={backdrop}>
            <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-40 [--grid-size:32px]" />
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={image.src}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                className="absolute inset-0"
              >
                <Slide image={image} priority={index === 0} />
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous screenshot"
                  className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-black/50 text-foreground backdrop-blur-md transition-all hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next screenshot"
                  className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-black/50 text-foreground backdrop-blur-md transition-all hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open screenshot fullscreen"
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-black/50 px-3 py-1.5 text-xs text-foreground backdrop-blur-md transition-colors hover:bg-black/70"
            >
              <Expand className="size-3.5" />
              Fullscreen
            </button>
            <span className="absolute bottom-3 left-3 rounded-full border border-ink/10 bg-black/50 px-3 py-1 font-mono text-[11px] text-foreground/80 backdrop-blur-md">
              {index + 1} / {count}
            </span>
          </div>
        </ViewTransition>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground" aria-live="polite">
        {image.alt}
      </p>

      {count > 1 && (
        <div className="mask-fade-x mt-5 overflow-x-auto pb-2" data-lenis-prevent>
          <ul className="mx-auto flex w-max gap-2.5 px-6">
            {images.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setState(([cur]) => [i, i > cur ? 1 : -1])}
                  aria-label={`Show screenshot ${i + 1}: ${img.alt}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative block h-16 w-24 overflow-hidden rounded-lg border transition-all duration-300 sm:h-20 sm:w-32",
                    i === index
                      ? "border-brand opacity-100 ring-2 ring-brand/30"
                      : "border-border opacity-55 hover:opacity-90",
                  )}
                  style={{ background: `hsl(${hue} 30% 10%)` }}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="128px"
                    className={img.device === "mobile" ? "object-contain p-1" : "object-cover object-top"}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="theme-dark fixed inset-0 z-90 bg-black/90 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount onKeyDown={onKey}>
                <motion.div
                  className="theme-dark fixed inset-0 z-100 flex flex-col p-4 outline-none sm:p-8"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                >
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <Dialog.Title className="truncate text-foreground/90">{image.alt}</Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Screenshot {index + 1} of {count}. Use the arrow keys to browse.
                    </Dialog.Description>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {index + 1} / {count}
                      </span>
                      <Dialog.Close
                        aria-label="Close fullscreen"
                        className="grid size-10 place-items-center rounded-full border border-ink/15 bg-ink/5 hover:bg-ink/10"
                      >
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                  </div>
                  <div className="relative mt-4 flex-1">
                    <AnimatePresence initial={false} custom={dir} mode="popLayout">
                      <motion.div
                        key={image.src}
                        custom={dir}
                        variants={slide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                        className="absolute inset-0"
                      >
                        <Slide image={{ ...image, composed: false }} large />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {count > 1 && (
                    <div className="mt-4 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Previous screenshot"
                        className="grid size-11 place-items-center rounded-full border border-ink/15 bg-ink/5 hover:bg-ink/10"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Next screenshot"
                        className="grid size-11 place-items-center rounded-full border border-ink/15 bg-ink/5 hover:bg-ink/10"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
