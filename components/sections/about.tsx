"use client";

import { motion } from "motion/react";
import { Check, MapPin } from "lucide-react";
import { site, type Stat } from "@/content/site";
import { allSkills, skillCategories } from "@/content/skills";
import { SectionHeading } from "@/components/section-heading";
import { Counter } from "@/components/motion/counter";
import { EASE_OUT_EXPO, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { TechIcon, techColor } from "@/components/tech-icon";
import { cn } from "@/lib/utils";

/** Stats you provide in content/site.ts, plus ones derived from real data. */
function getStats(): Stat[] {
  const uniqueTech = new Set(allSkills.map((s) => s.name)).size;
  return [
    ...site.about.stats.filter((s) => s.value !== null),
    { label: "Technologies in my stack", value: uniqueTech },
    { label: "Disciplines, frontend to DevOps", value: skillCategories.length },
  ];
}

function StackGlance() {
  return (
    <div className="border-gradient relative rounded-2xl bg-card/60 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-medium">Stack at a glance</h3>
        <span className="font-mono text-[11px] text-subtle">tools per discipline</span>
      </div>
      <ul className="space-y-3.5">
        {skillCategories.map((cat, i) => (
          <li key={cat.id} className="grid grid-cols-[88px_1fr] items-center gap-4">
            <span className="text-[13px] text-muted-foreground">{cat.title}</span>
            <div className="flex items-center gap-1.5">
              {cat.skills.map((skill, j) => (
                <motion.span
                  key={skill.name}
                  title={skill.name}
                  className="grid size-7 place-items-center rounded-lg border border-border bg-white/3"
                  style={{ boxShadow: `inset 0 -2px 0 ${techColor(skill.icon)}55` }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.06 + j * 0.04 }}
                >
                  <TechIcon name={skill.icon} className="size-3.5" />
                  <span className="sr-only">{skill.name}</span>
                </motion.span>
              ))}
              <motion.span
                aria-hidden="true"
                className="ml-1 h-px flex-1 origin-left bg-linear-to-r from-border-strong to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 + i * 0.06 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  const stats = getStats();

  return (
    <section id="about" className="relative scroll-mt-20 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="01" eyebrow="About" title="Engineering products from database to interface." />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-6">
            {site.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-lg leading-[1.75] text-muted-foreground first:text-xl first:text-foreground/90">
                  {p}
                </p>
              </Reveal>
            ))}

            {site.about.highlights.length > 0 && (
              <Stagger className="space-y-3 pt-4" interval={0.07}>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Highlights</p>
                {site.about.highlights.map((h) => (
                  <StaggerItem key={h} className="flex gap-3 text-[15px] text-muted-foreground">
                    <Check className="mt-1 size-4 shrink-0 text-brand" />
                    {h}
                  </StaggerItem>
                ))}
              </Stagger>
            )}

            <Reveal delay={0.2} className="flex flex-wrap gap-2 pt-4">
              {site.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {site.location}
                </span>
              )}
              {["Product-minded", "Type-safe by default", "Accessibility first", "Ships to production"].map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </Reveal>
          </div>

          <div className="space-y-5">
            <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {stats.map((stat, i) => (
                <StaggerItem
                  key={stat.label}
                  className={cn(
                    "bg-background p-6",
                    stats.length % 2 === 1 && i === stats.length - 1 && "col-span-2",
                  )}
                >
                  <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    <Counter value={stat.value ?? 0} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-muted-foreground">{stat.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <StackGlance />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
