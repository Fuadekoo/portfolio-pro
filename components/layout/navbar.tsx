"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { EASE_OUT_EXPO } from "@/components/motion/reveal";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";

type NavId = (typeof navItems)[number]["id"];

/** Tracks which section sits in the middle band of the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<NavId>("home");

  useEffect(() => {
    if (!enabled) return;
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {/* Mark from public/logo.svg (`npm run brand`); the dark theme swaps in a light "F". */}
      <Image src="/brand/mark-dark.png" alt="" width={54} height={28} className="h-7 w-auto light:hidden" />
      <Image src="/brand/mark.png" alt="" width={54} height={28} className="hidden h-7 w-auto light:block" />
      <span className="text-[15px] font-semibold tracking-tight">{site.name}</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const { scrollTo, lock, unlock } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingScroll = useRef<string | number | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  function hrefFor(id: NavId) {
    if (id === "home") return isHome ? "#home" : "/";
    return isHome ? `#${id}` : `/#${id}`;
  }

  function onNavClick(e: MouseEvent<HTMLAnchorElement>, id: NavId) {
    if (!isHome) return; // Let Next.js navigate to "/#id".
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(id === "home" ? 0 : `#${id}`);
    history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
  }

  function onMenuChange(open: boolean) {
    setMenuOpen(open);
    if (open) lock();
    else unlock();
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          href={hrefFor("home")}
          onClick={(e) => onNavClick(e, "home")}
          className="rounded-xl"
          aria-label={`${site.name}, back to top`}
        >
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-border bg-ink/2 p-1 backdrop-blur-md lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <Link
                  href={hrefFor(item.id)}
                  onClick={(e) => onNavClick(e, item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative z-10 block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-ink/10 bg-ink/8"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" variant="outline" className="hidden lg:inline-flex">
            <Link href={hrefFor("contact")} onClick={(e) => onNavClick(e, "contact")}>
              Let&apos;s talk
              <ArrowUpRight />
            </Link>
          </Button>

          <Dialog.Root open={menuOpen} onOpenChange={onMenuChange}>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </Dialog.Trigger>
            <AnimatePresence
              onExitComplete={() => {
                const target = pendingScroll.current;
                pendingScroll.current = null;
                if (target !== null) requestAnimationFrame(() => scrollTo(target));
              }}
            >
              {menuOpen && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild forceMount>
                    <motion.div
                      className="fixed inset-0 z-80 bg-background/80 backdrop-blur-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild forceMount>
                    <motion.div
                      data-lenis-prevent
                      className="fixed inset-x-3 top-3 z-90 overflow-hidden rounded-3xl border border-border-strong bg-card/95 p-6 shadow-2xl outline-none"
                      initial={{ opacity: 0, y: -16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                    >
                      <div className="flex items-center justify-between">
                        <Logo />
                        <Dialog.Close asChild>
                          <Button variant="ghost" size="icon" aria-label="Close menu">
                            <X className="size-5" />
                          </Button>
                        </Dialog.Close>
                      </div>
                      <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
                      <Dialog.Description className="sr-only">
                        Jump to a section of the portfolio.
                      </Dialog.Description>
                      <motion.ul
                        className="mt-8 flex flex-col"
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { delayChildren: 0.08 } } }}
                      >
                        {navItems.map((item, i) => (
                          <motion.li
                            key={item.id}
                            variants={{
                              hidden: { opacity: 0, y: 18 },
                              show: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: i * 0.05 },
                              },
                            }}
                            className="border-b border-border last:border-none"
                          >
                            <Link
                              href={hrefFor(item.id)}
                              onClick={(e) => {
                                setMenuOpen(false);
                                unlock();
                                if (!isHome) return;
                                // Scroll once the menu has fully closed and released its scroll lock.
                                e.preventDefault();
                                pendingScroll.current = item.id === "home" ? 0 : `#${item.id}`;
                                history.replaceState(null, "", item.id === "home" ? "/" : `#${item.id}`);
                              }}
                              className="flex items-baseline justify-between py-4 text-3xl font-semibold tracking-tight"
                            >
                              <span className={active === item.id ? "text-foreground" : "text-foreground/70"}>
                                {item.label}
                              </span>
                              <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                      <div className="mt-8 flex items-center justify-between">
                        <SocialLinks />
                        <span className="font-mono text-xs text-subtle">{site.email}</span>
                      </div>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
