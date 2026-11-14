import { site } from "@/content/site";
import { ProfileLinks } from "./ProfileLinks";
import { ResumeButton } from "./ResumeButton";

export function ContactCTA({ resume }: { resume: boolean }) {
  return (
    <section aria-labelledby="cta" className="wrap">
      <div className="panel p-8 sm:p-12">
        <h2 id="cta" className="h-section max-w-[22ch]">Open to AI/ML and data science roles</h2>
        <p className="mt-4 max-w-[56ch] text-muted">
          If you are hiring for machine learning, data science or applied AI work, I would like to hear about it. I am based in {site.location.split(",")[0]} and graduate in May 2027.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          <ResumeButton available={resume} variant="primary" />
          <ProfileLinks />
        </div>
      </div>
    </section>
  );
}
