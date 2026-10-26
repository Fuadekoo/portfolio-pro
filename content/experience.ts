/**
 * Career timeline: work, education, certifications and milestones.
 * Taken from the CV in public/cv.pdf. An empty array hides the section.
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
    organization: "Melaverse",
    period: "2024 – Present",
    summary:
      "Onsite at a startup focused on school management systems and digital education, building interactive applications, optimising performance and improving the user experience.",
    contributions: [
      "Developed a school management system for admins, staff, students and guardians.",
      "Built an online course streaming platform with video lessons, quizzes and exams.",
      "Built a healthcare management system for private schools covering cases, appointments and progress tracking.",
    ],
  },
  {
    kind: "work",
    title: "AI Trainer",
    organization: "Post Work AI",
    period: "May – Aug 2025",
    summary:
      "Completed AI training tasks and wrote code, helping improve model performance through quality evaluation and feedback.",
    contributions: [
      "Wrote and debugged code in Node.js, Next.js and TypeScript.",
      "Reviewed model outputs and implemented technical solutions.",
    ],
    stack: ["Node.js", "Next.js", "TypeScript"],
  },
  {
    kind: "work",
    title: "Systems Developer",
    organization: "Independent projects",
    period: "2024 – 2025",
    summary: "Designed and built management systems for public institutions and city-wide rentals.",
    contributions: [
      "Kombolcha Police Station Management System for station resources and administrative operations.",
      "PC Management System for Adama Science and Technology University to monitor computer labs and maintenance.",
      "Full-stack MERN House Rent Management System, my graduation project, for managing rental properties across Addis Ababa.",
    ],
    stack: ["MongoDB", "Express.js", "React", "Node.js"],
  },
  {
    kind: "education",
    title: "BSc in Software Engineering",
    organization: "Wollo University",
    period: "2019 – 2024",
    summary: "Graduated with a GPA of 3.67 and a national exit exam score of 76.",
  },
  {
    kind: "certification",
    title: "Microsoft Azure Training",
    organization: "Wollo University AppFactory & Demera Digital",
    period: "Feb – Sep 2024",
    summary: "Microsoft Azure cloud training programme.",
  },
];
