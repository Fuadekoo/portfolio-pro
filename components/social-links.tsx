import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { site, type Social } from "@/content/site";
import { cn } from "@/lib/utils";

const icons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: Mail,
} satisfies Record<Social["icon"], unknown>;

/** Social profiles plus email. Entries with an empty href are skipped. */
export function getSocials(): Social[] {
  return [
    ...site.socials.filter((s) => s.href),
    ...(site.email ? [{ label: "Email", href: `mailto:${site.email}`, icon: "email" as const }] : []),
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
                "group grid place-items-center rounded-full border border-border bg-white/3 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8 hover:text-foreground",
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
