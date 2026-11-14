import Link from "next/link";
import { getAssets } from "@/lib/assets";
import { projects } from "@/content/projects";
import { Hero } from "@/components/Hero";
import { AnalyticsPreview } from "@/components/AnalyticsPreview";
import { ProjectRow } from "@/components/ProjectRow";
import { ExperiencePreview } from "@/components/ExperiencePreview";
import { SkillMatrix } from "@/components/SkillMatrix";
import { ContactCTA } from "@/components/ContactCTA";
import { CertificationsGallery } from "@/components/CertificationsGallery";
import { PhotoStory } from "@/components/PhotoStory";
import { photos } from "@/content/photos";
import { SectionHeader } from "@/components/ui/primitives";

export default function Home() {
  const { resume } = getAssets();
  const featured = projects.filter((p) => p.featured);
  return (
    <>
      <Hero resume={Boolean(resume)} />
      <section aria-labelledby="story" className="border-y border-line bg-surface-2/50 py-20">
        <div className="wrap">
          <h2 id="story" className="h-section">A few moments along the way</h2>
          <p className="mt-3 mb-8 max-w-[60ch] text-muted">Hackathons, a DRDO visit, the motor behind the digital twin and ordinary working days. The photos change on their own; use the buttons, thumbnails or arrow keys to move yourself.</p>
          <PhotoStory photos={photos.filter((p) => p.section === "slideshow")} />
        </div>
      </section>
      <section aria-labelledby="featured" className="wrap py-24">
        <SectionHeader id="featured" title="Selected projects">
          Each one has a case study that separates what was built from what is only intended.
        </SectionHeader>
        <div className="relative">
          {featured.map((p) => <ProjectRow key={p.id} project={p} />)}
        </div>
        <p className="mt-6"><Link href="/projects" className="link-quiet">All projects and filters</Link></p>
      </section>
      <section aria-labelledby="journey-t" className="border-y border-line bg-surface/60 py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="journey-t" className="h-section">It started with a subject choice in Class 11</h2>
            <p className="mt-4 max-w-[48ch] text-muted">Computer Science, then Python, then a degree in data science, two internships in the same summer, two hackathons and an industrial digital twin. The journey page tells it in order.</p>
            <p className="mt-6"><Link href="/journey" className="btn btn-primary">Read the journey</Link></p>
          </div>
          <ol className="space-y-4 border-l border-line-strong pl-6">
            {["Class 11: chose Computer Science and began Python", "August 2023: joined The NorthCap University", "June to July 2025: IBM SkillsBuild and ProdeskIT internships", "October to November 2025: Technicia and Hack with Uttar Pradesh", "June to July 2026: CSIR-NPL digital twin"].map((t) => <li key={t}>{t}</li>)}
          </ol>
        </div>
      </section>
      <AnalyticsPreview />
      <ExperiencePreview />
      <section aria-labelledby="certs-t" className="wrap pb-24">
        <SectionHeader id="certs-t" title="Certifications">Seven verified certificates from IBM, Google and IIT Guwahati.</SectionHeader>
        <CertificationsGallery compact />
        <p className="mt-8"><Link href="/certifications" className="link-quiet">Filter and verify all certificates</Link></p>
      </section>
      <SkillMatrix compact />
      <ContactCTA resume={Boolean(resume)} />
    </>
  );
}
