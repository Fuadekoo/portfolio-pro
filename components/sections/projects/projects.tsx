"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/content/projects";
import { SectionHeading } from "@/components/section-heading";
import { EASE_OUT_EXPO, Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/sections/projects/project-card";
import { cn } from "@/lib/utils";

type Filter = "All" | ProjectCategory;

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", ...projectCategories];
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative scroll-mt-20 py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(110_139_255/0.08),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Selected work"
          title="Featured projects."
          description="A selection of products I've designed, built and shipped. Open any project for the full case study."
        />

        {filters.length > 2 && (
          <Reveal delay={0.1} className="mt-12">
            <LayoutGroup id="project-filters">
              <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
                {filters.map((f) => {
                  const active = f === filter;
                  const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
                  return (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "relative rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                        active
                          ? "border-transparent text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-ink/20 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">
                        {f}
                        <span className={cn("ml-1.5 font-mono text-[11px]", active ? "opacity-60" : "text-subtle")}>
                          {count}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </Reveal>
        )}

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          {filter === "All" ? "" : ` in ${filter}`}.
        </p>

        <motion.ul layout className="mt-8 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: (i % 2) * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
