"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import { journey } from "@/content/journey";
import { projects } from "@/content/projects";
import { skills, skillCategories } from "@/content/skills";
import { skillAreas, evidenceKindLabel, type EvidenceKind } from "@/content/skillAreas";
import { site } from "@/content/site";
import { education } from "@/content/education";
import { formatMonth, monthIndex } from "@/lib/dates";
import { DEGREE_TOTAL_LABEL, degreeProgressAt } from "@/lib/degree";
import { allRoleFits, dimensions, fitLabel, roles, skillEvidenceLabel, skillLabelOrder, type FitLevel } from "@/lib/roles";
import { asOf, STATUS_ORDER } from "@/lib/metrics";
import type { JourneyKind, ProjectStatus, RoleId } from "@/content/types";
import { ChartCard } from "./Charts";

/* ---------- 1. Degree progress ---------- */
function DegreeProgress() {
  const fallback = Date.parse(`${site.lastUpdated}T00:00:00Z`);
  const day = () => Math.floor(Date.now() / 86400000) * 86400000;
  const live = useSyncExternalStore(() => () => {}, () => true, () => false);
  const now = useSyncExternalStore(() => () => {}, day, () => fallback);
  const p = degreeProgressAt(now);
  const deg = education[0]!;
  return (
    <ChartCard title="Degree progress" what="Calendar time through the four-year B.Tech programme. It does not measure credits or academic requirements completed.">
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <p className="serif text-5xl" data-testid="degree-percent">{p.percent}%</p>
        <p className="text-muted">{p.status === "complete" ? "Programme period complete" : p.status === "not-started" ? "Not started" : `${p.elapsedLabel} of ${DEGREE_TOTAL_LABEL.toLowerCase()} elapsed`}</p>
      </div>
      <div className="mt-5 h-3 rounded-full bg-surface-2" role="progressbar" aria-label="Degree progress by calendar time" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.percent}>
        <div className="h-full rounded-full bg-accent" style={{ width: `${p.fraction * 100}%` }} />
      </div>
      <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
        <div><dt className="text-muted">Time elapsed</dt><dd className="font-medium">{p.elapsedLabel}</dd></div>
        <div><dt className="text-muted">Programme length</dt><dd className="font-medium">{DEGREE_TOTAL_LABEL}</dd></div>
        <div><dt className="text-muted">Started</dt><dd className="font-medium">{formatMonth(deg.startDate!)}</dd></div>
        <div><dt className="text-muted">Expected graduation</dt><dd className="font-medium">{formatMonth(deg.endDate!)}</dd></div>
      </dl>
      <p className="mt-4 text-xs text-muted">{live ? "Calculated from today's date in your browser." : `Showing the position as of ${formatMonth(asOf)}; updating to today's date.`}</p>
    </ChartCard>
  );
}

/* ---------- 2. Role fit ---------- */
const levelMark: Record<FitLevel, string> = { 0: "○○○", 1: "●○○", 2: "●●○", 3: "●●●" };

/** Three-step evidence meter (no radar): filled steps = evidence level. */
function Meter({ level }: { level: FitLevel }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {[1, 2, 3].map((n) => <span key={n} className="h-2.5 w-10 rounded-full sm:w-14" style={{ background: n <= level ? "var(--accent)" : "var(--surface-2)", boxShadow: n <= level ? "none" : "inset 0 0 0 1px var(--line-strong)" }} />)}
    </span>
  );
}

