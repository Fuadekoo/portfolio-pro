"use client";

import { motion } from "motion/react";
import { Check, Database, LayoutDashboard, Layers, Rocket, Server } from "lucide-react";
import { services, type Service } from "@/content/services";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { TechIcon } from "@/components/tech-icon";
import { fadeUp, staggerContainer } from "@/components/motion/reveal";

function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  const cls = "size-5";
  switch (icon) {
    case "nextjs":
      return <TechIcon name="nextjs" colored={false} className={cls} />;
    case "layers":
      return <Layers className={cls} />;
    case "server":
      return <Server className={cls} />;
    case "database":
      return <Database className={cls} />;
    case "dashboard":
      return <LayoutDashboard className={cls} />;
    case "rocket":
      return <Rocket className={cls} />;
  }
}

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-20 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          eyebrow="Services"
          title="How I can help."
          description="From a first prototype to a production system with pipelines and monitoring, I can take on a whole product or one well-defined piece of it."
        />

        <motion.ul
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, i) => (
            <motion.li key={service.title} variants={fadeUp}>
              <SpotlightCard className="group h-full rounded-2xl border border-border bg-card/60 p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink/15">
                <div className="flex items-center justify-between">
                  <span className="relative grid size-12 place-items-center rounded-xl border border-border bg-ink/4 text-foreground transition-all duration-500 group-hover:border-brand/40 group-hover:bg-brand/10 group-hover:text-brand-soft">
                    <span className="absolute inset-0 rounded-xl bg-brand/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                    <span className="relative transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110">
                      <ServiceIcon icon={service.icon} />
                    </span>
                  </span>
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{service.description}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {service.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[13.5px] text-muted-foreground">
                      <Check className="size-3.5 text-brand" />
                      {p}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
