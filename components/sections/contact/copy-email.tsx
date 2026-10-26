"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies `value` to the clipboard; falls back to opening `href` if clipboard access is blocked. */
export function CopyButton({ value, href, label }: { value: string; href: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      window.location.href = href;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="relative grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-ink/20 hover:text-foreground"
      aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
