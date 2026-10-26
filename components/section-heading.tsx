import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { WordReveal } from "@/components/motion/text-reveal";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/** Numbered eyebrow, word-by-word title and optional description / actions. */
export function SectionHeading({ index, eyebrow, title, description, className, children }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <Reveal y={12}>
          <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-brand">{index}</span>
            <span className="h-px w-8 bg-linear-to-r from-brand/70 to-transparent" />
            {eyebrow}
          </p>
        </Reveal>
        <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl md:text-6xl">
          <WordReveal text={title} wordClassName="text-silver" />
        </h2>
        {description ? (
          <Reveal delay={0.15} y={16}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
          </Reveal>
        ) : null}
      </div>
      {children}
    </div>
  );
}
