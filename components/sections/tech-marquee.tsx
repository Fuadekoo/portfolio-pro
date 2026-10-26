import { allSkills } from "@/content/skills";
import { TechIcon } from "@/components/tech-icon";

/** Infinite logo strip. CSS-only; pauses on hover and stops for reduced motion. */
export function TechMarquee() {
  const unique = allSkills.filter((s, i, arr) => arr.findIndex((o) => o.name === s.name) === i);

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12">
      {unique.map((skill) => (
        <li key={skill.name} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <TechIcon name={skill.icon} className="size-5 opacity-80" />
          {skill.name}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Technologies I work with" className="relative border-y border-border bg-ink/1 py-7">
      <div className="mask-fade-x group flex overflow-hidden">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
