import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getProject, projects } from "@/content/projects";
import { GitHubIcon } from "@/components/icons";
import { Badge, SampleBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";
import { ProjectVisual } from "@/components/sections/projects/project-visual";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <article className="relative pb-28 pt-28 sm:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[700px]"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 0%, hsl(${project.hue} 90% 60% / 0.14), transparent)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal y={8}>
            <Link
              href="/#projects"
              transitionTypes={["nav-back"]}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All projects
            </Link>
          </Reveal>

          <header className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <Reveal y={10} className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{project.category}</Badge>
                {project.year && <Badge>{project.year}</Badge>}
                {project.sample && <SampleBadge />}
              </Reveal>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                <MaskLine immediate delay={0.05}>
                  <span className="text-silver">{project.title}</span>
                </MaskLine>
              </h1>
            </div>
            <Reveal delay={0.15}>
              <p className="text-lg leading-relaxed text-muted-foreground">{project.summary}</p>
            </Reveal>
          </header>

          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
            <div className="overflow-hidden rounded-[18px]">
              <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                <ProjectVisual project={project} priority sizes="(min-width: 1152px) 1152px, 100vw" />
              </ViewTransition>
            </div>
          </div>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-12">
              <section aria-labelledby="overview">
                <Reveal>
                  <h2 id="overview" className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                    Overview
                  </h2>
                </Reveal>
                <div className="mt-5 space-y-5">
                  {project.description.map((p, i) => (
                    <Reveal key={i} delay={i * 0.08}>
                      <p className="text-lg leading-[1.75] text-foreground/85">{p}</p>
                    </Reveal>
                  ))}
                </div>
              </section>

              <section aria-labelledby="contributions">
                <Reveal>
                  <h2 id="contributions" className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                    Key contributions
                  </h2>
                </Reveal>
                <Stagger className="mt-5 space-y-3" interval={0.07}>
                  {project.contributions.map((c, i) => (
                    <StaggerItem
                      key={c}
                      className="flex gap-4 rounded-2xl border border-border bg-card/50 p-5 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                      {c}
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={0.1}>
                <dl className="border-gradient relative space-y-6 rounded-2xl bg-card/60 p-6">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Role</dt>
                    <dd className="mt-1.5 font-medium">{project.role}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Stack</dt>
                    <dd className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.stack.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Links</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {project.liveUrl ? (
                        <Button asChild size="sm">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink />
                            Live demo
                          </a>
                        </Button>
                      ) : null}
                      {project.sourceUrl ? (
                        <Button asChild size="sm" variant="outline">
                          <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <GitHubIcon />
                            Source code
                          </a>
                        </Button>
                      ) : null}
                      {!project.liveUrl && !project.sourceUrl && (
                        <span className="text-sm text-muted-foreground">
                          Private project. Demo available on request.
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </aside>
          </div>

          {next && next.slug !== project.slug && (
            <Reveal className="mt-24">
              <Link
                href={`/projects/${next.slug}`}
                prefetch
                transitionTypes={["nav-forward"]}
                className="group flex items-center justify-between gap-6 rounded-3xl border border-border bg-card/50 p-6 transition-colors duration-500 hover:border-white/15 sm:p-8"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Next project</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">{next.title}</p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-border-strong transition-all duration-500 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground sm:size-14">
                  <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          )}
        </div>
      </article>
    </ViewTransition>
  );
}
