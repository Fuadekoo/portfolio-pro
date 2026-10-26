/**
 * Projects shown on the home page and at /projects/[slug].
 *
 * The entries below are SAMPLES describing the kinds of systems this
 * portfolio is designed around. They are flagged `sample: true`, which shows a
 * "Sample" badge. Replace them with your real work and remove the flag.
 *
 * Screenshots: put images in `public/projects/` and set `image`. Without one,
 * a generated abstract preview is drawn instead. It is never a fake screenshot.
 */

export type ProjectCategory = "Web App" | "SaaS" | "Real-time" | "Mobile";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  category: ProjectCategory;
  stack: string[];
  role: string;
  contributions: string[];
  year?: string;
  /** e.g. "/projects/school.png" (16:10 works best). */
  image?: string;
  liveUrl?: string;
  sourceUrl?: string;
  /** Hue (0-360) for the generated preview and accents. */
  hue: number;
  /** Visual layout of the generated preview. */
  preview: "dashboard" | "lms" | "chat" | "inventory" | "analytics";
  featured?: boolean;
  sample?: boolean;
};

export const projects: Project[] = [
  {
    slug: "school-management-system",
    title: "School Management System",
    summary:
      "An administration platform for enrolment, attendance, grading and fee tracking across multiple roles.",
    description: [
      "A role-based platform for administrators, teachers, students and parents. It centralises enrolment, class scheduling, attendance and grading so staff stop juggling spreadsheets.",
      "Replace this text with the problem you solved, the constraints you worked within and the outcome.",
    ],
    category: "Web App",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    role: "Full-Stack Developer",
    contributions: [
      "Describe a key contribution, e.g. the data model or permissions system.",
      "Describe a second contribution, e.g. a reporting feature.",
      "Describe how you deployed or operated it.",
    ],
    hue: 228,
    preview: "dashboard",
    featured: true,
    sample: true,
  },
  {
    slug: "learning-management-platform",
    title: "Learning Management Platform",
    summary:
      "Course authoring, lesson progress and assessments in a focused, distraction-free learning experience.",
    description: [
      "A learning platform where instructors publish structured courses and learners track progress through lessons, quizzes and certificates.",
      "Replace this text with the real scope, your decisions and the impact.",
    ],
    category: "SaaS",
    stack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
    role: "Full-Stack Developer",
    contributions: [
      "Describe a key contribution.",
      "Describe a second contribution.",
    ],
    hue: 265,
    preview: "lms",
    featured: true,
    sample: true,
  },
  {
    slug: "real-time-collaboration",
    title: "Real-time Messaging App",
    summary:
      "Live conversations with presence, typing indicators and delivery state over WebSockets.",
    description: [
      "A real-time application with channels, direct messages and presence, built to stay responsive under many concurrent connections.",
      "Replace this text with the real scope, your decisions and the impact.",
    ],
    category: "Real-time",
    stack: ["React", "Node.js", "Express.js", "PostgreSQL", "Docker"],
    role: "Full-Stack Developer",
    contributions: [
      "Describe a key contribution.",
      "Describe a second contribution.",
    ],
    hue: 190,
    preview: "chat",
    sample: true,
  },
  {
    slug: "inventory-management",
    title: "Inventory Management System",
    summary:
      "Stock levels, purchase orders and multi-location transfers with an auditable movement history.",
    description: [
      "An inventory system that tracks products across warehouses, flags low stock and records every movement for auditing.",
      "Replace this text with the real scope, your decisions and the impact.",
    ],
    category: "Web App",
    stack: ["Next.js", "TypeScript", "MySQL", "Prisma"],
    role: "Full-Stack Developer",
    contributions: [
      "Describe a key contribution.",
      "Describe a second contribution.",
    ],
    hue: 160,
    preview: "inventory",
    sample: true,
  },
  {
    slug: "saas-analytics-dashboard",
    title: "SaaS Admin Dashboard",
    summary:
      "Subscription metrics, user management and billing controls in a fast, keyboard-friendly admin.",
    description: [
      "An admin dashboard for a subscription product, bringing together metrics, customer management and configuration in one place.",
      "Replace this text with the real scope, your decisions and the impact.",
    ],
    category: "SaaS",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "AWS"],
    role: "Full-Stack Developer",
    contributions: [
      "Describe a key contribution.",
      "Describe a second contribution.",
    ],
    hue: 300,
    preview: "analytics",
    sample: true,
  },
  {
    slug: "mobile-companion-app",
    title: "Mobile Companion App",
    summary:
      "A cross-platform companion app with offline support and push notifications.",
    description: [
      "A Flutter app that brings a web platform's core workflows to iOS and Android, with offline caching and notifications.",
      "Replace this text with the real scope, your decisions and the impact.",
    ],
    category: "Mobile",
    stack: ["Flutter", "REST APIs", "Node.js"],
    role: "Mobile & API Developer",
    contributions: [
      "Describe a key contribution.",
      "Describe a second contribution.",
    ],
    hue: 30,
    preview: "lms",
    sample: true,
  },
];

export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
