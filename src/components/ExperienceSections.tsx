import Link from "next/link";
import { experiences } from "@/content/experience";
import { getProject } from "@/content/projects";
import { formatMonth } from "@/lib/dates";
import type { Experience } from "@/content/types";
import { Briefcase, Trophy, Users, ChevronDown } from "lucide-react";

const range = (e: Experience) => (e.startDate === e.endDate ? formatMonth(e.startDate) : `${formatMonth(e.startDate)} to ${e.endDate ? formatMonth(e.endDate) : "present"}`);

/** Native <details> keeps the expand and collapse control working without JavaScript. */
function Expander({ e, label = "Show responsibilities and evidence" }: { e: Experience; label?: string }) {
  const projs = e.relatedProjects.map((s) => getProject(s)).filter(Boolean);
  return (
    <details className="group mt-5 rounded-xl border border-line bg-surface-2/60 open:bg-surface-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 font-medium hover:text-accent-strong [&::-webkit-details-marker]:hidden">
        <span>{label}</span><ChevronDown size={18} aria-hidden className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 px-4 pb-5 text-[0.95rem]">
        <ul className="list-disc space-y-1.5 pl-5 marker:text-line-strong">{e.contributions.map((c) => <li key={c}>{c}</li>)}</ul>
        {e.technologies.length > 0 && <p className="text-muted"><span className="font-medium text-ink">Tools:</span> {e.technologies.join(", ")}</p>}
        {projs.length > 0 && <p className="text-muted"><span className="font-medium text-ink">Related project:</span> {projs.map((p, i) => <span key={p!.slug}>{i > 0 && ", "}<Link className="link-quiet" href={`/projects/${p!.slug}`}>{p!.title}</Link></span>)}</p>}
        {e.evidenceNote && <p className="rounded-lg border-l-4 border-accent bg-surface px-3 py-2 text-muted">{e.evidenceNote}</p>}
      </div>
    </details>
  );
}

export function ExperienceSections() {
  const intern = experiences.filter((e) => e.category === "Internship");
  const lead = experiences.filter((e) => e.category === "Leadership");
  const hack = experiences.filter((e) => e.category === "Hackathon");
  return (
    <div className="space-y-20">
      <section aria-labelledby="sec-intern" data-testid="section-internships">
        <h2 id="sec-intern" className="h-section flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-bg" style={{ background: "var(--blue)" }}><Briefcase size={20} aria-hidden /></span>Professional internships</h2>
        <p className="mt-2 mb-8 max-w-[62ch] text-muted">Three internships. Two ran in the same two months of 2025 and are different roles.</p>
        <ul className="space-y-6">
          {intern.map((e) => (
            <li key={e.id} data-testid="exp-card" data-category="Internship" className="surface-card border-l-[6px] p-6 sm:p-9" style={{ borderLeftColor: "var(--blue)" }}>
              <p className="text-sm font-medium text-accent-strong">{range(e)}{e.location ? ` · ${e.location}` : ""}</p>
              <h3 className="serif mt-2 text-[1.75rem] leading-tight sm:text-[2.1rem]">{e.role}</h3>
              <p className="mt-1 text-lg text-muted">{e.organisation}</p>
              <p className="mt-4 max-w-[62ch] text-[1.0625rem]">{e.summary}</p>
              <Expander e={e} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-lead" data-testid="section-leadership">
        <h2 id="sec-lead" className="h-section flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent-strong"><Users size={20} aria-hidden /></span>Leadership</h2>
        <ul className="mt-6 space-y-4">
          {lead.map((e) => (
            <li key={e.id} data-testid="exp-card" data-category="Leadership" className="surface-card p-6">
              <p className="text-sm text-muted">{range(e)}</p>
              <h3 className="serif mt-1 text-2xl">{e.role}</h3>
              <p className="text-muted">{e.organisation}</p>
              <p className="mt-3 max-w-[62ch]">{e.summary}</p>
              <Expander e={e} label="Show responsibilities" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-hack" data-testid="section-hackathons">
        <h2 id="sec-hack" className="h-section flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-bg" style={{ background: "var(--ochre)" }}><Trophy size={20} aria-hidden /></span>Hackathons and competitions</h2>
        <p className="mt-2 mb-6 max-w-[62ch] text-muted">Team participation, not employment. Results are placements, not winner awards.</p>
        <ul className="grid gap-4 md:grid-cols-2">
          {hack.map((e) => (
            <li key={e.id} data-testid="exp-card" data-category="Hackathon" className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-sm text-muted">{range(e)}{e.location ? ` · ${e.location}` : ""}</p>
              <h3 className="mt-1 text-lg font-semibold">{e.organisation}</h3>
              <p className="text-muted">{e.role}</p>
              <p className="mt-2 text-[0.95rem]">{e.summary}</p>
              <Expander e={e} label="Show details" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
