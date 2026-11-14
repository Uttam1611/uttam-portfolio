import { achievements, certifications, education } from "@/content/education";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { evidenceLevels, skillCategories, skills } from "@/content/skills";
import { site } from "@/content/site";
import type { Domain, EvidenceLevel, Experience, ExperienceCategory, Project, ProjectStatus, SkillCategory } from "@/content/types";
import { asYearMonth, monthIndex, monthsInclusive, unionMonths } from "./dates";

/**
 * Every number shown on the dashboard is computed here from the content records.
 * Functions take the records as arguments so tests can verify the rules on fixtures.
 */

export const asOf = asYearMonth(site.lastUpdated);

export const STATUS_ORDER: ProjectStatus[] = ["Completed", "Working Prototype", "In Progress", "Research / Experimental"];

export type DomainMode = "primary" | "all";

export function domainCounts(list: Project[], mode: DomainMode): { domain: Domain; count: number; slugs: string[] }[] {
  const map = new Map<Domain, string[]>();
  for (const p of list) {
    const domains: Domain[] = mode === "primary" ? [p.primaryDomain] : [p.primaryDomain, ...p.secondaryDomains];
    for (const d of new Set(domains)) map.set(d, [...(map.get(d) ?? []), p.slug]);
  }
  return [...map.entries()]
    .map(([domain, slugs]) => ({ domain, count: slugs.length, slugs }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));
}

export function statusCounts(list: Project[]): { status: ProjectStatus; count: number; slugs: string[] }[] {
  return STATUS_ORDER.map((status) => {
    const slugs = list.filter((p) => p.status === status).map((p) => p.slug);
    return { status, count: slugs.length, slugs };
  });
}

/** Counting rule: a technology counts once per project that lists it. */
export function technologyMatrix(list: Project[]): { technology: string; slugs: string[] }[] {
  const map = new Map<string, string[]>();
  for (const p of list) for (const t of new Set(p.technologies)) map.set(t, [...(map.get(t) ?? []), p.slug]);
  return [...map.entries()]
    .map(([technology, slugs]) => ({ technology, slugs }))
    .sort((a, b) => b.slugs.length - a.slugs.length || a.technology.localeCompare(b.technology));
}

export function experienceDurations(list: Experience[], asOfMonth = asOf) {
  return list.map((e) => ({ id: e.id, organisation: e.organisation, months: monthsInclusive(e.startDate, e.endDate, asOfMonth), ongoing: e.endDate === null }));
}

export function internshipCalendarMonths(list: Experience[], asOfMonth = asOf): number {
  return unionMonths(list.filter((e) => e.category === "Internship").map((e) => ({ start: e.startDate, end: e.endDate })), asOfMonth);
}

export function experienceByCategory(list: Experience[]): { category: ExperienceCategory; count: number }[] {
  const cats: ExperienceCategory[] = ["Internship", "Leadership", "Hackathon"];
  return cats.map((category) => ({ category, count: list.filter((e) => e.category === category).length }));
}

export function experienceByDomain(list: Experience[]): { domain: string; count: number }[] {
  const map = new Map<string, number>();
  for (const e of list) map.set(e.domain, (map.get(e.domain) ?? 0) + 1);
  return [...map.entries()].map(([domain, count]) => ({ domain, count }));
}

export function skillEvidenceByCategory(): { category: SkillCategory; counts: Record<EvidenceLevel, number>; total: number }[] {
  return skillCategories.map((category) => {
    const counts: Record<EvidenceLevel, number> = { demonstrated: 0, working: 0, learning: 0, research: 0 };
    for (const s of skills.filter((s) => s.category === category)) counts[s.evidenceLevel]++;
    return { category, counts, total: Object.values(counts).reduce((a, b) => a + b, 0) };
  });
}

export function skillEvidenceTotals(): Record<EvidenceLevel, number> {
  const t: Record<EvidenceLevel, number> = { demonstrated: 0, working: 0, learning: 0, research: 0 };
  for (const s of skills) t[s.evidenceLevel]++;
  return t;
}

export function degreeProgress() {
  const degree = education[0]!;
  const start = degree.startDate!;
  const end = degree.endDate!;
  const total = monthsInclusive(start, end, asOf);
  const elapsed = Math.min(total, monthIndex(asOf) - monthIndex(start) + 1);
  return { total, elapsed, start, end, degree };
}

export function kpis() {
  const domainsCovered = domainCounts(projects, "all").length;
  return {
    projects: projects.length,
    internships: experiences.filter((e) => e.category === "Internship").length,
    leadership: experiences.filter((e) => e.category === "Leadership").length,
    domains: domainsCovered,
    certifications: certifications.length,
    achievements: achievements.length,
    cgpa: education[0]!.score,
    cgpaScale: education[0]!.scoreScale,
    degree: degreeProgress(),
    internshipMonths: internshipCalendarMonths(experiences),
  };
}

export { evidenceLevels };
