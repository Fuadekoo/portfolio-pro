"use client";

import { Moon, Sun } from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { THEME_COLOR, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / blocked storage: the choice just won't persist.
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", THEME_COLOR[theme]));
}

/**
 * Light/dark switch. The icon is driven purely by CSS from `data-theme`, so
 * server and client markup always match. Where supported, the new theme is
 * revealed in a circle expanding from the button.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle(e: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next: Theme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduce) {
      applyTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      className={cn(
        "group relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-ink/3 text-muted-foreground transition-colors hover:border-ink/20 hover:text-foreground",
        className,
      )}
    >
      <Sun className="absolute size-[18px] rotate-90 scale-0 opacity-0 transition-all duration-500 ease-out-expo light:rotate-0 light:scale-100 light:opacity-100" />
      <Moon className="absolute size-[18px] rotate-0 scale-100 opacity-100 transition-all duration-500 ease-out-expo light:-rotate-90 light:scale-0 light:opacity-0" />
    </button>
  );
}
