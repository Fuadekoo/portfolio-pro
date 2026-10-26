import type { TechIconName } from "@/components/tech-icon";

export type Skill = {
  name: string;
  icon: TechIconName;
};

export type SkillCategory = {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Interfaces that are fast, accessible and pleasant to use.",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "APIs and services with clear contracts.",
    skills: [
      { name: "Node.js", icon: "node" },
      { name: "Express.js", icon: "express" },
      { name: "REST APIs", icon: "api" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational and document data modelling.",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    description: "Cross-platform apps from a single codebase.",
    skills: [
      { name: "Flutter", icon: "flutter" },
      { name: "React Native", icon: "react" },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Checkout, webhooks and payouts, local and global.",
    skills: [
      { name: "Stripe", icon: "stripe" },
      { name: "Chapa", icon: "chapa" },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Reproducible builds and dependable deploys.",
    skills: [
      { name: "Docker", icon: "docker" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Linux", icon: "linux" },
      { name: "Nginx", icon: "nginx" },
      { name: "AWS", icon: "aws" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    description: "The everyday toolkit.",
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Prisma", icon: "prisma" },
    ],
  },
];

export const allSkills = skillCategories.flatMap((c) => c.skills);
