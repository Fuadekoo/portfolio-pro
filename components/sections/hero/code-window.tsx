"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Check, GitBranch } from "lucide-react";
import { TechIcon } from "@/components/tech-icon";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";

type Token = [text: string, className?: string];

const kw = "text-[#c792ea]";
const fn = "text-[#82aaff]";
const str = "text-[#c3e88d]";
const prop = "text-[#f6c177]";
const cm = "text-subtle italic";
const pl = "text-[#d6deeb]";

const code: Token[][] = [
  [["// app/projects/page.tsx", cm]],
  [["import ", kw], ["{ db } ", pl], ["from ", kw], ['"@/lib/db"', str]],
  [],
  [["export default async function ", kw], ["Projects", fn], ["() {", pl]],
  [["  const ", kw], ["projects ", pl], ["= ", kw], ["await ", kw], ["db.project.", pl], ["findMany", fn], ["({", pl]],
  [["    where", prop], [": { ", pl], ["published", prop], [": ", pl], ["true ", kw], ["},", pl]],
  [["    orderBy", prop], [": { ", pl], ["updatedAt", prop], [": ", pl], ['"desc" ', str], ["},", pl]],
  [["  });", pl]],
  [],
  [["  return ", kw], ["<", pl], ["ProjectGrid ", fn], ["items", prop], ["={projects} />", pl]],
  [["}", pl]],
];

const terminal: Token[][] = [
  [["$ ", "text-brand"], ["npm run build", pl]],
  [["✓ ", "text-success"], ["Compiled successfully", "text-muted-foreground"]],
  [["✓ ", "text-success"], ["Types checked, routes prerendered", "text-muted-foreground"]],
  [["→ ", "text-brand-2"], ["Deploying to production…", "text-muted-foreground"]],
];

const lineVariants = {
  hidden: { opacity: 0, x: -6 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.9 + i * 0.07 },
  }),
};

function Line({ tokens, i }: { tokens: Token[]; i: number }) {
  return (
    <motion.div custom={i} variants={lineVariants} className="flex min-h-[1.65em] whitespace-pre">
      <span className="mr-4 w-5 shrink-0 select-none text-right text-subtle/60">{i + 1}</span>
      <span>
        {tokens.map(([text, cls], j) => (
          <span key={j} className={cls}>
            {text}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

/** Decorative editor + terminal card that floats beside the hero copy. */
export function CodeWindow() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      aria-hidden="true"
      className="relative [perspective:1200px]"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.45 }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <div className="animate-float">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="border-gradient relative overflow-hidden rounded-2xl bg-card/80 shadow-[0_40px_120px_-30px_rgb(110_139_255/0.45)] backdrop-blur-xl"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/90" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/90" />
            <span className="size-2.5 rounded-full bg-[#28c840]/90" />
            <div className="ml-3 flex items-center gap-1.5 rounded-md bg-white/4 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              <TechIcon name="typescript" className="size-3" />
              page.tsx
            </div>
            <div className="ml-auto flex items-center gap-1 font-mono text-[11px] text-subtle">
              <GitBranch className="size-3" />
              main
            </div>
          </div>

          {/* Editor */}
          <motion.div
            className="px-4 py-4 font-mono text-[12.5px] leading-[1.65]"
            initial="hidden"
            animate="show"
          >
            {code.map((tokens, i) => (
              <Line key={i} tokens={tokens} i={i} />
            ))}
          </motion.div>

          {/* Terminal */}
          <div className="border-t border-border bg-black/30 px-4 py-3 font-mono text-[12px] leading-[1.7]">
            <div className="mb-1.5 flex gap-4 text-[10.5px] uppercase tracking-wider text-subtle">
              <span className="text-foreground/80">Terminal</span>
              <span>Output</span>
            </div>
            {terminal.map((tokens, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.9 + i * 0.35 }}
              >
                {tokens.map(([text, cls], j) => (
                  <span key={j} className={cls}>
                    {text}
                  </span>
                ))}
                {i === terminal.length - 1 && (
                  <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-brand" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating chips */}
      <motion.div
        className="glass absolute -bottom-6 -left-6 hidden items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs shadow-xl xl:flex"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 1.4 }}
      >
        <span className="grid size-6 place-items-center rounded-md bg-success/15 text-success">
          <Check className="size-3.5" />
        </span>
        <span className="font-mono text-muted-foreground">
          GET /api/projects <span className="text-success">200</span>
        </span>
      </motion.div>
      <motion.div
        className="glass absolute -bottom-6 right-6 hidden items-center gap-2.5 rounded-xl border border-border px-3 py-2 shadow-xl sm:flex"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 1.6 }}
      >
        {(["nextjs", "typescript", "postgresql", "docker"] as const).map((n) => (
          <TechIcon key={n} name={n} className="size-4" />
        ))}
      </motion.div>
    </motion.div>
  );
}
