import Link from "next/link";
import { experiences } from "@/content/experience";
import { formatRange } from "@/lib/dates";
import { SectionHeader } from "./ui/primitives";

export function ExperiencePreview() {
  return (
    <section aria-labelledby="exp-preview" className="wrap py-24">
      <SectionHeader id="exp-preview" title="Experience">Internships and student leadership, newest first.</SectionHeader>
      <ol className="relative ml-1.5 border-l border-line-strong">
        {experiences.map((e) => (
          <li key={e.id} className="relative pb-9 pl-8 last:pb-0">
            <span aria-hidden className="absolute -left-[5px] top-2.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
            <p className="text-sm text-muted">{formatRange(e.startDate, e.endDate)}</p>
            <h3 className="h-card mt-1">{e.role}</h3>
            <p className="text-muted">{e.organisation}</p>
            <p className="mt-2 max-w-[56ch] text-[0.975rem]">{e.summary}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10"><Link href="/experience" className="link-quiet">Full experience and education</Link></p>
    </section>
  );
}
