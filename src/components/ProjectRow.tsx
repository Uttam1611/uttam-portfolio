import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Github } from "./ui/BrandIcons";
import type { Project } from "@/content/types";
import { Chips, ExternalLink, StatusBadge } from "./ui/primitives";

/** Editorial list row used on Home and Work. The whole title is the case-study link. */
export function ProjectRow({ project: p }: { project: Project }) {
  return (
    <article className="group grid gap-5 border-t border-line py-9 first:border-t-0 md:grid-cols-[1fr_1.1fr] md:gap-12" data-testid="project-row" data-slug={p.slug}>
      <div>
        <p className="text-sm text-muted">{p.cluster}</p>
        <h3 className="serif mt-1 text-[clamp(1.6rem,2.8vw,2.1rem)] leading-tight tracking-tight">
          <Link href={`/projects/${p.slug}`} className="inline-flex items-start gap-2 hover:text-accent">
            {p.title}
            <ArrowUpRight size={20} className="mt-2 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatusBadge status={p.status} />
          <span className="text-sm text-muted">{p.collaboration === "collaborative" ? "Team project" : "Individual project"}</span>
        </div>
        <p className="mt-2 text-sm"><span className="chip">{p.ranking}</span></p>
      </div>
      <div>
        <p className="max-w-[56ch] text-muted">{p.shortDescription}</p>
        <div className="mt-4"><Chips items={p.technologies} /></div>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem]">
          <Link href={`/projects/${p.slug}`} className="link-quiet">Read the case study</Link>
          {p.repositoryUrl ? (
            <ExternalLink href={p.repositoryUrl} className="link-quiet"><Github size={15} aria-hidden /> Repository</ExternalLink>
          ) : (
            <span className="text-muted">{p.status === "In Progress" ? "Repository private for now" : "No repository available"}</span>
          )}
        </div>
      </div>
    </article>
  );
}
