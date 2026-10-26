import Image from "next/image";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { portrait } from "@/content/media.generated";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { WordReveal } from "@/components/motion/text-reveal";
import { SocialLinks } from "@/components/social-links";
import { AmbientBackground } from "@/components/sections/hero/ambient-background";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { CopyButton } from "@/components/sections/contact/copy-email";
import { TelegramIcon } from "@/components/icons";

export function Contact() {
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden py-28 sm:py-36">
      <AmbientBackground variant="contact" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal y={12}>
              <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-brand">07</span>
                <span className="h-px w-8 bg-linear-to-r from-brand/70 to-transparent" />
                Contact
              </p>
            </Reveal>
            <h2 className="text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              <WordReveal text="Have a project" wordClassName="text-silver" />{" "}
              <WordReveal
                text="in mind?"
                delay={0.15}
                wordClassName="text-gradient font-display font-normal italic tracking-[-0.02em] pr-[0.06em]"
              />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Tell me what you&apos;re building. Whether it&apos;s a new product, a rebuild or a tricky
                backend problem, I&apos;m happy to talk it through.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-10 space-y-3">
              <div className="flex items-center gap-4 pb-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-ink/15 ring-4 ring-brand/10">
                  <Image
                    src={portrait.src}
                    alt=""
                    fill
                    sizes="56px"
                    placeholder="blur"
                    blurDataURL={portrait.blurDataURL}
                    className="object-cover object-[50%_25%]"
                  />
                </div>
                <div>
                  <p className="font-medium">{site.name}</p>
                  <p className="text-sm text-muted-foreground">You&apos;ll be talking to me directly.</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 pl-5">
                <a href={`mailto:${site.email}`} className="group flex min-w-0 items-center gap-3">
                  <Mail className="size-4 shrink-0 text-brand" />
                  <span className="truncate font-medium link-underline">{site.email}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <CopyButton value={site.email} href={`mailto:${site.email}`} label="Email address" />
              </div>
              {site.phone && (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 pl-5">
                  <a href={site.phone.href} className="group flex min-w-0 items-center gap-3">
                    <Phone className="size-4 shrink-0 text-brand" />
                    <span className="truncate font-medium link-underline">{site.phone.display}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <CopyButton value={site.phone.display.replaceAll(" ", "")} href={site.phone.href} label="Phone number" />
                </div>
              )}
              {telegram && (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 pl-5">
                  <a href={telegram.href} target="_blank" rel="noopener noreferrer" className="group flex min-w-0 items-center gap-3">
                    <TelegramIcon className="size-4 shrink-0 text-brand" />
                    <span className="truncate font-medium link-underline">@{telegram.href.split("/").pop()}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <span className="shrink-0 text-xs text-subtle">Telegram</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-[13px] text-muted-foreground">
                {site.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                    <MapPin className="size-3.5" />
                    {site.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
                  <Clock className="size-3.5" />
                  {site.availability.label}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.4} className="mt-10">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-subtle">Elsewhere</p>
              <SocialLinks size="lg" />
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="border-gradient glass relative rounded-3xl p-6 shadow-[0_40px_120px_-40px_rgb(110_139_255/0.35)] sm:p-9">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
