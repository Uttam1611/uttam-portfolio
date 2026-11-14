import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/content/experience";
import { projects } from "@/content/projects";
import { domainCounts, kpis } from "@/lib/metrics";
import { formatMonth } from "@/lib/dates";
import { SectionHeader } from "./ui/primitives";
import { TimelineChart } from "./TimelineChart";

export function AnalyticsPreview() {
  const k = kpis();
  const domains = domainCounts(projects, "primary");
  const max = Math.max(...domains.map((d) => d.count), 1);
  const figures = [
    { value: String(k.projects), label: "Projects", note: "Published case studies on this site." },
    { value: `${k.internships}`, label: "Internships", note: `Plus ${k.leadership} leadership role. Two internships ran at the same time.` },
    { value: k.cgpa, label: `CGPA out of ${k.cgpaScale}`, note: "As reported, B.Tech CSE, Data Science." },
    { value: formatMonth(k.degree.end), label: "Expected graduation", note: "Four-year programme, August 2023 to May 2027." },
  ];
  return (
    <section aria-labelledby="glance" className="border-y border-line bg-surface/60 py-20">
      <div className="wrap">
        <SectionHeader id="glance" title="The portfolio at a glance">
          Every figure below is calculated from the same records that power the project and experience pages.
        </SectionHeader>

        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="border-t border-line-strong pt-4">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="mt-1 text-4xl font-semibold tracking-tight">{f.value}</dd>
              <dd className="mt-2 text-sm leading-snug text-muted">{f.note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="h-card">Projects by primary domain</h3>
            <ul className="mt-5 space-y-3">
              {domains.map((d) => (
                <li key={d.domain} className="grid grid-cols-[minmax(0,10.5rem)_1fr_1.5rem] items-center gap-3 text-sm">
                  <span className="truncate">{d.domain}</span>
                  <span className="h-2.5 rounded-full bg-surface-2">
                    <span className="bar-fill block h-full rounded-full bg-accent" style={{ width: `${(d.count / max) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums text-muted">{d.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="h-card mb-3">Career timeline</h3>
            <TimelineChart experiences={experiences} compact />
          </div>
        </div>

        <div className="mt-12">
          <Link href="/analytics" className="btn btn-primary">
            Explore full analytics <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
