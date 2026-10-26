import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { getProject, getProjectMedia, projects } from "@/content/projects";
import { GitHubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";
import { ProjectGallery } from "@/components/sections/projects/project-gallery";
import { ProjectVisual } from "@/components/sections/projects/project-visual";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  const { cover } = getProjectMedia(project.slug);
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }],
    },
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{children}</h2>;
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const media = getProjectMedia(project.slug);
  // Lead with the cover so the card image morphs straight into the first slide.
  const slides = media.cover.composed ? [media.cover, ...media.gallery] : media.gallery;
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
                <Badge>{project.platform}</Badge>
                {project.year && <Badge>{project.year}</Badge>}
              </Reveal>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                <MaskLine immediate delay={0.05}>
                  <span className="text-silver">{project.title}</span>
                </MaskLine>
              </h1>
              {project.client && (
                <Reveal delay={0.1} y={8}>
                  <p className="mt-4 text-muted-foreground">
                    Built for <span className="text-foreground">{project.client}</span>
                  </p>
                </Reveal>
              )}
            </div>
            <Reveal delay={0.15}>
              <p className="text-lg leading-relaxed text-muted-foreground">{project.summary}</p>
            </Reveal>
          </header>

          <Reveal delay={0.1} y={20} className="mt-12">
            <ProjectGallery slug={project.slug} images={slides} hue={project.hue} />
          </Reveal>

          <div className="mt-20 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-14">
              <section aria-labelledby="overview">
                <Reveal>
                  <div id="overview">
                    <Label>Overview</Label>
                  </div>
                </Reveal>
                <div className="mt-5 space-y-5">
                  {project.description.map((p, i) => (
                    <Reveal key={i} delay={i * 0.08}>
                      <p className="text-lg leading-[1.75] text-foreground/85">{p}</p>
                    </Reveal>
                  ))}
                </div>
              </section>

              <section aria-labelledby="features">
                <Reveal>
                  <div id="features">
                    <Label>Key features</Label>
                  </div>
                </Reveal>
                <Stagger className="mt-5 grid gap-3 sm:grid-cols-2" interval={0.05}>
                  {project.features.map((f) => (
                    <StaggerItem
                      key={f}
                      className="flex gap-3 rounded-2xl border border-border bg-card/50 p-4 text-[14.5px] leading-relaxed text-muted-foreground transition-colors hover:border-white/15"
                    >
                      <span
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                        style={{ background: `hsl(${project.hue} 80% 60% / 0.15)`, color: `hsl(${project.hue} 85% 72%)` }}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {f}
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>

              {project.contributions && project.contributions.length > 0 && (
                <section aria-labelledby="contributions">
                  <Reveal>
                    <div id="contributions">
                      <Label>My contributions</Label>
                    </div>
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
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal delay={0.1}>
                <dl className="border-gradient relative space-y-6 rounded-2xl bg-card/60 p-6">
                  {project.client && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Client</dt>
                      <dd className="mt-1.5 font-medium">{project.client}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Platform</dt>
                    <dd className="mt-1.5 font-medium">{project.platform}</dd>
                  </div>
                  {project.role && (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Role</dt>
                      <dd className="mt-1.5 font-medium">{project.role}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-subtle">
                      {project.stack.length > 0 ? "Stack" : "Highlights"}
                    </dt>
                    <dd className="mt-2.5 flex flex-wrap gap-1.5">
                      {(project.stack.length > 0 ? project.stack : project.tags).map((t) => (
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
                            Visit live site
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
                        <span className="text-sm text-muted-foreground">Demo available on request.</span>
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
                className="group grid items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card/50 p-3 transition-colors duration-500 hover:border-white/15 sm:grid-cols-[1fr_280px]"
              >
                <div className="flex items-center justify-between gap-6 p-3 sm:p-5">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Next project</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">{next.title}</p>
                    <p className="mt-2 line-clamp-2 max-w-lg text-sm text-muted-foreground">{next.summary}</p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-border-strong transition-all duration-500 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground sm:size-14">
                    <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="group relative hidden overflow-hidden rounded-2xl sm:block">
                  <ProjectVisual project={next} sizes="280px" />
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </article>
    </ViewTransition>
  );
}
