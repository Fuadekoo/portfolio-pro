import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, site } from "@/content/site";
import { SocialLinks } from "@/components/social-links";
import { BackToTop } from "@/components/layout/back-to-top";
import { Logo } from "@/components/layout/navbar";

// Cache Components requires current-time reads to be cached or deferred.
async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getYear();

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">{site.tagline}</p>
            <SocialLinks />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.id === "home" ? "/" : `/#${item.id}`}
                className="link-underline w-fit text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 text-xs text-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p>Built with Next.js, Tailwind CSS &amp; Motion.</p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
