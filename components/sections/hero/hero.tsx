"use client";

import { motion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskLine } from "@/components/motion/text-reveal";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/social-links";
import { AmbientBackground } from "@/components/sections/hero/ambient-background";
import { HeroPortrait } from "@/components/sections/hero/hero-portrait";
import { RotatingText } from "@/components/sections/hero/rotating-text";

function FadeIn({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Hero({ cvAvailable }: { cvAvailable: boolean }) {
  return (
    <section id="home" className="relative isolate flex min-h-svh items-center overflow-hidden pb-24 pt-32 lg:pt-28">
      <AmbientBackground />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
        <div>
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-ink/3 py-1.5 pl-2.5 pr-3.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
              <span className="relative flex size-2">
                {site.availability.available && (
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
                )}
                <span
                  className={`relative size-2 rounded-full ${site.availability.available ? "bg-success" : "bg-subtle"}`}
                />
              </span>
              {site.availability.label}
            </span>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-8">
            <p className="font-mono text-sm text-muted-foreground">
              Hi, I&apos;m <span className="text-foreground">{site.name}</span>, a
            </p>
          </FadeIn>

          <h1 className="mt-3 text-[clamp(3.25rem,10vw,7.25rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <MaskLine immediate delay={0.25}>
              <span className="text-silver">Full-Stack</span>
            </MaskLine>
            <MaskLine immediate delay={0.38}>
              <span className="text-gradient pr-[0.08em] font-display font-normal italic tracking-[-0.02em]">
                Developer
              </span>
            </MaskLine>
          </h1>

          <FadeIn delay={0.6} className="mt-7">
            <p className="flex flex-wrap items-baseline gap-x-2.5 font-mono text-[15px] text-muted-foreground sm:text-base">
              <span className="text-brand" aria-hidden="true">
                ~/
              </span>
              <span className="sr-only">Specialties:</span>
              <RotatingText words={site.specialties} />
              <span aria-hidden="true" className="inline-block h-4 w-[2px] animate-blink self-center bg-brand" />
            </p>
          </FadeIn>

          <FadeIn delay={0.7} className="mt-6 max-w-xl">
            <p className="text-lg leading-relaxed text-muted-foreground">{site.intro}</p>
          </FadeIn>

          <FadeIn delay={0.82} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button asChild size="lg" className="group">
                <a href="#projects">
                  Explore My Work
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </Magnetic>
            {cvAvailable ? (
              <Button asChild size="lg" variant="outline" className="group">
                <a href={site.cvPath} download>
                  Download CV
                  <Download className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                disabled
                title="Add public/cv.pdf to enable this download"
              >
                CV coming soon
                <Download />
              </Button>
            )}
          </FadeIn>

          <FadeIn delay={0.95} className="mt-10 flex items-center gap-4">
            <span className="h-px w-10 bg-border-strong" />
            <SocialLinks />
          </FadeIn>
        </div>

        <div className="relative px-6 sm:px-10 lg:px-4">
          <HeroPortrait />
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-subtle transition-colors hover:text-foreground md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-border-strong pt-1.5">
          <span className="size-1 animate-scroll-dot rounded-full bg-foreground" />
        </span>
        Scroll
      </motion.a>
    </section>
  );
}
