import { cn } from "@/lib/utils";

/**
 * Gradient orbs + grid. Pure CSS animation (transform only), so it runs on the
 * compositor and costs nothing on the main thread.
 */
export function AmbientBackground({ className, variant = "hero" }: { className?: string; variant?: "hero" | "contact" }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="bg-grid absolute inset-0 opacity-70" />
      {variant === "hero" ? (
        <>
          <div className="absolute -left-[10%] top-[-20%] size-[55vmax] animate-orb rounded-full bg-[radial-gradient(circle,rgb(110_139_255/0.22),transparent_62%)] blur-2xl" />
          <div className="absolute -right-[15%] top-[5%] size-[45vmax] animate-orb rounded-full bg-[radial-gradient(circle,rgb(167_123_255/0.18),transparent_62%)] blur-2xl [animation-delay:-7s]" />
          <div className="absolute bottom-[-30%] left-[30%] size-[40vmax] animate-orb rounded-full bg-[radial-gradient(circle,rgb(69_208_255/0.1),transparent_60%)] blur-2xl [animation-delay:-13s]" />
        </>
      ) : (
        <>
          <div className="absolute left-1/2 top-[10%] size-[50vmax] -translate-x-1/2 animate-orb rounded-full bg-[radial-gradient(circle,rgb(110_139_255/0.16),transparent_60%)] blur-2xl" />
          <div className="absolute -right-[10%] bottom-[-20%] size-[35vmax] animate-orb rounded-full bg-[radial-gradient(circle,rgb(167_123_255/0.14),transparent_60%)] blur-2xl [animation-delay:-9s]" />
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}
