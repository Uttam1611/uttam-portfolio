import type { Metadata } from "next";
import Link from "next/link";
import { achievements, education, schoolYears } from "@/content/education";
import { site } from "@/content/site";
import { formatMonth } from "@/lib/dates";
import { NotDocumented, PageIntro, SectionHeader } from "@/components/ui/primitives";
import { ExperienceSections } from "@/components/ExperienceSections";
import { SkillMatrix } from "@/components/SkillMatrix";

export const metadata: Metadata = {
  title: "Experience, education and skills",
  description: "Internships at CSIR-NPL, IBM SkillsBuild and ProdeskIT, hackathons, student leadership, education and an evidence-labelled skills list.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  const deg = education[0]!;
  return (
    <>
      <PageIntro title="Experience and education">
        Professional internships come first, then leadership, then hackathons.
      </PageIntro>

      <section aria-labelledby="timeline" className="wrap pb-20">
        <ExperienceSections />
      </section>

      <section id="education" aria-labelledby="edu-h" className="scroll-mt-24 border-t border-line py-20">
        <div className="wrap">
          <SectionHeader id="edu-h" title="Education" />
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="serif text-[1.6rem] leading-snug">{deg.institution}, {deg.location}</h3>
              <p className="mt-1 text-lg text-muted">{deg.degree}, {deg.specialisation} specialisation</p>
              <p className="mt-2 text-muted">{formatMonth(deg.startDate!)} to {formatMonth(deg.endDate!)}</p>
              <p className="serif mt-6 text-5xl">{deg.score}<span className="ml-2 font-sans text-lg text-muted">{deg.scoreLabel} out of {deg.scoreScale}</span></p>
            </div>
            <dl className="space-y-5 self-end">
              {education.slice(1).map((e) => (
                <div key={e.id} className="border-t border-line-strong pt-3">
                  <dt className="text-muted">{e.institution}, {schoolYears[e.id]}</dt>
                  <dd className="serif text-2xl">{e.score}%<span className="ml-2 font-sans text-sm text-muted">out of {e.scoreScale}</span></dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-10 text-muted">Languages: {site.languages.join(", ")}.</p>
        </div>
      </section>

      <section id="achievements" aria-labelledby="ach-h" className="scroll-mt-24 border-t border-line py-20">
        <div className="wrap grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader id="ach-h" title="Achievements" />
            <ul className="divide-y divide-line border-y border-line">
              {achievements.map((a) => (
                <li key={a.id} className="py-4">
                  <p className="text-sm text-muted">{a.kind}</p>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-[0.95rem] text-muted">{a.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="Certificates" />
            <p className="max-w-[48ch] text-muted">Seven verified certificates from IBM, Google and IIT Guwahati, each with a verification link.</p>
            <p className="mt-4"><Link href="/certifications" className="btn btn-ghost">Open the certificate gallery</Link></p>
            <div className="mt-6 space-y-3">
              <NotDocumented>Awards: none recorded. The hackathon results above are placements, not winner awards.</NotDocumented>
              <NotDocumented>Publications: none recorded.</NotDocumented>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-line"><SkillMatrix /></div>
    </>
  );
}
