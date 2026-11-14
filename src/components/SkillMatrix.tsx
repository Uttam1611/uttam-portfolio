"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { skills, skillCategories } from "@/content/skills";
import { projects } from "@/content/projects";
import { experiences } from "@/content/experience";
import { SectionHeader } from "./ui/primitives";

type Col = { key: string; label: string; kind: "internship" | "project"; href: string };

/** Skills on the Y-axis, projects and internships on the X-axis; a point marks where a skill was applied. */
export function SkillMatrix({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [cat, setCat] = useState<string>("All");

  const cols: Col[] = useMemo(() => {
    const ex = experiences.filter((e) => e.category === "Internship").map((e) => ({ key: `e:${e.id}`, label: e.organisation.replace("CSIR-National Physical Laboratory", "CSIR-NPL"), kind: "internship" as const, href: "/experience" }));
    const pr = projects.map((p) => ({ key: `p:${p.slug}`, label: p.title.replace("Aircraft Damage Classification and BLIP Captioning", "Aircraft Damage").replace("Airline Disruption Resolution Agent", "Airline Agent").replace("Customer Support Ticket Agent", "Support Agent").replace("CSIR-NPL Digital Twin", "Digital Twin"), kind: "project" as const, href: `/projects/${p.slug}` }));
    const all = [...ex, ...pr];
    const used = new Set(skills.flatMap((s) => [...s.relatedExperiences.map((x) => `e:${x}`), ...s.relatedProjects.map((x) => `p:${x}`)]));
    return all.filter((c) => used.has(c.key));
  }, []);

  const rows = useMemo(() => {
    const withLinks = skills.map((s) => ({ s, keys: new Set([...s.relatedExperiences.map((x) => `e:${x}`), ...s.relatedProjects.map((x) => `p:${x}`)]) })).filter((r) => r.keys.size > 0);
    let list = withLinks.sort((a, b) => b.keys.size - a.keys.size);
    if (compact) return list.slice(0, 12);
    if (cat !== "All") list = list.filter((r) => r.s.category === cat);
    return list;
  }, [compact, cat]);

  const shortName = (n: string) => n.replace("Retrieval-augmented generation with LangChain, LangGraph and Chroma", "Retrieval-augmented generation (RAG)").replace(/ with Keras and TensorFlow/, " (Keras)").replace("DICOM, Hounsfield units and CT windowing", "DICOM and CT windowing").replace("Measurement uncertainty (Type A, Type B, combined)", "Measurement uncertainty");
  const colTemplate = `minmax(11rem,15rem) repeat(${cols.length}, minmax(2.25rem,1fr))`;

  return (
    <section id="skills" aria-labelledby="skills-h" className="scroll-mt-24 wrap py-16">
      <SectionHeader id="skills-h" title="Skills, and where I used them">
        Each row is a skill. A dot means it was used in that internship or project. Hover, focus or tap a skill or a column to follow it across.
      </SectionHeader>

      {!compact && (
        <div role="group" aria-label="Filter skills by area" className="mb-6 flex flex-wrap gap-2">
          {["All", ...skillCategories].map((c) => (
            <button key={c} type="button" className="pill" aria-pressed={cat === c} onClick={() => setCat(c)}>{c.replace(" and ", " & ")}</button>
          ))}
        </div>
      )}

      <div className="surface-card overflow-x-auto p-3 sm:p-5" tabIndex={0} role="region" aria-label="Skills matrix">
        <div className="min-w-[40rem]" data-testid="skill-matrix" onMouseLeave={() => setActive(null)}>
          <div className="grid items-end gap-x-1" style={{ gridTemplateColumns: colTemplate }}>
            <span />
            {cols.map((c) => (
              <Link key={c.key} href={c.href} onMouseEnter={() => setActive(c.key)} onFocus={() => setActive(c.key)} onBlur={() => setActive(null)}
                className={`flex h-28 items-end justify-center rounded-t-md pb-1 text-xs leading-tight transition-colors hover:text-ink ${active === c.key ? "bg-accent-soft text-ink" : "text-muted"} ${c.kind === "internship" ? "font-semibold" : ""}`}
                title={`${c.label} (${c.kind})`}>
                <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{c.label}</span>
              </Link>
            ))}
          </div>
          <ul>
            {rows.map(({ s, keys }) => (
              <li key={s.id} className={`grid items-center gap-x-1 border-t border-line ${active === s.id ? "bg-accent-soft" : ""}`} style={{ gridTemplateColumns: colTemplate }} data-testid="skill-row"
                onMouseEnter={() => setActive(s.id)} onFocus={() => setActive(s.id)} onBlur={() => setActive(null)} tabIndex={0}
                aria-label={`${s.name}: used in ${[...keys].map((k) => cols.find((c) => c.key === k)?.label).filter(Boolean).join(", ")}`}>
                <span className="py-2 pr-2 text-[0.9rem] leading-tight">{shortName(s.name)}</span>
                {cols.map((c) => {
                  const on = keys.has(c.key);
                  const hl = active === c.key || active === s.id;
                  return (
                    <span key={c.key} className={`flex h-9 items-center justify-center ${active === c.key ? "bg-accent-soft" : ""}`}>
                      {on ? <span aria-hidden className={`block rounded-full transition-transform ${hl ? "scale-125" : ""}`} style={{ width: 14, height: 14, background: c.kind === "internship" ? "var(--blue)" : "var(--accent)", boxShadow: "0 0 0 3px var(--surface)" }} /> : <span aria-hidden className="block h-1 w-1 rounded-full bg-line-strong" />}
                    </span>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" aria-label="Legend">
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3.5 w-3.5 rounded-full" style={{ background: "var(--blue)" }} />Internship</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3.5 w-3.5 rounded-full" style={{ background: "var(--accent)" }} />Project</li>
        </ul>
      </div>
      {compact && <p className="mt-6"><Link href="/experience#skills" className="link-quiet">See all skills</Link></p>}
    </section>
  );
}
