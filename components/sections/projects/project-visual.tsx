import Image from "next/image";
import type { CSSProperties } from "react";
import { getProjectMedia, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * Project cover at 16:10. Desktop screenshots float as an app window over a
 * tinted backdrop; composed mobile covers fill the frame.
 */
export function ProjectVisual({
  project,
  className,
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const { cover } = getProjectMedia(project.slug);
  const style = { "--h": project.hue } as CSSProperties;

  return (
    <div className={cn("relative aspect-16/10 overflow-hidden bg-[#0b0b12]", className)} style={style}>
      {cover.composed ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={cover.blurDataURL}
          className="project-visual-inner object-cover"
        />
      ) : (
        <div className="project-visual-inner absolute inset-0">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 25% 0%, hsl(var(--h) 85% 58% / 0.38), transparent 70%), radial-gradient(ellipse 50% 50% at 100% 100%, hsl(calc(var(--h) + 40) 85% 60% / 0.2), transparent 70%)",
            }}
          />
          <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50 [--grid-size:28px]" />
          <div className="absolute left-[7%] top-[11%] w-[106%] overflow-hidden rounded-tl-xl border border-white/12 bg-[#0e0e16] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85)]">
            <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-white/8 bg-[#14141c] px-3 py-2">
              <span className="size-1.5 rounded-full bg-white/25" />
              <span className="size-1.5 rounded-full bg-white/25" />
              <span className="size-1.5 rounded-full bg-white/25" />
            </div>
            <Image
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              sizes={sizes}
              priority={priority}
              placeholder="blur"
              blurDataURL={cover.blurDataURL}
              className="block h-auto w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
