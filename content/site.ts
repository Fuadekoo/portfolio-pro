/**
 * Personal details used across the site.
 *
 * Everything here is meant to be edited. Values marked TODO are placeholders;
 * optional fields left as `null` or "" are hidden automatically rather than
 * shown as fake data.
 */

export type Social = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email";
};

export type Stat = {
  label: string;
  /** `null` hides the stat. */
  value: number | null;
  suffix?: string;
};

export const site = {
  // TODO: replace with your full name.
  name: "Fuad",
  initials: "F",
  role: "Full-Stack Developer",
  specialties: [
    "Next.js Developer",
    "TypeScript Engineer",
    "Software Engineer",
    "Full-Stack Developer",
  ],
  tagline: "Full-stack developer building fast, reliable web products.",
  intro:
    "I design and build web applications end to end, from database schema and APIs to polished, accessible interfaces, with Next.js, TypeScript and Node.js.",

  // TODO: set to your city / timezone, or null to hide.
  location: null as string | null,

  availability: {
    available: true,
    label: "Available for new projects",
  },

  // TODO: replace with the address you want visitors to use.
  email: "hello@example.com",

  // Leave a social `href` empty to hide it.
  socials: [
    { label: "GitHub", href: "https://github.com/Fuadekoo", icon: "github" },
    // TODO: add your LinkedIn profile URL.
    { label: "LinkedIn", href: "", icon: "linkedin" },
  ] satisfies Social[] as Social[],

  /**
   * Place your CV at `public/cv.pdf`. Until the file exists, the
   * "Download CV" button renders as unavailable instead of linking to a 404.
   */
  cvPath: "/cv.pdf",

  about: {
    // TODO: rewrite in your own words.
    paragraphs: [
      "I'm a full-stack developer who enjoys owning a product from the first schema migration to the final deploy. I care about software that is fast, readable and easy to change, and interfaces that feel calm and considered.",
      "Most of my work lives in the TypeScript ecosystem: Next.js and React on the front end, Node.js and Express behind REST APIs, and PostgreSQL, MySQL or MongoDB underneath. I also build cross-platform mobile apps with Flutter and React Native, and I'm comfortable shipping to Linux servers with Docker, Nginx and CI/CD pipelines.",
    ],
    // TODO: add real highlights, e.g. "Led the rebuild of …". Empty hides the list.
    highlights: [] as string[],
    stats: [
      // TODO: fill these in. `null` keeps a stat hidden.
      { label: "Years of experience", value: null, suffix: "+" },
      { label: "Projects delivered", value: null, suffix: "+" },
      { label: "Users served", value: null, suffix: "+" },
    ] satisfies Stat[] as Stat[],
  },
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"] | "services" | "recognition";
