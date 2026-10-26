import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/utils";
import { Hero } from "@/components/sections/hero/hero";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Pipeline } from "@/components/sections/pipeline";
import { Projects } from "@/components/sections/projects/projects";
import { Experience } from "@/components/sections/experience";
import { Services } from "@/components/sections/services";
import { Recognition } from "@/components/sections/recognition";
import { Contact } from "@/components/sections/contact/contact";
import { getSocials } from "@/components/social-links";

export default function HomePage() {
  // Resolved at build time; the button is disabled until public/cv.pdf exists.
  const cvAvailable = existsSync(path.join(process.cwd(), "public", site.cvPath));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.intro,
    url: absoluteUrl("/"),
    email: `mailto:${site.email}`,
    ...(site.phone ? { telephone: site.phone.href.replace("tel:", "") } : {}),
    sameAs: getSocials()
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
    knowsAbout: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD must be inlined; "<" is escaped so content can't break out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero cvAvailable={cvAvailable} />
      <TechMarquee />
      <About />
      <Skills />
      <Pipeline />
      <Projects />
      <Experience />
      <Services />
      <Recognition />
      <Contact />
    </>
  );
}
