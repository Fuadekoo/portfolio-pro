"use client";

import { motion } from "motion/react";
import { CircleCheck, CreditCard, Webhook } from "lucide-react";
import { skillCategories } from "@/content/skills";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { TechIcon, techColor } from "@/components/tech-icon";
import { EASE_OUT_EXPO, fadeUp, staggerContainer } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Bento spans on a 6-column grid, matched to each category's size.
const spans: Record<string, string> = {
  frontend: "md:col-span-4",
  backend: "md:col-span-2",
  databases: "md:col-span-2",
  mobile: "md:col-span-2",
  tools: "md:col-span-2",
  payments: "md:col-span-2",
  devops: "md:col-span-4",
};

export function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-20 py-28 sm:py-36">
      <div aria-hidden="true" className="bg-dots absolute inset-0 opacity-40 mask-[radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Skills"
          title="A toolkit for the whole stack."
          description="The technologies I reach for, grouped by where they sit in a product, from the interface down to the server it runs on."
        />

        <motion.div
          className="mt-16 grid gap-4 md:grid-flow-dense md:grid-cols-6"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {skillCategories.map((cat, i) => (
            <motion.div key={cat.id} variants={fadeUp} className={cn(spans[cat.id] ?? "md:col-span-2")}>
              <SpotlightCard className="border-gradient group h-full rounded-2xl bg-card/70 p-6 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{cat.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
                  </div>
                  <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                </div>

                <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-2.5">
                  {cat.skills.map((skill) => {
                    const color = techColor(skill.icon);
                    return (
                      <li key={skill.name}>
                        <div
                          className="group/tile relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-ink/2.5 px-3 py-3 transition-[border-color,background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-ink/5"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute -left-6 top-1/2 size-16 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/tile:opacity-40"
                            style={{ background: color }}
                          />
                          <span className="relative grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-background/60 transition-transform duration-500 ease-out-expo group-hover/tile:scale-110">
                            <TechIcon name={skill.icon} className="size-[18px]" />
                          </span>
                          <span className="relative text-[13.5px] font-medium text-foreground/90">{skill.name}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {cat.id === "payments" && <PaymentFlow />}
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-8 text-center text-sm text-subtle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 }}
        >
          Always learning. Picking the right tool matters more than knowing every tool.
        </motion.p>
      </div>
    </section>
  );
}

const paymentSteps = [
  { label: "Checkout", icon: CreditCard },
  { label: "Webhook", icon: Webhook },
  { label: "Paid", icon: CircleCheck },
];

/** A small checkout → verified webhook → paid diagram for the Payments card. */
function PaymentFlow() {
  return (
    <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
      <div className="relative flex items-start justify-between">
        <div aria-hidden="true" className="absolute inset-x-[16%] top-[17px] h-px bg-ink/10">
          <motion.span
            className="absolute -top-[2px] size-[5px] rounded-full bg-success shadow-[0_0_10px_var(--color-success)]"
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
          />
        </div>
        {paymentSteps.map(({ label, icon: Icon }, i) => (
          <div key={label} className="relative flex w-1/3 flex-col items-center gap-2">
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full border bg-card",
                i === paymentSteps.length - 1 ? "border-success/40 text-success" : "border-border text-muted-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="font-mono text-[11px] text-subtle">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-border pt-3 text-xs">
        <span className="text-muted-foreground">Signed webhooks, idempotent retries</span>
        <span className="flex gap-1.5 font-mono text-[11px]">
          {["ETB", "USD"].map((c) => (
            <span key={c} className="rounded-md border border-border bg-ink/2.5 px-1.5 py-0.5 text-foreground/80">
              {c}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
