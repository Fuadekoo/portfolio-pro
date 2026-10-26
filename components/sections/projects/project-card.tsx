"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/content/projects";
import { GitHubIcon } from "@/components/icons";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { trackPointer } from "@/components/spotlight-card";
import { ProjectVisual } from "@/components/sections/projects/project-visual";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;

  return (
    <article
      onPointerMove={trackPointer}
      className={cn(
        "spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/70 transition-[transform,border-color,box-shadow] duration-500 ease-out-expo",
        "hover:-translate-y-1.5 hover:border-white/15 hover:shadow-[0_30px_80px_-30px_hsl(var(--h)_90%_60%/0.45)] focus-within:border-white/20",
      )}
      style={{ "--h": project.hue, "--spot-color": `hsl(${project.hue} 90% 65%)` } as React.CSSProperties}
    >
      <div className="relative m-2 overflow-hidden rounded-[18px] border border-white/6">
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <ProjectVisual project={project} sizes="(min-width: 768px) 50vw, 100vw" />
        </ViewTransition>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge className="border-white/10 bg-black/50 text-foreground/90 backdrop-blur-md">{project.category}</Badge>
          {project.sample && <SampleBadge className="bg-black/50 backdrop-blur-md" />}
        </div>
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid size-10 translate-y-1 place-items-center rounded-full border border-white/15 bg-black/50 text-foreground opacity-0 backdrop-blur-md transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {/* Stretched link: the whole card is clickable, secondary links sit above it. */}
            {/* Full prefetch so the page is ready in the same commit and the image can morph. */}
            <Link
              href={href}
              prefetch
              transitionTypes={["nav-forward"]}
              className="outline-none after:absolute after:inset-0 after:z-1 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {project.title}
            </Link>
          </h3>
          {project.year && <span className="shrink-0 font-mono text-xs text-subtle">{project.year}</span>}
        </div>
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge size="sm">{tech}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <p className="text-[13px] text-subtle">
            <span className="text-muted-foreground">Role</span> · {project.role}
          </p>
          <div className="relative z-2 flex items-center gap-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/6 hover:text-foreground"
              >
                <ExternalLink className="size-3.5" />
                Live demo
                <span className="sr-only">for {project.title}</span>
              </a>
            )}
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/6 hover:text-foreground"
              >
                <GitHubIcon className="size-3.5" />
                Source
                <span className="sr-only">code for {project.title}</span>
              </a>
            )}
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground/80 transition-colors group-hover:text-foreground">
              Case study
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
