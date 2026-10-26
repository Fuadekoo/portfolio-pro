/**
 * Career timeline: work, education, certifications and milestones.
 *
 * These are SAMPLE entries (`sample: true` shows a badge). Replace them with
 * your real history. An empty array hides the section.
 */

export type TimelineEntry = {
  kind: "work" | "education" | "certification" | "milestone";
  title: string;
  organization: string;
  period: string;
  summary: string;
  contributions?: string[];
  stack?: string[];
  sample?: boolean;
};

export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    title: "Full-Stack Developer",
    organization: "Your current company",
    period: "20XX – Present",
    summary: "One sentence on the team, the product and what you own.",
    contributions: [
      "A concrete contribution with a measurable result.",
      "Another contribution, such as a system you designed or a process you improved.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
    sample: true,
  },
  {
    kind: "work",
    title: "Freelance Developer",
    organization: "Independent",
    period: "20XX – 20XX",
    summary: "The kinds of clients and projects you took on.",
    contributions: ["A representative project and its outcome."],
    stack: ["React", "Node.js", "MongoDB"],
    sample: true,
  },
  {
    kind: "education",
    title: "Your degree or program",
    organization: "Your institution",
    period: "20XX – 20XX",
    summary: "Focus areas, thesis or notable coursework.",
    sample: true,
  },
  {
    kind: "certification",
    title: "A certification you hold",
    organization: "Issuing organization",
    period: "20XX",
    summary: "What it covers, and why it matters for your work.",
    sample: true,
  },
];
