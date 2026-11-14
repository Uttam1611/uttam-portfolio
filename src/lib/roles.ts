import { certifications } from "@/content/education";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { Certification, EvidenceLevel, Experience, Project, RoleId, Skill, SkillCategory } from "@/content/types";

/**
 * Transparent, qualitative role-fit framework. No percentages and no weights.
 * Each role is rated on five dimensions with one ordinal scale. The rules are in `dimensions` below and are
 * shown on the Analytics page, so every rating can be traced to records in /src/content.
 */

export type FitLevel = 0 | 1 | 2 | 3;
export const fitLabel: Record<FitLevel, string> = { 0: "Not yet shown", 1: "Exposure", 2: "Applied", 3: "Demonstrated" };

export const roles: { id: RoleId; name: string }[] = [
  { id: "data-scientist", name: "Data Scientist" },
  { id: "ml-engineer", name: "Machine Learning Engineer" },
  { id: "ai-engineer", name: "AI Engineer" },
  { id: "data-engineer", name: "Data Engineer" },
  { id: "backend-engineer", name: "Backend Engineer" },
];

/** Skill categories counted as relevant to each role. */
export const roleSkillCategories: Record<RoleId, SkillCategory[]> = {
  "data-scientist": ["Data Science and Analytics", "Programming and Data Manipulation"],
  "ml-engineer": ["Machine Learning and Deep Learning"],
  "ai-engineer": ["AI Engineering and Generative AI", "Machine Learning and Deep Learning"],
  "data-engineer": ["Data Engineering and Backend Systems"],
  "backend-engineer": ["Data Engineering and Backend Systems", "Programming and Data Manipulation"],
};

/** Certificate skills counted as relevant to each role. */
export const roleCertSkills: Record<RoleId, string[]> = {
  "data-scientist": ["Pandas", "Python", "Machine Learning"],
  "ml-engineer": ["Machine Learning", "Deep Learning", "Transfer Learning"],
  "ai-engineer": ["Artificial Intelligence", "Deep Learning"],
  "data-engineer": [],
  "backend-engineer": ["Python"],
};

export const dimensions = [
  { id: "projects", name: "Project evidence", rule: "Case-study projects tagged for the role where Uttam's own contribution is documented. None: insufficient. One: applied. Two or more: demonstrated. Discontinued projects and projects without a documented individual contribution do not count." },
  { id: "skills", name: "Technical skills", rule: "Skills in the role's categories. Only skills linked to a project count as demonstrated. Three or more: demonstrated. One or two: applied. Only resume, coursework or learning entries: exposure." },
  { id: "work", name: "Practical experience", rule: "Internships tagged for the role. None: insufficient. One or more: applied. The internships are short (one to two months each), so this dimension stops at applied." },
  { id: "credentials", name: "Credentials", rule: "Certificates whose listed skills match the role. None: insufficient. One or two: exposure. Three or more: applied. Credentials show learning, so this dimension stops at applied." },
  { id: "breadth", name: "Domain breadth", rule: "Distinct primary domains among the role's counted projects. None: insufficient. One: exposure. Two: applied. Three or more: demonstrated." },
] as const;
export type DimensionId = (typeof dimensions)[number]["id"];

export interface DimensionResult { id: DimensionId; level: FitLevel; evidence: string[] }
export interface RoleFit { role: RoleId; name: string; dimensions: DimensionResult[] }

interface Inputs { projects: Project[]; experiences: Experience[]; skills: Skill[]; certifications: Certification[] }

const clampLevel = (n: number): FitLevel => (Math.max(0, Math.min(3, n)) as FitLevel);

export function roleFit(role: RoleId, data: Inputs = { projects, experiences, skills, certifications }): RoleFit {
  const name = roles.find((r) => r.id === role)!.name;

  const counted = data.projects.filter((p) => p.roleTags.includes(role) && p.status !== "Discontinued" && p.contributions.individual !== null);
  const pLevel = clampLevel(counted.length >= 2 ? 3 : counted.length);

  const cats = roleSkillCategories[role];
  const roleSkills = data.skills.filter((s) => cats.includes(s.category));
  const demonstrated = roleSkills.filter((s) => s.evidenceLevel === "demonstrated" && s.relatedProjects.length > 0);
  const sLevel: FitLevel = demonstrated.length >= 3 ? 3 : demonstrated.length >= 1 ? 2 : roleSkills.length > 0 ? 1 : 0;

  const exp = data.experiences.filter((e) => e.category === "Internship" && e.roleTags?.includes(role));
  const wLevel = clampLevel(Math.min(2, exp.length));

  const certs = data.certifications.filter((c) => c.skills.some((s) => roleCertSkills[role].includes(s)));
  const cLevel: FitLevel = certs.length >= 3 ? 2 : certs.length >= 1 ? 1 : 0;

  const domains = new Set(counted.map((p) => p.primaryDomain));
  const bLevel: FitLevel = domains.size >= 3 ? 3 : domains.size === 2 ? 2 : domains.size === 1 ? 1 : 0;

  const results: DimensionResult[] = [
    { id: "projects", level: pLevel, evidence: counted.map((p) => p.title) },
    { id: "skills", level: sLevel, evidence: demonstrated.map((s) => s.name) },
    { id: "work", level: wLevel, evidence: exp.map((e) => e.organisation) },
    { id: "credentials", level: cLevel, evidence: certs.map((c) => c.name) },
    { id: "breadth", level: bLevel, evidence: [...domains] },
  ];
  return { role, name, dimensions: results };
}

export const allRoleFits = (data?: Inputs) => roles.map((r) => roleFit(r.id, data));

/** The label shown on every skill. Derived from linked evidence, never typed by hand. */
export type SkillEvidenceLabel = "Used in projects" | "Applied during internship" | "Academic exposure" | "Currently learning";

export function skillEvidenceLabel(s: Pick<Skill, "relatedProjects" | "relatedExperiences" | "evidenceLevel">): SkillEvidenceLabel {
  if (s.evidenceLevel === "learning") return "Currently learning";
  if (s.relatedProjects.length > 0) return "Used in projects";
  if (s.relatedExperiences.length > 0) return "Applied during internship";
  return "Academic exposure";
}

export const skillLabelOrder: SkillEvidenceLabel[] = ["Used in projects", "Applied during internship", "Academic exposure", "Currently learning"];
export type { EvidenceLevel };
