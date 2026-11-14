/** Profile and site-level content. `null` means the owner has not supplied the value yet. */
export const site = {
  name: "Uttam Singh",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://uttam-singh-portfolio.vercel.app",
  location: "Gurugram, Haryana, India",
  headline: "AI/ML engineer and data science student",
  roles: ["AI/ML Engineer", "Machine Learning Engineer", "Data Scientist"],
  academicStatus: "B.Tech in Computer Science and Engineering with a Data Science specialisation at The NorthCap University. Graduating May 2027.",
  intro:
    "I'm a Computer Science and Engineering student specialising in Data Science. I enjoy exploring how intelligent systems can solve practical problems, from machine learning and computer vision to data-driven engineering applications. My work sits at the intersection of AI research, experimentation, and building useful software.",
  languages: ["English", "Hindi", "German (A1)"],
  /** Date the content was last reviewed. All "to date" calculations use this, so builds are reproducible. */
  lastUpdated: "2026-11-12",
  links: {
    github: "https://github.com/Uttam1611" as string | null,
    linkedin: "https://www.linkedin.com/in/uttamsingh-ml/" as string | null,
    email: "anshuchauhan1611@gmail.com" as string | null,
  },
} as const;
