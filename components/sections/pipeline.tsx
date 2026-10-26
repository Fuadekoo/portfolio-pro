"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, useState } from "react";
import {
  Box,
  Check,
  CloudUpload,
  GitCommitHorizontal,
  LoaderCircle,
  Pause,
  Play,
  Rocket,
  TriangleAlert,
} from "lucide-react";
import { failureModes, pipeline, pipelineFacts, type FailureMode, type PipelineStage } from "@/content/pipeline";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TechIcon } from "@/components/tech-icon";
import { cn } from "@/lib/utils";

type Status = "idle" | "running" | "success" | "error" | "skipped";

const STAGES = pipeline.length;
const RESTART_DELAY_MS = 4000;
/** How far through the failing stage the error happens. */
const FAIL_AT = 0.62;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
// Node centres sit in the middle of equal-width columns.
const centre = (i: number) => `${((i + 0.5) / STAGES) * 100}%`;
const WAVE = "M0 12 Q 25 2 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12";
const EASE = [0.16, 1, 0.3, 1] as const;

function StageIcon({ icon, className }: { icon: PipelineStage["icon"]; className?: string }) {
  switch (icon) {
    case "registry":
      return <CloudUpload className={className} />;
    case "deploy":
      return <Rocket className={className} />;
    default:
      return <TechIcon name={icon} colored={false} className={className} />;
  }
}

