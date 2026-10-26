import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/*
 * Abstract, generated preview for projects without a screenshot.
 * It suggests the *shape* of the product (dashboard, chat, …) without
 * pretending to be a real capture of a live system.
 */

const accent = "hsl(var(--h) 90% 68%)";
const accentSoft = "hsl(var(--h) 90% 68% / 0.16)";
const bar = "rounded-full bg-white/8";

function Kpi({ w = "60%" }: { w?: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 rounded-lg border border-white/6 bg-white/3 p-2">
      <div className={cn(bar, "h-1 w-1/2")} />
      <div className="h-2 rounded-full" style={{ width: w, background: accent, opacity: 0.85 }} />
    </div>
  );
}

function AreaChart({ className }: { className?: string }) {
  return (
    // Colours go through `style` because var() doesn't resolve in SVG presentation attributes.
    <svg
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      className={cn("h-full w-full mask-[linear-gradient(#000_55%,transparent)]", className)}
    >
      <path
        d="M0 48 C 20 40, 30 44, 45 34 S 75 30, 90 26 S 120 34, 135 22 S 165 10, 200 8 L 200 60 L 0 60 Z"
        style={{ fill: accentSoft }}
      />
      <path
        d="M0 48 C 20 40, 30 44, 45 34 S 75 30, 90 26 S 120 34, 135 22 S 165 10, 200 8"
        fill="none"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        style={{ stroke: accent }}
      />
    </svg>
  );
}

function Rows({ n = 4, pill = false }: { n?: number; pill?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex items-center gap-2 rounded-md bg-white/2.5 px-2 py-1.5">
          <div className="size-2.5 rounded-full bg-white/12" />
          <div className={cn(bar, "h-1")} style={{ width: `${38 - i * 5}%` }} />
          <div className={cn(bar, "ml-auto h-1 w-[14%]")} />
          {pill && (
            <div
              className="h-2 w-[12%] rounded-full"
              style={{ background: i % 3 === 1 ? "rgb(255 180 80 / 0.5)" : accentSoft }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex w-[18%] shrink-0 flex-col gap-2 border-r border-white/6 p-2.5">
      <div className="mb-1 size-4 rounded-md" style={{ background: accent }} />
      {[70, 55, 80, 50, 62].map((w, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full"
          style={{ width: `${w}%`, background: i === 1 ? accent : "rgb(255 255 255 / 0.08)" }}
        />
      ))}
    </div>
  );
}

const layouts: Record<Project["preview"], () => ReactNode> = {
  dashboard: () => (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="flex gap-2">
          <Kpi w="55%" />
          <Kpi w="72%" />
          <Kpi w="40%" />
        </div>
        <div className="h-[34%] rounded-lg border border-white/6 bg-white/2 p-2">
          <AreaChart />
        </div>
        <Rows n={3} />
      </div>
    </div>
  ),
  lms: () => (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div
          className="flex h-[30%] items-end rounded-lg p-2.5"
          style={{ background: `linear-gradient(120deg, ${accentSoft}, transparent)` }}
        >
          <div className="w-1/2 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-white/50" />
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full" style={{ background: accent }} />
            </div>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-white/6 bg-white/2.5 p-2">
              <div className="grid aspect-video place-items-center rounded-md bg-white/4">
                <div
                  className="size-0 border-y-4 border-l-[7px] border-y-transparent"
                  style={{ borderLeftColor: i === 0 ? accent : "rgb(255 255 255 / 0.25)" }}
                />
              </div>
              <div className={cn(bar, "h-1 w-3/4")} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  chat: () => (
    <div className="flex h-full">
      <div className="flex w-[28%] shrink-0 flex-col gap-1.5 border-r border-white/6 p-2.5">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-md p-1"
            style={{ background: i === 1 ? accentSoft : undefined }}
          >
            <div className="relative size-4 shrink-0 rounded-full bg-white/12">
              {i < 3 && <span className="absolute -bottom-px -right-px size-1.5 rounded-full bg-emerald-400" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className={cn(bar, "h-1 w-3/4")} />
              <div className={cn(bar, "h-1 w-1/2 opacity-60")} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 p-3">
        {[
          [false, "55%"],
          [true, "45%"],
          [false, "35%"],
          [true, "60%"],
        ].map(([mine, w], i) => (
          <div
            key={i}
            className={cn("h-5 rounded-xl", mine ? "self-end rounded-br-sm" : "rounded-bl-sm bg-white/7")}
            style={{ width: w as string, background: mine ? accent : undefined, opacity: mine ? 0.8 : 1 }}
          />
        ))}
        <div className="flex items-center gap-1 pl-1">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1 rounded-full bg-white/40" />
          ))}
        </div>
        <div className="mt-1 flex h-6 items-center rounded-lg border border-white/8 bg-white/3 px-2">
          <div className={cn(bar, "h-1 w-1/3")} />
          <div className="ml-auto size-3.5 rounded-md" style={{ background: accent }} />
        </div>
      </div>
    </div>
  ),
  inventory: () => (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="flex items-end gap-1.5 rounded-lg border border-white/6 bg-white/2 p-2.5" style={{ height: "32%" }}>
          {[40, 65, 50, 85, 60, 72, 45, 90, 58, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ height: `${h}%`, background: i === 7 ? accent : "rgb(255 255 255 / 0.1)" }}
            />
          ))}
        </div>
        <Rows n={4} pill />
      </div>
    </div>
  ),
  analytics: () => (
    <div className="flex h-full">
      <Sidebar />
      <div className="grid flex-1 grid-cols-[1.6fr_1fr] grid-rows-[1fr_auto] gap-2.5 p-3">
        <div className="rounded-lg border border-white/6 bg-white/2 p-2">
          <AreaChart />
        </div>
        <div className="grid place-items-center rounded-lg border border-white/6 bg-white/2">
          <svg viewBox="0 0 36 36" className="size-[60%] -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="5" />
            <circle cx="18" cy="18" r="14" fill="none" strokeWidth="5" strokeDasharray="60 88" strokeLinecap="round" style={{ stroke: accent }} />
          </svg>
        </div>
        <div className="col-span-2 flex gap-2">
          <Kpi w="62%" />
          <Kpi w="38%" />
          <Kpi w="80%" />
          <Kpi w="50%" />
        </div>
      </div>
    </div>
  ),
};

export function ProjectVisual({
  project,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const style = { "--h": project.hue } as CSSProperties;

  return (
    <div
      className={cn("relative aspect-16/10 overflow-hidden bg-[#0b0b12]", className)}
      style={style}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes={sizes}
          priority={priority}
          className="project-visual-inner object-cover"
        />
      ) : (
        <div aria-hidden="true" className="project-visual-inner absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 30% 0%, hsl(var(--h) 90% 60% / 0.35), transparent 70%), radial-gradient(ellipse 50% 50% at 100% 100%, hsl(calc(var(--h) + 40) 90% 60% / 0.18), transparent 70%)`,
            }}
          />
          <div className="bg-grid absolute inset-0 opacity-50 [--grid-size:28px]" />
          <div className="absolute left-[8%] top-[13%] h-full w-[96%] overflow-hidden rounded-tl-xl border border-white/10 bg-[#0e0e16]/95 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]">
            <div className="flex items-center gap-1.5 border-b border-white/6 px-3 py-2">
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="ml-3 h-2.5 w-1/3 rounded-full bg-white/5" />
            </div>
            <div className="h-[calc(100%-26px)]">{layouts[project.preview]()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
