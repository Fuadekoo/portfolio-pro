export type Service = {
  title: string;
  description: string;
  icon: "layers" | "nextjs" | "server" | "database" | "dashboard" | "rocket";
  points: string[];
};

export const services: Service[] = [
  {
    title: "Full-Stack Web Development",
    description:
      "Complete products, from data model and API to a responsive interface, built to be maintained.",
    icon: "layers",
    points: ["Product scoping", "Type-safe end to end", "Accessible UI"],
  },
  {
    title: "Next.js Applications",
    description:
      "Fast, SEO-friendly apps on the App Router with server components, caching and streaming.",
    icon: "nextjs",
    points: ["App Router", "Server Actions", "Performance budgets"],
  },
  {
    title: "REST APIs & Backends",
    description:
      "Well-documented Node.js and Express services with validation, auth and sensible error handling.",
    icon: "server",
    points: ["Auth & roles", "Validation", "API documentation"],
  },
  {
    title: "Database Design",
    description:
      "Schemas and queries that hold up as data grows, in PostgreSQL, MySQL or MongoDB.",
    icon: "database",
    points: ["Data modelling", "Migrations", "Query tuning"],
  },
  {
    title: "SaaS & Admin Dashboards",
    description:
      "Data-dense dashboards that stay clear: tables, filters, charts and role-based access.",
    icon: "dashboard",
    points: ["Multi-tenant", "Billing flows", "Reporting"],
  },
  {
    title: "Deployment & CI/CD",
    description:
      "VPS setup, Docker, Nginx and GitHub Actions pipelines that make every release predictable.",
    icon: "rocket",
    points: ["Dockerised builds", "Nginx & TLS", "Automated pipelines"],
  },
];
