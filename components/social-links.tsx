import { Mail, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TelegramIcon } from "@/components/icons";
import { site, type Social } from "@/content/site";
import { cn } from "@/lib/utils";

const icons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  telegram: TelegramIcon,
  email: Mail,
  phone: Phone,
} satisfies Record<Social["icon"], unknown>;

/** Social profiles plus email and phone. Entries with an empty href are skipped. */
export function getSocials(): Social[] {
  return [
    ...site.socials.filter((s) => s.href),
    ...(site.email ? [{ label: "Email", href: `mailto:${site.email}`, icon: "email" as const }] : []),
    ...(site.phone ? [{ label: "Phone", href: site.phone.href, icon: "phone" as const }] : []),
  ];
}

export function SocialLinks({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {getSocials().map((social) => {
        const Icon = icons[social.icon];
        const external = social.href.startsWith("http");
        return (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={social.label}
              title={social.label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "group grid place-items-center rounded-full border border-border bg-ink/3 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-ink/8 hover:text-foreground",
                size === "lg" ? "size-12" : "size-10",
              )}
            >
              <Icon className="size-[18px] transition-transform duration-300 group-hover:scale-110" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