function RoleFitView() {
  const fits = useMemo(() => allRoleFits(), []);
  const [role, setRole] = useState<RoleId>("ml-engineer");
  const cur = fits.find((f) => f.role === role)!;
  return (
    <ChartCard
      title="Role evidence profile"
      what="For each target role, how much verified evidence backs five dimensions. It is an evidence profile, not a suitability percentage. Pick a role to see the projects and experience behind each step."
      table={
        <table className="w-full min-w-[34rem] text-left">
          <caption className="sr-only">Evidence level per role and dimension</caption>
          <thead><tr><th className="py-2 pr-3 font-medium">Role</th>{dimensions.map((d) => <th key={d.id} className="py-2 pr-3 font-medium">{d.name}</th>)}</tr></thead>
          <tbody>{fits.map((f) => <tr key={f.role} className="border-t border-line"><th scope="row" className="py-2 pr-3 font-medium">{f.name}</th>{f.dimensions.map((d) => <td key={d.id} className="py-2 pr-3">{fitLabel[d.level]}</td>)}</tr>)}</tbody>
        </table>
      }
    >
      <div role="radiogroup" aria-label="Choose a role" className="flex flex-wrap gap-2">
        {roles.map((r) => <button key={r.id} type="button" role="radio" aria-checked={role === r.id} className="pill" onClick={() => setRole(r.id)}>{r.name}</button>)}
      </div>
      <ul className="mt-6 divide-y divide-line" data-testid="role-dims">
        {cur.dimensions.map((d) => {
          const meta = dimensions.find((x) => x.id === d.id)!;
          return (
            <li key={d.id} className="grid gap-2 py-4 sm:grid-cols-[11rem_auto_1fr] sm:items-center sm:gap-6">
              <p className="font-medium">{meta.name}</p>
              <p className="flex items-center gap-3"><Meter level={d.level} /><span className="text-sm font-medium" aria-label={fitLabel[d.level]}>{fitLabel[d.level]}</span></p>
              <p className="text-sm text-muted">{d.evidence.length > 0 ? d.evidence.slice(0, 4).join(", ") + (d.evidence.length > 4 ? ` and ${d.evidence.length - 4} more` : "") : ""}</p>
            </li>
          );
        })}
      </ul>
      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-muted hover:text-ink">How each level is decided</summary>
        <ul className="mt-3 space-y-2">{dimensions.map((d) => <li key={d.id}><span className="font-medium">{d.name}.</span> <span className="text-muted">{d.rule}</span></li>)}</ul>
        <p className="mt-3 text-muted">Levels: exposure, applied, demonstrated. Ratings change only when the underlying records change.</p>
      </details>
    </ChartCard>
  );
}

/* ---------- 3. Achievement timeline ---------- */
const kindStyle: Record<JourneyKind, { label: string; color: string; shape: "circle" | "square" | "diamond" | "ring" }> = {
  school: { label: "School", color: "var(--muted)", shape: "ring" },
  university: { label: "University", color: "var(--accent)", shape: "ring" },
  project: { label: "Project", color: "var(--accent)", shape: "circle" },
  internship: { label: "Internship", color: "var(--blue)", shape: "circle" },
  hackathon: { label: "Hackathon", color: "var(--ochre)", shape: "diamond" },
  certification: { label: "Certificate", color: "var(--ev-working)", shape: "square" },
  leadership: { label: "Leadership", color: "var(--blue)", shape: "ring" },
  present: { label: "Now", color: "var(--accent)", shape: "ring" },
};
function Marker({ kind, size = 16 }: { kind: JourneyKind; size?: number }) {
  const s = kindStyle[kind];
  const common = { fill: s.shape === "ring" ? "var(--bg)" : s.color, stroke: s.color, strokeWidth: 2 };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      {s.shape === "square" ? <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" {...common} /> : s.shape === "diamond" ? <path d="M8 1.5 14.5 8 8 14.5 1.5 8Z" {...common} /> : <circle cx="8" cy="8" r="5.5" {...common} />}
    </svg>
  );
}

