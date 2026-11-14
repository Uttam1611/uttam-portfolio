import type { EvidenceLevel, ProjectStatus, StageEvidence } from "@/content/types";
import { ArrowUpRight } from "lucide-react";

export function SectionHeader({ title, children, id }: { title: string; children?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 id={id} className="h-section">{title}</h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </div>
  );
}

export function PageIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="wrap pt-16 pb-12 sm:pt-24">
      <h1 className="serif font-normal tracking-[-0.02em] leading-[1.05] text-[clamp(2.4rem,5.5vw,3.9rem)]">{title}</h1>
      <p className="mt-5 max-w-[60ch] text-lg text-muted">{children}</p>
    </div>
  );
}

const statusDot: Record<ProjectStatus, string> = {
  Completed: "var(--ev-demonstrated)",
  "Working Prototype": "var(--accent)",
  "In Progress": "var(--ev-working)",
  "Research / Experimental": "var(--muted)",
  Discontinued: "var(--line-strong)",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: statusDot[status] }} />
      {status}
    </span>
  );
}

export const evidenceLabel: Record<EvidenceLevel, string> = {
  demonstrated: "Demonstrated",
  working: "Working knowledge",
  learning: "Currently learning",
  research: "Research exposure",
};

export function EvidenceSwatch({ level }: { level: EvidenceLevel }) {
  return <span aria-hidden className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: `var(--ev-${level})` }} />;
}

export function EvidenceTag({ level }: { level: EvidenceLevel }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <EvidenceSwatch level={level} />
      {evidenceLabel[level]}
    </span>
  );
}

export const stageEvidenceLabel: Record<StageEvidence, string> = {
  "reviewed-code": "Reviewed in code",
  documented: "Documented workflow",
  "to-confirm": "Status to be confirmed",
};

export function Chips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="chip">{t}</li>
      ))}
    </ul>
  );
}

/** A visible, honest placeholder for information that has not been supplied. */
export function NotDocumented({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-line-strong px-4 py-3 text-[0.95rem] text-muted">{children}</p>;
}

export function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 ${className}`}>
      {children}
      <ArrowUpRight size={15} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
