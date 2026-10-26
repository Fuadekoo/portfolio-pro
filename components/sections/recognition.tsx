import { Award, Quote } from "lucide-react";
import { achievements, testimonials } from "@/content/recognition";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

/** Testimonials and achievements. Renders nothing until real entries exist. */
export function Recognition() {
  if (testimonials.length === 0 && achievements.length === 0) return null;

  return (
    <section id="recognition" className="relative scroll-mt-20 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading index="—" eyebrow="Recognition" title="Kind words & milestones." />

        {testimonials.length > 0 && (
          <Stagger className="mt-16 grid gap-4 md:grid-cols-2">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <figure className="border-gradient relative h-full rounded-2xl bg-card/60 p-7">
                  <Quote aria-hidden="true" className="size-6 text-brand" />
                  <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90">{t.quote}</blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground"> · {t.title}</span>
                    {t.href && (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline ml-2 text-subtle"
                      >
                        Source
                      </a>
                    )}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        {achievements.length > 0 && (
          <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => (
              <StaggerItem key={a.title}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-card/50 p-5">
                  <Award aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
                  <div>
                    <p className="font-medium">
                      {a.href ? (
                        <a href={a.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                          {a.title}
                        </a>
                      ) : (
                        a.title
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.issuer} · {a.date}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