function AchievementTimeline() {
  const dated = journey.filter((e) => e.date);
  const years = [...new Set(dated.map((e) => e.date!.slice(0, 4)))].sort();
  const undated = journey.filter((e) => !e.date);
  const [year, setYear] = useState<string>(years.includes("2025") ? "2025" : years[0]!);
  const [sel, setSel] = useState<string | null>(null);
  const inYear = year === "undated" ? undated : dated.filter((e) => e.date!.startsWith(year));
  const active = inYear.find((e) => e.id === sel) ?? inYear[0];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <ChartCard
      title="Learning and achievement timeline"
      what="Dated milestones by year: certificates, internships, hackathons and projects. Choose a year, then a marker for details. Project markers use the month of the first or latest repository commit, as labelled."
      table={<ul className="space-y-1">{journey.map((e) => <li key={e.id}>{e.dateLabel}: {e.title} ({kindStyle[e.kind].label})</li>)}</ul>}
    >
      <div role="tablist" aria-label="Year" className="flex flex-wrap gap-2">
        {[...years, "undated"].map((y) => (
          <button key={y} type="button" role="tab" aria-selected={year === y} className="pill" onClick={() => { setYear(y); setSel(null); }}>{y === "undated" ? "Date to be added" : y}</button>
        ))}
      </div>
      {year !== "undated" && (
        <div className="relative mt-8 h-24">
          <div className="absolute inset-x-0 top-12 h-px bg-line-strong" />
          {months.map((m, i) => <span key={i} className="absolute top-14 -translate-x-1/2 text-xs text-muted" style={{ left: `${((i + 0.5) / 12) * 100}%` }}>{m}</span>)}
          {inYear.map((e, idx) => {
            const mi = Number(e.date!.slice(5, 7)) - 1;
            const stack = inYear.slice(0, idx).filter((o) => o.date!.slice(5, 7) === e.date!.slice(5, 7)).length;
            return (
              <button key={e.id} type="button" aria-label={`${e.dateLabel}: ${e.title}`} aria-pressed={active?.id === e.id} onClick={() => setSel(e.id)}
                className="absolute grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full hover:bg-surface-2 aria-pressed:bg-surface-2"
                style={{ left: `${((mi + 0.5) / 12) * 100}%`, top: 30 - stack * 30 - 5 }}>
                <Marker kind={e.kind} />
              </button>
            );
          })}
        </div>
      )}
      {active ? (
        <div className="mt-4 border-t border-line pt-4" aria-live="polite" data-testid="timeline-detail">
          <p className="text-sm text-muted">{active.dateLabel} · {kindStyle[active.kind].label}</p>
          <p className="serif mt-1 text-xl">{active.title}</p>
          <p className="mt-2 max-w-[62ch] text-muted">{active.summary}</p>
        </div>
      ) : null}
      {year !== "undated" && inYear.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Milestones this year">
          {inYear.map((e) => <li key={e.id}><button type="button" className="pill" aria-pressed={active?.id === e.id} onClick={() => setSel(e.id)}>{e.title}</button></li>)}
        </ul>
      )}
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Legend">
        {(["university", "project", "internship", "hackathon", "certification"] as JourneyKind[]).map((k) => <li key={k} className="inline-flex items-center gap-2"><Marker kind={k} size={14} />{kindStyle[k].label}</li>)}
      </ul>
    </ChartCard>
  );
}

