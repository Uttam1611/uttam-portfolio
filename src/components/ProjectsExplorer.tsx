"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectCluster, ProjectStatus, RankingLabel, RepoCollection } from "@/content/types";
import { ProjectRow } from "./ProjectRow";
import { ExternalLink } from "./ui/primitives";

type Sort = "featured" | "recent" | "az";
const rankOrder: RankingLabel[] = ["Featured", "Strong technical project", "Supporting project", "Research / experimental work", "Learning / exploratory work"];
const sorts: { id: Sort; label: string }[] = [
  { id: "featured", label: "Strongest first" },
  { id: "recent", label: "Most recent first" },
  { id: "az", label: "A to Z" },
];

export function ProjectsExplorer({ projects, collections }: { projects: Project[]; collections: RepoCollection[] }) {
  const [q, setQ] = useState("");
  const [cluster, setCluster] = useState<ProjectCluster | null>(null);
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [rank, setRank] = useState<RankingLabel | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- reads the URL once after mount; it cannot be read during SSR */
  // Read filters from the URL once on mount, then keep the URL in sync.
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    const c = u.get("cluster"); const s = u.get("status"); const r = u.get("rank"); const so = u.get("sort");
    if (c && projects.some((p) => p.cluster === c)) setCluster(c as ProjectCluster);
    if (s && projects.some((p) => p.status === s)) setStatus(s as ProjectStatus);
    if (r && rankOrder.includes(r as RankingLabel)) setRank(r as RankingLabel);
    if (so && sorts.some((x) => x.id === so)) setSort(so as Sort);
    setQ(u.get("q") ?? "");
    setReady(true);
  }, [projects]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (cluster) u.set("cluster", cluster);
    if (status) u.set("status", status);
    if (rank) u.set("rank", rank);
    if (sort !== "featured") u.set("sort", sort);
    const qs = u.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, cluster, status, rank, sort, ready]);

  const clusters = useMemo(() => [...new Set(projects.map((p) => p.cluster))], [projects]);
  const statuses = useMemo(() => [...new Set(projects.map((p) => p.status))], [projects]);
  const ranks = useMemo(() => rankOrder.filter((r) => projects.some((p) => p.ranking === r)), [projects]);

  const needle = q.trim().toLowerCase();
  const matches = (p: Project) =>
    (!cluster || p.cluster === cluster) && (!status || p.status === status) && (!rank || p.ranking === rank) &&
    (!needle || [p.title, p.tagline, p.shortDescription, p.cluster, ...p.technologies].join(" ").toLowerCase().includes(needle));
  const shown = projects.filter(matches).sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "recent") return (b.startDate ?? "0").localeCompare(a.startDate ?? "0") || a.title.localeCompare(b.title);
    return rankOrder.indexOf(a.ranking) - rankOrder.indexOf(b.ranking) || a.title.localeCompare(b.title);
  });
  const shownCollections = collections.filter((c) =>
    (!cluster || c.cluster === cluster) && (!status) && (!rank || c.ranking === rank) &&
    (!needle || [c.title, c.summary, ...c.repos.map((r) => r.name + r.blurb)].join(" ").toLowerCase().includes(needle)));
  const active = Boolean(q || cluster || status || rank);
  const reset = () => { setQ(""); setCluster(null); setStatus(null); setRank(null); };
  const total = projects.length;

  return (
    <div>
      <div className="space-y-5 border-y border-line py-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Search projects, technologies or themes</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="For example FastAPI, CT, agent" className="min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-ink placeholder:text-muted" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-ink">
              {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm text-muted">Theme</legend>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="pill" aria-pressed={cluster === null} onClick={() => setCluster(null)}>All</button>
            {clusters.map((c) => <button key={c} type="button" className="pill" aria-pressed={cluster === c} onClick={() => setCluster(cluster === c ? null : c)}>{c}</button>)}
          </div>
        </fieldset>
        <div className="grid gap-5 md:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Maturity</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="pill" aria-pressed={status === null} onClick={() => setStatus(null)}>All</button>
              {statuses.map((s) => <button key={s} type="button" className="pill" aria-pressed={status === s} onClick={() => setStatus(status === s ? null : s)}>{s}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Assessment</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="pill" aria-pressed={rank === null} onClick={() => setRank(null)}>All</button>
              {ranks.map((r) => <button key={r} type="button" className="pill" aria-pressed={rank === r} onClick={() => setRank(rank === r ? null : r)}>{r}</button>)}
            </div>
          </fieldset>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <p role="status" aria-live="polite" data-testid="project-count">Showing {shown.length} of {total} projects</p>
          {active && <button type="button" className="link-quiet" onClick={reset}>Reset filters</button>}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="py-14">
          <p className="h-card">No case study matches</p>
          <p className="mt-2 text-muted">Try fewer filters or a different search term.</p>
          <button type="button" className="btn btn-ghost mt-5" onClick={reset}>Reset filters</button>
        </div>
      ) : (
        <div>{shown.map((p) => <div key={p.id} className="border-b border-line last:border-b-0"><ProjectRow project={p} /></div>)}</div>
      )}

      {shownCollections.length > 0 && (
        <section aria-labelledby="collections" className="mt-16 border-t border-line pt-12" data-testid="collections">
          <h2 id="collections" className="h-section">Smaller repositories, grouped</h2>
          <p className="mt-3 max-w-[62ch] text-muted">These are not case studies. They are practice, coursework and small tools, grouped so near-identical work does not compete with the projects above.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {shownCollections.map((c) => (
              <details key={c.id} className="panel p-6" data-testid="collection">
                <summary className="cursor-pointer list-none">
                  <p className="text-sm text-muted">{c.cluster}</p>
                  <h3 className="h-card mt-1">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-muted">{c.summary}</p>
                  <p className="mt-3 text-sm text-accent underline underline-offset-4">{c.repos.length} repositories</p>
                </summary>
                <ul className="mt-5 space-y-4 border-t border-line pt-5">
                  {c.repos.map((r) => (
                    <li key={r.name}>
                      <ExternalLink href={r.url} className="link-quiet font-medium">{r.name}</ExternalLink>
                      <p className="text-xs text-muted">{r.period}</p>
                      <p className="text-[0.95rem] text-muted">{r.blurb}</p>
                      {r.note && <p className="text-sm text-muted">{r.note}</p>}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      )}
      <p className="mt-10 text-sm text-muted">How projects are assessed: technical depth, how much is actually implemented, engineering complexity, relevance to target roles, documented personal contribution, documentation and practical usefulness. The result is a label, not a score. <Link href="/analytics" className="link-quiet">See the analytics <ArrowUpRight size={13} className="inline" aria-hidden /></Link></p>
    </div>
  );
}
