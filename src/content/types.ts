/** Typed content schemas. All dashboard metrics are derived from these records. */

export type Domain =
  | "Machine Learning"
  | "Deep Learning"
  | "Computer Vision"
  | "Generative AI / LLMs"
  | "Data Science"
  | "Backend Engineering"
  | "Signal Processing"
  | "Quantum Machine Learning"
  | "Industrial AI";

export type ProjectStatus =
  | "Completed"
  | "Working Prototype"
  | "In Progress"
  | "Research / Experimental"
  | "Discontinued";

export type ProjectCluster =
  | "Signal Processing and Biomedical Computing"
  | "Quantum Machine Learning"
  | "Deep Learning and Computer Vision"
  | "Industrial AI and Digital Twins"
  | "Generative AI and LLM Applications"
  | "Backend Engineering and API Development"
  | "Machine Learning and Data Science";

/** Qualitative assessment, never a numeric score. See the framework on /projects. */
export type RankingLabel =
  | "Featured"
  | "Strong technical project"
  | "Supporting project"
  | "Research / experimental work"
  | "Learning / exploratory work";

export type Collaboration = "individual" | "collaborative";

export type RoleId = "data-scientist" | "ml-engineer" | "ai-engineer" | "data-engineer" | "backend-engineer";

/** Month precision, "YYYY-MM". `null` end date means ongoing. */
export type YearMonth = `${number}-${number}`;

/** How strongly a pipeline stage is backed up. Shown on architecture diagrams. */
export type StageEvidence = "reviewed-code" | "documented" | "to-confirm";

export interface ArchitectureStage {
  label: string;
  detail: string;
  evidence: StageEvidence;
}

export interface Attribution {
  /** Free text per category. `null` renders as "not yet documented". */
  individual: string | null;
  team: string | null;
  frameworks: string | null;
  aiAssisted: string | null;
  exploration: string | null;
}

export interface Evaluation {
  /** Measured results (accuracy, latency...). Empty means none recorded. */
  measured: { label: string; value: string; note?: string }[];
  /** Dataset or scale context. Never a claim about model performance. */
  context: { label: string; value: string; note?: string }[];
  note?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  overview: string[];
  problemStatement: string[];
  motivation: string[];
  solution: string[];
  architecture: ArchitectureStage[];
  architectureNote?: string;
  implementation: { heading: string; items: string[] }[];
  contributions: Attribution;
  technologies: string[];
  primaryDomain: Domain;
  secondaryDomains: Domain[];
  status: ProjectStatus;
  statusNote: string;
  startDate: YearMonth | null;
  endDate: YearMonth | null;
  context?: string;
  repositoryUrl: string | null;
  demoUrl: string | null;
  screenshots: { src: string; alt: string }[];
  docsUrl: string | null;
  evaluation: Evaluation;
  limitations: string[];
  futureWork: string[];
  featured: boolean;
  relatedExperienceIds: string[];
  cluster: ProjectCluster;
  ranking: RankingLabel;
  collaboration: Collaboration;
  /** Roles this project is genuine evidence for. Drives the role-fit view. */
  roleTags: RoleId[];
  /** Short, evidence-grounded notes for the case-study sections that need judgement. */
  decisions: string[];
  learned: string[];
}

/** A group of small repositories that share a theme. Not a case study. */
export interface RepoCollection {
  id: string;
  title: string;
  cluster: ProjectCluster;
  summary: string;
  ranking: RankingLabel;
  roleTags: RoleId[];
  repos: { name: string; url: string; blurb: string; period: string; note?: string }[];
}

export type ExperienceCategory = "Internship" | "Leadership" | "Hackathon";

export interface Experience {
  id: string;
  organisation: string;
  role: string;
  category: ExperienceCategory;
  employmentType: string;
  location: string | null;
  startDate: YearMonth;
  endDate: YearMonth | null;
  domain: Domain | "Leadership and community";
  description: string;
  summary: string;
  contributions: string[];
  technologies: string[];
  relatedProjects: string[];
  evidenceNote?: string;
  /** Roles this experience is genuine evidence for. */
  roleTags?: RoleId[];
}

export type EvidenceLevel = "demonstrated" | "working" | "learning" | "research";

export type SkillCategory =
  | "Programming and Data Manipulation"
  | "Data Science and Analytics"
  | "Machine Learning and Deep Learning"
  | "AI Engineering and Generative AI"
  | "Data Engineering and Backend Systems"
  | "Specialized Technical Areas";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  evidenceLevel: EvidenceLevel;
  relatedProjects: string[];
  relatedExperiences: string[];
  evidenceDescription: string;
}

export interface Education {
  id: string;
  institution: string;
  location: string | null;
  degree: string;
  specialisation: string | null;
  startDate: YearMonth | null;
  endDate: YearMonth | null;
  /** Exact reported value, e.g. "8.52" */
  score: string;
  scoreScale: string;
  scoreLabel: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganisation: string;
  issueDate: YearMonth;
  credentialId: string | null;
  credentialUrl: string;
  platform: "Coursera" | "Credly" | "GiveMyCertificate";
  skills: string[];
  skillsNote?: string;
}

export type JourneyKind = "school" | "university" | "project" | "internship" | "hackathon" | "certification" | "leadership" | "present";

export interface JourneyEvent {
  id: string;
  chapter: string;
  kind: JourneyKind;
  /** "YYYY-MM", "YYYY" or null when the date is not documented. */
  date: string | null;
  dateLabel: string;
  title: string;
  summary: string;
  detail?: string[];
  status?: "verified" | "to-confirm";
  projectSlug?: string;
  photoId?: string;
  roleSkills?: string[];
}

export interface Photo {
  id: string;
  file: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  alt: string;
  event: string;
  dateLabel: string | null;
  section: "hero" | "journey" | "slideshow";
  confirm: string[];
}

export interface Achievement {
  id: string;
  kind: "Hackathon" | "Award" | "Publication" | "Leadership";
  title: string;
  description: string;
  relatedProject?: string;
}
