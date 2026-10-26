import { projectMedia, type ProjectMedia } from "@/content/media.generated";

/**
 * Projects shown on the home page and at /projects/[slug].
 *
 * Screenshots live in data/projectsImage/ and are processed by `npm run media`
 * (see scripts/build-media.mjs). Each project's `slug` matches its media entry.
 *
 * TODO for each project:
 *  - `stack`: the technologies you used (shown as badges; feature tags are shown until then)
 *  - `role` / `contributions`: what you personally did
 *  - `liveUrl` / `sourceUrl`: once you've confirmed the links are public
 */

export type ProjectCategory = "Education" | "Healthcare" | "Real Estate" | "Mobile";

export type Project = {
  slug: keyof typeof projectMedia;
  title: string;
  client?: string;
  summary: string;
  description: string[];
  category: ProjectCategory;
  platform: "Web app" | "Mobile web" | "Mobile app";
  /** Short feature tags for cards. */
  tags: string[];
  /** Feature list for the case-study page. */
  features: string[];
  stack: string[];
  role?: string;
  contributions?: string[];
  year?: string;
  liveUrl?: string;
  sourceUrl?: string;
  /** Accent hue (0–360) used for glows on the card and case-study page. */
  hue: number;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "darulkubra-lms",
    title: "Darulkubra Learning Platform",
    client: "Darulkubra",
    summary:
      "An Islamic e-learning platform with video courses, quizzes and a final exam, plus course tools for instructors, sellers and affiliates.",
    description: [
      "Darulkubra's e-learning platform delivers structured Islamic courses such as Fiqh, Hadith and Aqidah in Amharic and English. Learners follow video lessons section by section, track their progress and work through quizzes towards a final exam.",
      "Behind the scenes, administrators manage the course catalogue, pricing in ETB and USD, and sales through seller and affiliate channels, while instructors publish courses through a guided creation flow.",
    ],
    category: "Education",
    platform: "Web app",
    tags: ["Video courses", "Quizzes & exams", "Affiliates", "Bilingual"],
    features: [
      "Video lessons organised into sections with progress tracking",
      "Quizzes and a final exam that unlocks as learners progress",
      "Per-course Q&A, announcements, feedback and materials",
      "AI assistant tab inside each course",
      "Course management with seller and affiliate sales",
      "Pricing in ETB and USD",
      "English and Amharic interface, light and dark themes",
    ],
    stack: [], // TODO
    // liveUrl: "https://e-learning.darelkubra.com", // TODO: confirm it's public
    hue: 220,
    featured: true,
  },
  {
    slug: "melaschools",
    title: "MelaSchools",
    summary:
      "A school management platform for admins, staff, students and guardians, covering analytics, finance, exams and AI-assisted insights.",
    description: [
      "MelaSchools brings a school's day-to-day operations into one system: enrolment, staff, exams, finance and communication, with dedicated access for admins, managers, staff, students and guardians.",
      "The admin dashboard summarises students, staff, attendance and revenue across branches and raises AI insights when something needs attention. The platform also generates student ID cards with QR codes.",
    ],
    category: "Education",
    platform: "Web app",
    tags: ["Multi-role", "Analytics", "AI insights", "ID cards"],
    features: [
      "Role-based access for admins, managers, staff, students and guardians",
      "Admin dashboard: students, staff, attendance and monthly revenue",
      "Multi-branch filtering",
      "Exam settings and school configuration",
      "Payments and revenue tracking",
      "AI assistant and automated alerts",
      "Student ID cards with QR codes",
    ],
    stack: [], // TODO
    hue: 35,
    featured: true,
  },
  {
    slug: "mindcare",
    title: "DarulKubra MindCare",
    client: "DarulKubra Quran Center",
    summary:
      "A student mental-wellbeing system: case management, appointments and progress tracking, with privacy built in.",
    description: [
      "Built for DarulKubra Quran Center, MindCare helps staff identify students who need support, open and follow cases, schedule sessions and measure progress over time.",
      "Each case records history, diagnosis and treatment notes. Appointments, patient types and a personal to-do list keep the team organised, and role-based access protects sensitive information.",
    ],
    category: "Healthcare",
    platform: "Web app",
    tags: ["Case management", "Scheduling", "Analytics", "Privacy"],
    features: [
      "Dashboard with case summaries and appointment status",
      "Case records with history, diagnosis and treatment notes",
      "Appointment scheduling",
      "Student tracking and progress over time",
      "Configurable patient types",
      "Personal to-do list for staff",
      "Role-based access for sensitive data",
    ],
    stack: [], // TODO
    // liveUrl: "https://mindcare.darelkubra.com", // TODO: confirm it's public
    hue: 200,
    featured: true,
  },
  {
    slug: "terbia-learning",
    title: "Terbia Learning",
    client: "Darulkubra",
    summary:
      "A mobile learning experience with a course catalogue, sectioned video lessons, progress tracking, quizzes and Q&A.",
    description: [
      "Terbia brings Darulkubra's courses to the phone. Learners browse courses by level, pick up where they left off and watch lessons organised into sections that unlock as they progress.",
      "A personal dashboard shows progress and achievements, and every course includes quizzes, Q&A and feedback.",
    ],
    category: "Mobile",
    platform: "Mobile app",
    tags: ["Mobile", "Video lessons", "Progress"],
    features: [
      "Course catalogue with levels and ratings",
      "Video lessons with a section outline",
      "Progress dashboard",
      "Quizzes, Q&A and feedback per course",
      "Amharic course content",
    ],
    stack: [], // TODO
    hue: 210,
  },
  {
    slug: "prime-card",
    title: "Prime Card",
    client: "Prime Rentals",
    summary:
      "A QR-code digital business card that links to every channel and reports how often, and from where, it's scanned.",
    description: [
      "Scanning a Prime card opens a mobile page with the company's Instagram, TikTok, YouTube, website, WhatsApp and Telegram links.",
      "With the visitor's permission, each scan's location is recorded. The admin dashboard shows total cards, scans and users, a yearly scan chart, and a guest log with distance and CSV export.",
    ],
    category: "Mobile",
    platform: "Mobile web",
    tags: ["QR codes", "Scan analytics", "Mobile-first"],
    features: [
      "QR code that opens a mobile link page",
      "Social and contact links in one place",
      "Location-aware scan logging, with permission",
      "Admin dashboard: cards, scans and users",
      "Yearly scan chart",
      "Guest tracking with CSV export",
    ],
    stack: [], // TODO
    hue: 150,
  },
  {
    slug: "prime-rentals",
    title: "Prime Rentals",
    summary:
      "A property marketplace for renting and buying homes, with search by type and location, listings, chat and notifications.",
    description: [
      "Prime Rentals helps people find a home to rent or buy. Visitors filter by rent or sale, home type and location, and browse listings with photo carousels.",
      "Signed-in users get chat, notifications and a dashboard, and administrators manage users, home types and properties.",
    ],
    category: "Real Estate",
    platform: "Web app",
    tags: ["Marketplace", "Search", "Chat"],
    features: [
      "Search by rent or sale, home type and location",
      "Listings with photo carousels",
      "In-app chat",
      "Notifications",
      "User, property and home-type management",
    ],
    stack: [], // TODO
    hue: 28,
  },
];

export const projectCategories = Array.from(new Set(projects.map((p) => p.category)));

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getProjectMedia(slug: Project["slug"]): ProjectMedia {
  return projectMedia[slug];
}

/** Badges for cards: the real stack once filled in, otherwise feature tags. */
export function projectBadges(project: Project) {
  return project.stack.length > 0 ? project.stack : project.tags;
}
