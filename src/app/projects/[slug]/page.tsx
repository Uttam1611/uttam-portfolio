import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { getPhoto } from "@/content/photos";
import { Github } from "@/components/ui/BrandIcons";
import { getProject, projects } from "@/content/projects";
import { experiences } from "@/content/experience";
import { formatRange } from "@/lib/dates";
import { Chips, ExternalLink, NotDocumented, StatusBadge } from "@/components/ui/primitives";
import { Pipeline } from "@/components/Pipeline";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.shortDescription,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} | Uttam Singh`, description: p.shortDescription, type: "article" },
  };
}

const visualIds: Record<string, string[]> = {
  "csir-npl-digital-twin": ["dt-machine", "drdo-1"],
  pose2post: ["ppt-explain"],
  envital: ["cu-mohali", "cu-lucknow"],
};

const toc = [
  ["overview", "Overview"],
  ["problem", "Problem"],
  ["motivation", "Motivation"],
  ["solution", "Solution and architecture"],
  ["implementation", "Technical implementation"],
  ["contribution", "Contribution"],
  ["decisions", "Engineering decisions"],
  ["results", "Results and evaluation"],
  ["status", "Status and limitations"],
  ["learned", "What it exercises"],
  ["future", "Future work"],
  ["visuals", "Visual evidence"],
  ["resources", "Resources"],
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-line pt-8 pb-12 first:border-t-0 first:pt-0">
      <h2 id={`${id}-h`} className="h-card mb-4 text-[1.5rem]">{title}</h2>
      {children}
    </section>
  );
}
const Paras = ({ items }: { items: string[] }) => (
  <div className="prose-body">{items.map((t) => <p key={t}>{t}</p>)}</div>
);

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length]!;
  const prev = projects[(idx - 1 + projects.length) % projects.length]!;
  const related = experiences.filter((e) => p.relatedExperienceIds.includes(e.id));
  const attrib: [string, string | null][] = [
    ["Uttam's individual work", p.contributions.individual],
    ["Team and collaborators", p.contributions.team],
    ["Existing frameworks and models", p.contributions.frameworks],
    ["AI-assisted development", p.contributions.aiAssisted],
    ["Research exploration", p.contributions.exploration],
  ];
  const allNull = attrib.every(([, v]) => v === null);

  return (
    <article>
      <header className="wrap pt-14 pb-12 sm:pt-20">
        <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden /> All projects</Link>
        <p className="mt-6 text-muted">{p.cluster}{p.context ? `, ${p.context}` : ""}</p>
        <h1 className="serif mt-2 text-[clamp(2.4rem,5.5vw,3.9rem)] leading-[1.05] tracking-[-0.02em]">{p.title}</h1>
        <p className="mt-4 max-w-[48ch] text-xl text-muted">{p.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <StatusBadge status={p.status} />
          <span className="text-sm text-muted">{p.collaboration === "collaborative" ? "Team project" : "Individual project"}</span>
          <span className="chip">{p.ranking}</span>
          {p.startDate || p.endDate ? <span className="text-sm text-muted">{formatRange(p.startDate, p.endDate)}</span> : null}
        </div>
        <div className="mt-6"><Chips items={p.technologies} /></div>
      </header>

      <div className="wrap grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-line text-[0.95rem]">
            {toc.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="block py-1 pl-4 text-muted hover:text-ink">{label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Section id="overview" title="Overview">
            <Paras items={p.overview} />
            <p className="mt-4 text-sm text-muted">Status note: {p.statusNote}</p>
          </Section>
          <Section id="problem" title="Problem statement"><Paras items={p.problemStatement} /></Section>
          <Section id="motivation" title="Motivation"><Paras items={p.motivation} /></Section>

          <Section id="solution" title="Solution and architecture">
            <Paras items={p.solution} />
            <div className="mt-7"><Pipeline stages={p.architecture} /></div>
            {p.architectureNote && <p className="mt-5 max-w-[62ch] text-sm text-muted">{p.architectureNote}</p>}
          </Section>

          <Section id="implementation" title="Technical implementation">
            <div className="grid gap-8 sm:grid-cols-2">
              {p.implementation.map((g) => (
                <div key={g.heading}>
                  <h3 className="font-medium">{g.heading}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted marker:text-line-strong">
                    {g.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="contribution" title={p.collaboration === "collaborative" ? "Contribution (team project)" : "Contribution"}>
            {p.collaboration === "collaborative" && <p className="mb-4 max-w-[62ch] text-sm text-muted">This was built with other people. Only the part attributed to Uttam below is claimed as his; the rest belongs to the team.</p>}
            {allNull ? (
              <NotDocumented>Uttam&rsquo;s individual contribution, team responsibilities and any AI assistance on this project have not been confirmed yet, so none are claimed.</NotDocumented>
            ) : null}
            <dl className="mt-4 space-y-4">
              {attrib.filter(([, v]) => v !== null).map(([k, v]) => (
                <div key={k}><dt className="text-sm text-muted">{k}</dt><dd className="prose-body">{v}</dd></div>
              ))}
            </dl>
            {related.length > 0 && (
              <p className="mt-5 text-sm text-muted">
                Related experience:{" "}
                {related.map((e) => <Link key={e.id} href="/experience" className="link-quiet">{e.organisation}</Link>)}
              </p>
            )}
          </Section>

          <Section id="results" title="Results and evaluation">
            {p.evaluation.measured.length === 0 ? (
              <NotDocumented>No measured results are recorded for this project.</NotDocumented>
            ) : (
              <dl className="grid gap-4 sm:grid-cols-2">
                {p.evaluation.measured.map((m) => (
                  <div key={m.label} className="panel p-4"><dt className="text-sm text-muted">{m.label}</dt><dd className="text-2xl font-semibold">{m.value}</dd>{m.note && <dd className="text-sm text-muted">{m.note}</dd>}</div>
                ))}
              </dl>
            )}
            {p.evaluation.context.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium">Dataset context</h3>
                <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                  {p.evaluation.context.map((m) => (
                    <div key={m.label} className="border-t border-line-strong pt-3"><dt className="text-sm text-muted">{m.label}</dt><dd className="text-3xl font-semibold tracking-tight">{m.value}</dd>{m.note && <dd className="text-sm text-muted">{m.note}</dd>}</div>
                  ))}
                </dl>
              </div>
            )}
            {p.evaluation.note && <p className="mt-5 max-w-[62ch] text-sm text-muted">{p.evaluation.note}</p>}
          </Section>

          <Section id="decisions" title="Engineering decisions and trade-offs">
            {p.decisions.length ? (
              <>
                <ul className="list-disc space-y-1.5 pl-5 text-muted marker:text-line-strong">{p.decisions.map((d) => <li key={d}>{d}</li>)}</ul>
                <p className="mt-4 max-w-[62ch] text-sm text-muted">Taken from the repository&rsquo;s design and README. They describe the project, not necessarily Uttam&rsquo;s own choices.</p>
              </>
            ) : <NotDocumented>No engineering decisions have been documented for this project.</NotDocumented>}
          </Section>

          <Section id="status" title="Current status and limitations">
            <p className="mb-4 flex items-center gap-3"><StatusBadge status={p.status} /></p>
            <p className="mb-4 max-w-[62ch] text-muted">{p.statusNote}</p>
            <ul className="list-disc space-y-1.5 pl-5 text-muted marker:text-line-strong">{p.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
          </Section>

          <Section id="learned" title="What it exercises">
            {p.learned.length ? <ul className="list-disc space-y-1.5 pl-5 text-muted marker:text-line-strong">{p.learned.map((l) => <li key={l}>{l}</li>)}</ul> : <NotDocumented>Not yet written.</NotDocumented>}
            <p className="mt-4 max-w-[62ch] text-sm text-muted">The concepts this work involves. Uttam&rsquo;s own reflections on what he learned are still to be added.</p>
          </Section>

          <Section id="future" title="Future work">
            {p.futureWork.length ? <ul className="list-disc space-y-1.5 pl-5 text-muted marker:text-line-strong">{p.futureWork.map((l) => <li key={l}>{l}</li>)}</ul> : <p className="text-muted">No future work is documented yet.</p>}
          </Section>

          <Section id="visuals" title="Visual evidence">
            {(visualIds[p.slug] ?? []).length ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {(visualIds[p.slug] ?? []).map((id) => { const ph = getPhoto(id); return ph ? (
                  <figure key={id}><div className="photo-frame"><Image src={ph.file} alt={ph.alt} width={ph.width} height={ph.height} sizes="(min-width:640px) 340px, 100vw" className="h-auto w-full" /></div><figcaption className="mt-2 text-sm text-muted">{ph.caption}</figcaption></figure>
                ) : null; })}
              </div>
            ) : <NotDocumented>No screenshots have been approved for publication yet. The architecture diagram above shows the pipeline.</NotDocumented>}
          </Section>

          <Section id="resources" title="Resources">
            <ul className="space-y-3">
              <li>{p.repositoryUrl ? <ExternalLink href={p.repositoryUrl} className="link-quiet"><Github size={16} aria-hidden /> GitHub repository</ExternalLink> : <span className="text-muted">GitHub repository: link not added yet.</span>}</li>
              <li>{p.demoUrl ? <ExternalLink href={p.demoUrl} className="link-quiet">Live demo</ExternalLink> : <span className="text-muted">Demo: none available.</span>}</li>
              <li>{p.docsUrl ? <ExternalLink href={p.docsUrl} className="link-quiet">Technical documentation</ExternalLink> : <span className="text-muted">Technical documentation: none published.</span>}</li>
              <li className="text-muted">{p.screenshots.length ? `${p.screenshots.length} screenshots` : "Screenshots: none approved for publication yet."}</li>
            </ul>
          </Section>

          <nav aria-label="Other projects" className="mt-6 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}`} className="group panel p-5 transition-colors hover:border-accent">
              <span className="flex items-center gap-2 text-sm text-muted"><ArrowLeft size={15} aria-hidden /> Previous</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
            <Link href={`/projects/${next.slug}`} className="group panel p-5 text-right transition-colors hover:border-accent">
              <span className="flex items-center justify-end gap-2 text-sm text-muted">Next <ArrowRight size={15} aria-hidden /></span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
