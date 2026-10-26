"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Award, Briefcase, Flag, GraduationCap } from "lucide-react";
import { timeline, type TimelineEntry } from "@/content/experience";
import { SectionHeading } from "@/components/section-heading";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";
import { Badge, SampleBadge } from "@/components/ui/badge";

const kindMeta: Record<TimelineEntry["kind"], { icon: typeof Briefcase; label: string }> = {
  work: { icon: Briefcase, label: "Experience" },
  education: { icon: GraduationCap, label: "Education" },
  certification: { icon: Award, label: "Certification" },
  milestone: { icon: Flag, label: "Milestone" },
};

function Entry({ entry, index }: { entry: TimelineEntry; index: number }) {
  const { icon: Icon, label } = kindMeta[entry.kind];

  return (
    <motion.li
      className="relative grid gap-3 pl-14 md:grid-cols-[180px_1fr] md:gap-10 md:pl-0"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: index === 0 ? 0.1 : 0 }}
    >
      {/* Node on the line */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-border-strong bg-background text-muted-foreground md:left-[200px]"
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <span className="absolute inset-1 rounded-full bg-linear-to-br from-brand/25 to-brand-2/10" />
        <Icon className="relative size-4 text-foreground" />
      </motion.span>

      <div className="md:pt-2 md:text-right">
        <p className="font-mono text-sm text-foreground/80">{entry.period}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-subtle">{label}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6 transition-colors duration-500 hover:border-ink/15 md:ml-[60px]">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{entry.title}</h3>
            <p className="text-[15px] text-brand">{entry.organization}</p>
          </div>
          {entry.sample && <SampleBadge />}
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{entry.summary}</p>
        {entry.contributions && entry.contributions.length > 0 && (
          <ul className="mt-4 space-y-2">
            {entry.contributions.map((c) => (
              <li key={c} className="flex gap-3 text-[14.5px] leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-brand/70" />
                {c}
              </li>
            ))}
          </ul>
        )}
        {entry.stack && entry.stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {entry.stack.map((t) => (
              <li key={t}>
                <Badge size="sm">{t}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.li>
  );
}

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  if (timeline.length === 0) return null;

  return (
    <section id="experience" className="relative scroll-mt-20 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="05"
          eyebrow="Journey"
          title="Experience & education."
          description="Where I've worked, what I studied and the milestones along the way."
        />

        <div className="relative mt-16">
          {/* Track + scroll-linked progress */}
          <div aria-hidden="true" className="absolute bottom-0 left-5 top-0 w-px bg-border md:left-[220px]" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute bottom-0 left-5 top-0 w-px origin-top bg-linear-to-b from-brand-3 via-brand to-brand-2 shadow-[0_0_12px_rgb(110_139_255/0.8)] md:left-[220px]"
          />
          <ol ref={listRef} className="relative space-y-12">
            {timeline.map((entry, i) => (
              <Entry key={`${entry.title}-${entry.period}`} entry={entry} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
