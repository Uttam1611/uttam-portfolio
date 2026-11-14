"use client";
import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { certifications } from "@/content/education";
import { formatMonth } from "@/lib/dates";
import { ExternalLink } from "./ui/primitives";

export function CertificationsGallery({ compact = false }: { compact?: boolean }) {
  const [issuer, setIssuer] = useState<string | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const issuers = useMemo(() => [...new Set(certifications.map((c) => c.issuingOrganisation))], []);
  const skills = useMemo(() => [...new Set(certifications.flatMap((c) => c.skills))].sort(), []);
  const sorted = [...certifications].sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  const shown = sorted.filter((c) => (!issuer || c.issuingOrganisation === issuer) && (!skill || c.skills.includes(skill)));

  return (
    <div>
      {!compact && (
        <div className="space-y-5 border-y border-line py-6">
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Issuer</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="pill" aria-pressed={issuer === null} onClick={() => setIssuer(null)}>All</button>
              {issuers.map((i) => <button key={i} type="button" className="pill" aria-pressed={issuer === i} onClick={() => setIssuer(issuer === i ? null : i)}>{i}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Skill</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="pill" aria-pressed={skill === null} onClick={() => setSkill(null)}>All</button>
              {skills.map((s) => <button key={s} type="button" className="pill" aria-pressed={skill === s} onClick={() => setSkill(skill === s ? null : s)}>{s}</button>)}
            </div>
          </fieldset>
          <p role="status" className="text-sm text-muted">Showing {shown.length} of {certifications.length} certificates</p>
        </div>
      )}
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="cert-list">
        {shown.map((c) => (
          <li key={c.id} className="panel flex flex-col p-6" data-testid="cert-card">
            <p className="text-sm text-muted">{c.issuingOrganisation} · {formatMonth(c.issueDate)}</p>
            <h3 className="h-card mt-2">{c.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
              {c.skills.map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
            {c.skillsNote && <p className="mt-2 text-xs text-muted">{c.skillsNote}</p>}
            <p className="mt-4 text-sm text-muted">{c.credentialId ? <>Credential ID <span className="break-all">{c.credentialId}</span></> : "Credential ID not supplied. Verified through the badge page."}</p>
            <div className="mt-auto pt-5">
              <ExternalLink href={c.credentialUrl} className="btn btn-ghost"><BadgeCheck size={16} aria-hidden /> Verify on {c.platform === "GiveMyCertificate" ? "the issuer's page" : c.platform}</ExternalLink>
            </div>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="mt-8 text-muted">No certificate matches both filters. Reset one of them.</p>}
    </div>
  );
}
