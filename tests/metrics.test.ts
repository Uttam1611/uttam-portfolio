import { describe, expect, it } from "vitest";
import { domainCounts, experienceDurations, internshipCalendarMonths, kpis, statusCounts, technologyMatrix } from "@/lib/metrics";
import { formatDuration, monthsInclusive, unionMonths } from "@/lib/dates";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { Project } from "@/content/types";

const fixture = (over: Partial<Project>): Project => ({ ...projects[0]!, ...over });

describe("date maths", () => {
  it("counts months inclusively", () => {
    expect(monthsInclusive("2025-06", "2025-07", "2026-11")).toBe(2);
    expect(monthsInclusive("2024-08", null, "2026-11")).toBe(28);
  });
  it("counts overlapping ranges once", () => {
    expect(unionMonths([{ start: "2025-06", end: "2025-07" }, { start: "2025-06", end: "2025-07" }], "2026-11")).toBe(2);
  });
  it("formats durations", () => {
    expect(formatDuration(1)).toBe("1 month");
    expect(formatDuration(28)).toBe("2 years 4 months");
  });
});

describe("project metrics", () => {
  const list = [
    fixture({ slug: "a", primaryDomain: "Computer Vision", secondaryDomains: ["Machine Learning"], technologies: ["Python", "Python", "OpenCV"] }),
    fixture({ slug: "b", primaryDomain: "Computer Vision", secondaryDomains: [], technologies: ["Python"], status: "Completed" }),
  ];
  it("primary mode counts one domain per project", () => {
    expect(domainCounts(list, "primary")).toEqual([{ domain: "Computer Vision", count: 2, slugs: ["a", "b"] }]);
  });
  it("all mode counts secondary domains too", () => {
    const all = domainCounts(list, "all");
    expect(all.find((d) => d.domain === "Machine Learning")?.count).toBe(1);
  });
  it("counts each technology once per project", () => {
    expect(technologyMatrix(list).find((t) => t.technology === "Python")?.slugs).toEqual(["a", "b"]);
  });
  it("keeps statuses with zero projects", () => {
    const s = statusCounts(list);
    expect(s).toHaveLength(4);
    expect(s.find((x) => x.status === "In Progress")?.count).toBe(0);
  });
});

describe("real content", () => {
  it("has unique slugs and ids", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(skills.map((s) => s.id)).size).toBe(skills.length);
  });
  it("derives KPIs from the records", () => {
    const k = kpis();
    expect(k.projects).toBe(projects.length);
    expect(k.internships).toBe(3);
    expect(k.leadership).toBe(1);
    expect(k.certifications).toBe(7);
  });
  it("counts overlapping 2025 internships once", () => {
    expect(internshipCalendarMonths(experiences)).toBe(4);
    expect(experienceDurations(experiences).reduce((a, b) => a + b.months, 0)).toBeGreaterThan(4);
  });
  it("has no percentages or invented scores in skills", () => {
    for (const s of skills) expect(s.evidenceDescription).not.toMatch(/\d+\s?%/);
  });
  it("only links skills to projects and experiences that exist", () => {
    const pIds = new Set(projects.map((p) => p.slug));
    const eIds = new Set(experiences.map((e) => e.id));
    for (const s of skills) {
      s.relatedProjects.forEach((p) => expect(pIds.has(p)).toBe(true));
      s.relatedExperiences.forEach((e) => expect(eIds.has(e)).toBe(true));
    }
  });
});

import { allRoleFits, roleFit, skillEvidenceLabel } from "@/lib/roles";
import { degreeProgressAt } from "@/lib/degree";
import { certifications } from "@/content/education";
import { photos } from "@/content/photos";
import { journey } from "@/content/journey";

describe("degree progress", () => {
  it("clamps before, during and after the programme", () => {
    expect(degreeProgressAt(Date.UTC(2020, 0, 1)).percent).toBe(0);
    expect(degreeProgressAt(Date.UTC(2030, 0, 1)).percent).toBe(100);
    const mid = degreeProgressAt(Date.UTC(2025, 5, 15));
    expect(mid.percent).toBeGreaterThan(30);
    expect(mid.percent).toBeLessThan(70);
    expect(mid.status).toBe("in-progress");
  });
});

describe("role evidence profile", () => {
  it("produces five dimensions per role with levels in range", () => {
    for (const f of allRoleFits()) {
      expect(f.dimensions).toHaveLength(5);
      for (const d of f.dimensions) expect([0, 1, 2, 3]).toContain(d.level);
    }
  });
  it("reports insufficient evidence when nothing matches", () => {
    const f = roleFit("data-engineer", { projects: [], experiences: [], skills: [], certifications: [] });
    expect(f.dimensions.every((d) => d.level === 0)).toBe(true);
  });
  it("does not count discontinued or unattributed projects", () => {
    const base = projects.find((p) => p.slug === "agni-pulse")!;
    const f = roleFit("ml-engineer", { projects: [{ ...base, status: "Discontinued" }, { ...base, contributions: { ...base.contributions, individual: null } }], experiences: [], skills: [], certifications: [] });
    expect(f.dimensions.find((d) => d.id === "projects")!.level).toBe(0);
  });
  it("caps practical experience at applied and credentials at applied", () => {
    for (const f of allRoleFits()) {
      expect(f.dimensions.find((d) => d.id === "work")!.level).toBeLessThanOrEqual(2);
      expect(f.dimensions.find((d) => d.id === "credentials")!.level).toBeLessThanOrEqual(2);
    }
  });
});

describe("skill evidence labels", () => {
  it("derives from linked evidence", () => {
    expect(skillEvidenceLabel({ relatedProjects: ["x"], relatedExperiences: [], evidenceLevel: "demonstrated" })).toBe("Used in projects");
    expect(skillEvidenceLabel({ relatedProjects: [], relatedExperiences: ["x"], evidenceLevel: "working" })).toBe("Applied during internship");
    expect(skillEvidenceLabel({ relatedProjects: [], relatedExperiences: [], evidenceLevel: "working" })).toBe("Academic exposure");
    expect(skillEvidenceLabel({ relatedProjects: ["x"], relatedExperiences: [], evidenceLevel: "learning" })).toBe("Currently learning");
  });
});

describe("content integrity", () => {
  it("has seven certifications with HTTPS verification links", () => {
    expect(certifications).toHaveLength(7);
    for (const c of certifications) expect(c.credentialUrl.startsWith("https://")).toBe(true);
  });
  it("every journey photo reference exists", () => {
    for (const e of journey) if (e.photoId) expect(photos.some((p) => p.id === e.photoId), e.id).toBe(true);
  });
  it("never states an exact fifth place or a winner award", () => {
    const text = JSON.stringify([journey, experiences]).toLowerCase();
    expect(text).not.toContain("fifth place finish");
    expect(text).not.toContain("winner of");
  });
  it("journey begins with Class 11", () => {
    expect(journey[0]!.dateLabel).toBe("Class 11");
  });
});