/* ---------- 4. Skill development map ---------- */
const evShape: Record<EvidenceKind, JourneyKind> = { project: "project", internship: "internship", academic: "certification", learning: "hackathon" };
function SkillMap() {
  const all = skillAreas.flatMap((a) => a.evidence.map((e) => monthIndex(e.date)));
  const lo = Math.min(...all), hi = Math.max(monthIndex(asOf), ...all);
  const span = hi - lo || 1;
  const [pick, setPick] = useState<{ area: string; label: string; date: string; kind: EvidenceKind; basis: string } | null>(null);
  const ticks = [] as { i: number; label: string }[];
  for (let i = lo; i <= hi; i++) { const y = Math.floor(i / 12), m = i % 12; if (m % 3 === 0) ticks.push({ i, label: `${["Jan", "Apr", "Jul", "Oct"][m / 3]} ${String(y).slice(2)}` }); }
  return (
    <ChartCard
      title="Skill development map"
      what="When each technical area first shows up in dated evidence, and what kind of evidence it is. Areas with no dated evidence are not shown. There are no proficiency levels."
      table={<table className="w-full min-w-[30rem] text-left"><caption className="sr-only">Dated evidence per technical area</caption><thead><tr><th className="py-2 pr-3">Area</th><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Evidence</th><th className="py-2">Type</th></tr></thead><tbody>{skillAreas.flatMap((a) => a.evidence.map((e) => <tr key={a.id + e.label} className="border-t border-line"><th scope="row" className="py-2 pr-3 font-medium">{a.name}</th><td className="py-2 pr-3">{formatMonth(e.date)}</td><td className="py-2 pr-3">{e.label}</td><td className="py-2">{evidenceKindLabel[e.kind]}</td></tr>))}</tbody></table>}
    >
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Skill development map"><div className="min-w-[34rem]">
        <div className="relative ml-40 h-6">{ticks.map((t) => <span key={t.i} className="absolute -translate-x-1/2 text-xs text-muted" style={{ left: `${((t.i - lo) / span) * 100}%` }}>{t.label}</span>)}</div>
        <ul>
          {skillAreas.map((a) => (
            <li key={a.id} className="flex items-center border-t border-line">
              <span className="w-40 shrink-0 py-3 pr-3 text-sm">{a.name}</span>
              <div className="relative h-11 flex-1">
                <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
                {a.evidence.map((e) => (
                  <button key={e.label} type="button" aria-label={`${a.name}, ${formatMonth(e.date)}: ${e.label} (${evidenceKindLabel[e.kind]})`} onClick={() => setPick({ area: a.name, label: e.label, date: formatMonth(e.date), kind: e.kind, basis: e.basis })}
                    className="absolute top-1/2 grid h-11 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full hover:bg-surface-2" style={{ left: `${((monthIndex(e.date) - lo) / span) * 100}%` }}>
                    <Marker kind={evShape[e.kind]} />
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div></div>
      <p className="mt-4 min-h-12 text-sm" aria-live="polite" data-testid="skillmap-detail">{pick ? <><span className="font-medium">{pick.area}, {pick.date}.</span> {pick.label}. <span className="text-muted">{evidenceKindLabel[pick.kind]}; dated from {pick.basis}.</span></> : <span className="text-muted">Select a marker for details.</span>}</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Legend">
        {(Object.keys(evidenceKindLabel) as EvidenceKind[]).filter((k) => k !== "learning").map((k) => <li key={k} className="inline-flex items-center gap-2"><Marker kind={evShape[k]} size={14} />{evidenceKindLabel[k]}</li>)}
      </ul>
    </ChartCard>
  );
}

/* ---------- 5. Composition ---------- */
function Composition() {
  const domains = [...new Set(projects.map((p) => p.primaryDomain))];
  const rows = domains.map((d) => ({ d, counts: STATUS_ORDER_ALL.map((s) => projects.filter((p) => p.primaryDomain === d && p.status === s).length) })).sort((a, b) => b.counts.reduce((x, y) => x + y, 0) - a.counts.reduce((x, y) => x + y, 0));
  return (
    <ChartCard title="Portfolio composition" what="Case-study projects by primary domain and maturity. Small repositories are grouped on the Work page and are not counted here.">
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Projects by domain and maturity table">
        <table className="w-full min-w-[34rem] text-left text-sm" data-testid="composition-table">
          <caption className="sr-only">Projects by primary domain and status</caption>
          <thead><tr><th className="py-2 pr-3 font-medium">Domain</th>{STATUS_ORDER_ALL.map((s) => <th key={s} className="py-2 px-1 text-center font-medium">{s}</th>)}<th className="py-2 pl-3 text-right font-medium">Total</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.d} className="border-t border-line">
                <th scope="row" className="py-2.5 pr-3 font-medium">{r.d}</th>
                {r.counts.map((c, i) => <td key={i} className="px-1 py-2.5 text-center"><span className="inline-grid h-8 min-w-8 place-items-center rounded-md tabular-nums" style={{ background: c ? `color-mix(in srgb, var(--accent) ${25 + c * 30}%, transparent)` : "transparent", color: c ? "var(--text)" : "var(--muted)" }}>{c || "·"}</span></td>)}
                <td className="py-2.5 pl-3 text-right tabular-nums">{r.counts.reduce((a, b) => a + b, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
const STATUS_ORDER_ALL: ProjectStatus[] = [...STATUS_ORDER, "Discontinued"];

/* ---------- 6. Strengths ---------- */
function Strengths() {
  const fits = useMemo(() => allRoleFits(), []);
  return (
    <ChartCard title="Strengths by role" what="Where the verified record is strongest for each target role.">
      <ul className="grid gap-6 md:grid-cols-2">
        {fits.map((f) => {
          const strong = f.dimensions.filter((d) => d.level >= 2).map((d) => ({ name: dimensions.find((x) => x.id === d.id)!.name, level: d.level }));
          return (
            <li key={f.role} className="rounded-xl bg-surface-2 p-5" data-testid="readiness-role">
              <h4 className="serif text-lg">{f.name}</h4>
              {strong.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">{strong.map((x) => <li key={x.name} className="chip">{x.name} · {fitLabel[x.level as FitLevel]}</li>)}</ul>
              ) : <p className="mt-2 text-sm text-muted">Growing through current projects and learning.</p>}
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

/* ---------- 7. Evidence mix by skill category ---------- */
const labelColor: Record<string, string> = { "Used in projects": "var(--ev-demonstrated)", "Applied during internship": "var(--ev-working)", "Academic exposure": "var(--ev-learning)", "Currently learning": "var(--ev-research)" };
function EvidenceMix() {
  const rows = skillCategories.map((c) => {
    const list = skills.filter((s) => s.category === c);
    return { c, total: list.length, counts: skillLabelOrder.map((l) => list.filter((s) => skillEvidenceLabel(s) === l).length) };
  });
  const max = Math.max(...rows.map((r) => r.total));
  return (
    <ChartCard title="Where the skill evidence comes from" what="Each skill, by the strongest kind of evidence behind it. A long dark segment means the skill is backed by project work; a long light one means it is mostly coursework or listed on the resume.">
      <ul className="space-y-3" data-testid="evidence-mix">
        {rows.map((r) => (
          <li key={r.c} className="grid items-center gap-1 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <span className="text-sm">{r.c} <span className="text-muted">({r.total})</span></span>
            <div className="flex h-8 gap-0.5" style={{ width: `${(r.total / max) * 100}%`, minWidth: "3rem" }}>
              {r.counts.map((n, i) => n > 0 ? <span key={i} className="grid flex-1 place-items-center rounded-sm text-xs font-medium tabular-nums" style={{ flexGrow: n, background: labelColor[skillLabelOrder[i]!], color: `var(--ev-ink-${i + 1})` }} title={`${skillLabelOrder[i]}: ${n}`}>{n}</span> : null)}
            </div>
          </li>
        ))}
      </ul>
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Legend">
        {skillLabelOrder.map((l) => <li key={l} className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-3 rounded-sm" style={{ background: labelColor[l] }} />{l}</li>)}
      </ul>
    </ChartCard>
  );
}

export function AnalyticsBoard() {
  return (
    <div className="space-y-8 pb-10">
      <DegreeProgress />
      <RoleFitView />
      <AchievementTimeline />
      <SkillMap />
      <div className="grid gap-8 lg:grid-cols-2 [&>*]:min-w-0"><Composition /><EvidenceMix /></div>
      <Strengths />
    </div>
  );
}
