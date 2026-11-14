import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { site } from "@/content/site";
import { getAssets } from "@/lib/assets";
import { profileItems } from "@/components/ProfileLinks";
import { ResumeButton } from "@/components/ResumeButton";
import { PageIntro } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Contact",
  description: "Email, LinkedIn, GitHub and resume for Uttam Singh, open to AI/ML engineering and data science roles.",
  alternates: { canonical: "/contact" },
};

const icons = { github: Github, linkedin: Linkedin, email: Mail };

export default function ContactPage() {
  const { resume } = getAssets();
  const items = profileItems();
  const any = items.some((i) => i.href);
  return (
    <>
      <PageIntro title="Contact">
        The quickest way to reach me is by email or LinkedIn. I am looking for AI/ML engineering, machine learning engineering and data science roles from mid 2027.
      </PageIntro>
      <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <ul className="min-w-0 divide-y divide-line border-y border-line">
          {items.map((i) => {
            const Icon = icons[i.key];
            return (
              <li key={i.key}>
                {i.href ? (
                  <a href={i.href} {...(i.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="group flex min-h-16 items-center gap-4 py-4 hover:text-accent">
                    <Icon size={20} aria-hidden className="text-muted group-hover:text-accent" />
                    <span className="shrink-0 text-lg font-medium">{i.label}</span>
                    <span className="ml-auto min-w-0 truncate text-sm text-muted">{i.key === "email" ? site.links.email : i.href.replace(/^https?:\/\//, "")}</span>
                  </a>
                ) : (
                  <div className="flex min-h-16 items-center gap-4 py-4 text-muted">
                    <Icon size={20} aria-hidden />
                    <span className="text-lg">{i.label}</span>
                    <span className="ml-auto text-sm">Not published yet</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div>
          <p className="flex items-center gap-2 text-muted"><MapPin size={16} aria-hidden /> {site.location}</p>
          <p className="prose-body mt-4 text-muted">
            There is no contact form on purpose. This site does not collect visitor data, so messages go straight to my inbox.
          </p>
          {!any && <p className="mt-4 text-sm text-muted">Contact links will appear here once they are published.</p>}
          <div className="mt-8"><ResumeButton available={Boolean(resume)} variant="primary" /></div>
        </div>
      </div>
    </>
  );
}