function StageNode({ stage, status, progress }: { stage: PipelineStage; status: Status; progress: MotionValue<number> }) {
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 72 72" className="absolute -inset-1 size-18 -rotate-90" aria-hidden="true">
        <circle cx="36" cy="36" r="33" fill="none" strokeWidth="2" className="stroke-ink/6" />
        {status === "running" && (
          <motion.circle
            cx="36"
            cy="36"
            r="33"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="stroke-brand"
            style={{ pathLength: progress }}
          />
        )}
        {status === "success" && <circle cx="36" cy="36" r="33" fill="none" strokeWidth="2" className="stroke-success/60" />}
        {status === "error" && <circle cx="36" cy="36" r="33" fill="none" strokeWidth="2" className="stroke-destructive/70" />}
      </svg>

      <motion.div
        className={cn(
          // Opaque base + tint layer, so the track behind never shows through the node.
          "relative grid size-16 place-items-center rounded-full border bg-card transition-colors duration-500",
          (status === "idle" || status === "skipped") &&
            "border-border-strong bg-[linear-gradient(rgb(255_255_255/0.03),rgb(255_255_255/0.03))] text-subtle",
          status === "skipped" && "opacity-50",
          status === "running" &&
            "border-brand/60 bg-[linear-gradient(rgb(110_139_255/0.16),rgb(110_139_255/0.16))] text-foreground shadow-[0_0_40px_-6px_rgb(110_139_255/0.7)]",
          status === "success" &&
            "border-success/40 bg-[linear-gradient(rgb(74_222_155/0.1),rgb(74_222_155/0.1))] text-success",
          status === "error" &&
            "border-destructive/60 bg-[linear-gradient(rgb(255_107_129/0.14),rgb(255_107_129/0.14))] text-destructive shadow-[0_0_40px_-6px_rgb(255_107_129/0.7)]",
        )}
        animate={status === "error" ? { scale: 1.06, x: [0, -5, 5, -4, 4, -2, 0] } : { scale: status === "running" ? 1.06 : 1, x: 0 }}
        transition={status === "error" ? { duration: 0.5 } : { type: "spring", stiffness: 260, damping: 18 }}
      >
        <StageIcon icon={stage.icon} className="size-6" />
      </motion.div>

      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border-2 border-card transition-colors duration-300",
          (status === "idle" || status === "skipped") && "bg-surface-2 ring-1 ring-ink/15",
          status === "running" && "bg-card text-brand",
          status === "success" && "bg-success text-background",
          status === "error" && "bg-destructive text-background",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "running" && (
            <motion.span key="run" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <LoaderCircle className="size-3.5 animate-spin" />
            </motion.span>
          )}
          {status === "success" && (
            <motion.span
              key="ok"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </motion.span>
          )}
          {status === "error" && (
            <motion.span
              key="err"
              className="text-[13px] font-bold leading-none"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              !
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}

function StatusText({ status, percent }: { status: Status; percent: MotionValue<string> }) {
  switch (status) {
    case "running":
      return <motion.span className="tabular-nums text-brand">{percent}</motion.span>;
    case "success":
      return <span className="text-success">passed</span>;
    case "error":
      return <span className="text-destructive">failed</span>;
    case "skipped":
      return <span className="text-subtle">skipped</span>;
    default:
      return <span className="text-subtle">queued</span>;
  }
}

type RunResult = { ok: boolean; label: string };

export function Pipeline() {
  // useId output may contain characters that are invalid inside url(#...).
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${Math.round(v * 100)}%`);

  // -1 = not started, STAGES = finished successfully.
  const [stage, setStage] = useState(-1);
  const [failed, setFailed] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState<FailureMode>(failureModes[0]);
  const [runs, setRuns] = useState<RunResult[]>([]);

  const failIndex = mode.stage ? pipeline.findIndex((s) => s.id === mode.stage) : -1;
  const done = stage >= STAGES;
  const finished = done || failed;
  const running = inView && !userPaused && stage >= 0;

  // Drive the active stage. Pausing or changing speed stops the tween; it resumes from the current progress.
  useEffect(() => {
    if (!running) return;
    if (finished) {
      const t = window.setTimeout(() => {
        progress.set(0);
        setLineCount(0);
        setFailed(false);
        setStage(0);
      }, RESTART_DELAY_MS);
      return () => window.clearTimeout(t);
    }
    const willFail = stage === failIndex;
    const target = willFail ? FAIL_AT : 1;
    const remaining = (pipeline[stage].duration * Math.max(0, target - progress.get())) / speed;
    const controls = animate(progress, target, {
      duration: remaining,
      ease: "linear",
      onComplete: () => {
        if (willFail) {
          setFailed(true);
          setRuns((r) => [...r, { ok: false, label: `Failed at ${pipeline[stage].label}` }]);
          return;
        }
        progress.set(0);
        setLineCount(0);
        if (stage === STAGES - 1) setRuns((r) => [...r, { ok: true, label: "Deployed" }]);
        setStage((s) => s + 1);
      },
    });
    return () => controls.stop();
  }, [running, finished, stage, failIndex, speed, progress]);

  // Stream the active stage's log lines as it progresses.
  useMotionValueEvent(progress, "change", (v) => {
    if (stage < 0 || finished) return;
    const total = pipeline[stage].logs.length;
    const next = Math.min(total, Math.floor(v * total) + 1);
    if (next !== lineCount) setLineCount(next);
  });

  function startRun() {
    progress.set(0);
    setLineCount(0);
    setFailed(false);
    setStage(0);
  }

  function onEnter() {
    setInView(true);
    if (stage === -1) {
      // Reduced motion: show the finished pipeline until the visitor starts a run.
      if (reduce) {
        setStage(STAGES);
        setUserPaused(true);
      } else {
        setStage(0);
      }
    }
  }

  function newCommit() {
    startRun();
    setUserPaused(false);
  }

  function chooseMode(next: FailureMode) {
    setMode(next);
    newCommit();
  }

  const statusOf = (i: number): Status => {
    if (failed) return i < stage ? "success" : i === stage ? "error" : "skipped";
    return i < stage ? "success" : i === stage ? "running" : "idle";
  };

  const passedStages = failed ? stage : Math.max(0, Math.min(stage, STAGES));
  const cubeIndex = Math.min(Math.max(stage, 0), STAGES - 1);
  const fill = done ? 1 : Math.max(stage, 0) / (STAGES - 1);
  const successRate = runs.length ? Math.round((runs.filter((r) => r.ok).length / runs.length) * 100) : null;
  const last = runs.at(-1);

  const logs = pipeline.flatMap((s, i) => {
    if (i < stage) return s.logs.map((text, j) => ({ key: `${i}-${j}`, text }));
    if (i !== stage) return [];
    const shown = s.logs.slice(0, failed ? Math.max(1, Math.floor(FAIL_AT * s.logs.length)) : lineCount);
    const errors = failed ? (mode.logs ?? []) : [];
    return [...shown, ...errors].map((text, j) => ({ key: `${i}-${j}-${failed ? "f" : "r"}`, text }));
  });
  const visibleLogs = logs.slice(-7);

  const statusLabel = failed
    ? `${pipeline[stage].label} failed`
    : done
      ? "Deployed to production"
      : stage >= 0
        ? pipeline[stage].label
        : "Queued";

  return (
    <section id="workflow" className="relative scroll-mt-20 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="DevOps"
          title="From commit to production."
          description="Every project ships through an automated pipeline: checked in CI, packaged as a Docker image and deployed without downtime. Push a commit, change the speed or inject a failure to see how the pipeline protects production."
        />

        <Reveal className="mt-16">
          <motion.div
            onViewportEnter={onEnter}
            onViewportLeave={() => setInView(false)}
            viewport={{ amount: 0.3 }}
            className="theme-dark border-gradient relative overflow-hidden rounded-3xl bg-card/80"
          >
            <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60 [--grid-size:40px]" />

            {/* Header */}
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-full border bg-background/60 px-3.5 py-1.5 text-[13px] backdrop-blur-md transition-colors",
                    failed ? "border-destructive/40" : "border-border",
                  )}
                >
                  <span className="relative flex size-2">
                    {!finished && stage >= 0 && running && (
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand" />
                    )}
                    <span
                      className={cn(
                        "relative size-2 rounded-full",
                        failed ? "bg-destructive" : done ? "bg-success" : stage >= 0 ? "bg-brand" : "bg-subtle",
                      )}
                    />
                  </span>
                  <span className="hidden text-muted-foreground sm:inline">Pipeline status:</span>
                  <span className={cn("font-medium", failed && "text-destructive")}>{statusLabel}</span>
                </span>
                <span className="hidden truncate font-mono text-xs text-subtle lg:inline">.github/workflows/deploy.yml</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={newCommit}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-[13px] text-muted-foreground transition-colors hover:border-ink/20 hover:text-foreground"
                >
                  <GitCommitHorizontal className="size-4" />
                  New commit
                </button>
                <button
                  type="button"
                  onClick={() => (finished || stage < 0 ? newCommit() : setUserPaused((p) => !p))}
                  aria-label={running && !finished ? "Pause pipeline" : "Run pipeline"}
                  className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  {running && !finished ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
                </button>
              </div>
            </div>

            {/* Stages */}
            <div className="relative px-5 pb-8 pt-10 sm:px-7 md:pt-20">
              {/* Desktop: wavy track, fill and the travelling container */}
              <div aria-hidden="true" className="absolute inset-x-5 top-20 hidden h-16 sm:inset-x-7 md:block">
                <div className="absolute top-1/2 h-6 -translate-y-1/2" style={{ left: centre(0), right: centre(0) }}>
                  <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute inset-0 size-full">
                    <path
                      d={WAVE}
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      vectorEffect="non-scaling-stroke"
                      className="animate-dash-flow stroke-ink/15"
                    />
                  </svg>
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute inset-0 size-full">
                      <defs>
                        <linearGradient id={`ok-${uid}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#4ade9b" />
                          <stop offset="100%" stopColor="#6e8bff" />
                        </linearGradient>
                        <linearGradient id={`err-${uid}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#4ade9b" />
                          <stop offset={`${Math.max(0, fill - 0.15) * 100}%`} stopColor="#4ade9b" />
                          <stop offset={`${fill * 100}%`} stopColor="#ff6b81" />
                        </linearGradient>
                      </defs>
                      <path
                        d={WAVE}
                        fill="none"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                        vectorEffect="non-scaling-stroke"
                        stroke={`url(#${failed ? "err" : "ok"}-${uid})`}
                        className="animate-dash-flow"
                      />
                    </svg>
                  </motion.div>
                </div>

                <motion.div
                  className="absolute -top-14 -translate-x-1/2"
                  initial={false}
                  animate={{ left: centre(cubeIndex) }}
                  transition={{ type: "spring", stiffness: 70 * speed, damping: 16 }}
                >
                  <div className="animate-float">
                    <motion.div
                      animate={failed ? { x: [0, -6, 6, -4, 4, 0], rotate: [0, -6, 6, -3, 0] } : { x: 0, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "grid size-10 place-items-center rounded-xl border backdrop-blur-md transition-colors duration-500",
                        failed
                          ? "border-destructive/60 bg-destructive/15 text-destructive shadow-[0_0_30px_-4px_rgb(255_107_129/0.7)]"
                          : done
                            ? "border-success/50 bg-success/15 text-success shadow-[0_0_30px_-4px_rgb(74_222_155/0.6)]"
                            : "border-[#2496ED]/50 bg-[#2496ED]/15 text-[#5cb6ff] shadow-[0_0_30px_-4px_rgb(36_150_237/0.7)]",
                      )}
                    >
                      {failed ? <TriangleAlert className="size-5" /> : <Box className="size-5" />}
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <div className="relative">
              {/* Mobile: vertical track between the first and last node centres */}
              <div aria-hidden="true" className="absolute bottom-8 left-8 top-8 w-px bg-ink/10 md:hidden">
                <motion.div
                  className={cn(
                    "absolute inset-x-0 top-0 origin-top bg-linear-to-b",
                    failed ? "from-success to-destructive" : "from-success to-brand",
                  )}
                  initial={false}
                  animate={{ height: `${fill * 100}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>

              <ol className="relative grid gap-7 md:grid-cols-5 md:gap-2">
                {pipeline.map((s, i) => {
                  const status = statusOf(i);
                  return (
                    <li key={s.id} className="flex items-center gap-5 md:flex-col md:gap-0 md:text-center">
                      <StageNode stage={s} status={status} progress={progress} />
                      <div className="md:mt-5">
                        <p
                          className={cn(
                            "text-[15px] font-semibold tracking-tight transition-colors",
                            (status === "idle" || status === "skipped") && "text-foreground/60",
                            status === "error" && "text-destructive",
                          )}
                        >
                          {s.label}
                        </p>
                        <p className="mt-0.5 font-mono text-xs">
                          <StatusText status={status} percent={percent} />
                        </p>
                        <p className="mt-1.5 text-xs text-subtle">{s.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              </div>

              <ul className="relative mt-10 flex flex-wrap justify-center gap-2" aria-label="How this pipeline runs">
                {pipelineFacts.map((f) => (
                  <li
                    key={f.label}
                    className="rounded-full border border-border bg-background/50 px-3 py-1 text-[12px] text-muted-foreground backdrop-blur-sm"
                  >
                    <span className="text-subtle">{f.label}:</span> {f.value}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <dl className="relative grid grid-cols-3 border-t border-border bg-ink/2 text-center">
              <div className="px-3 py-4">
                <dt className="text-xs text-subtle">Runs this session</dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums">{runs.length}</dd>
              </div>
              <div className="border-x border-border px-3 py-4">
                <dt className="text-xs text-subtle">Success rate</dt>
                <dd
                  className={cn(
                    "mt-1 text-lg font-semibold tabular-nums",
                    successRate === null ? "text-foreground" : successRate >= 50 ? "text-success" : "text-destructive",
                  )}
                >
                  {successRate === null ? "—" : `${successRate}%`}
                </dd>
              </div>
              <div className="px-3 py-4">
                <dt className="text-xs text-subtle">Last run</dt>
                <dd className={cn("mt-1 truncate text-sm font-medium sm:text-base", last && !last.ok && "text-destructive")}>
                  {last ? last.label : "—"}
                </dd>
              </div>
            </dl>

            {/* Log + controls */}
            <div className="relative grid border-t border-border lg:grid-cols-[1.35fr_1fr]">
              <div className="border-b border-border bg-black/30 px-5 py-4 font-mono text-[12px] leading-[1.8] sm:px-7 lg:border-b-0 lg:border-r">
                <div className="mb-2 flex items-center gap-4 text-[10.5px] uppercase tracking-wider text-subtle">
                  <span className="text-foreground/80">Run log</span>
                  <span>
                    {passedStages}/{STAGES} stages passed
                  </span>
                </div>
                <div className="h-38 overflow-hidden" aria-hidden="true">
                  <AnimatePresence initial={false}>
                    {visibleLogs.map((line) => (
                      <motion.div
                        key={line.key}
                        layout="position"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "truncate",
                          line.text.startsWith("✓") && "text-success",
                          line.text.startsWith("✗") && "text-destructive",
                          line.text.startsWith("$") && "text-foreground/90",
                          !/^[✓✗$]/.test(line.text) && "text-muted-foreground",
                        )}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {!finished && stage >= 0 && <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-brand" />}
                  {stage < 0 && <span className="text-subtle">Waiting for a push to main…</span>}
                </div>
              </div>

              <div className="space-y-6 px-5 py-5 sm:px-7">
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`speed-${uid}`} className="text-[13px] font-medium text-muted-foreground">
                      Pipeline speed
                    </label>
                    <span className="font-mono text-sm tabular-nums">{speed}×</span>
                  </div>
                  <input
                    id={`speed-${uid}`}
                    type="range"
                    min={0}
                    max={SPEEDS.length - 1}
                    step={1}
                    value={SPEEDS.indexOf(speed)}
                    onChange={(e) => setSpeed(SPEEDS[Number(e.target.value)])}
                    aria-valuetext={`${speed} times`}
                    className="mt-3 h-1.5 w-full cursor-pointer accent-brand"
                  />
                </div>

                <fieldset>
                  <legend className="text-[13px] font-medium text-muted-foreground">Simulation mode</legend>
                  <div className="mt-3 grid grid-cols-3 gap-1 rounded-full border border-border bg-background/60 p-1">
                    {failureModes.map((m) => {
                      const active = m.id === mode.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => chooseMode(m)}
                          className={cn(
                            "relative rounded-full px-2 py-1.5 text-[12.5px] font-medium transition-colors",
                            active ? (m.stage ? "text-white" : "text-primary-foreground") : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {active && (
                            <motion.span
                              layoutId={`mode-${uid}`}
                              className={cn("absolute inset-0 rounded-full", m.stage ? "bg-destructive" : "bg-primary")}
                              transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            />
                          )}
                          <span className="relative">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <p className="mt-5 text-center text-xs text-subtle">
          An interactive illustration of my deployment workflow. Timings are compressed and failures are simulated.
        </p>
      </div>
    </section>
  );
}
