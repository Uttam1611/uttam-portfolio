import { Mail } from "lucide-react";
import { Github, Linkedin } from "./ui/BrandIcons";
import { site } from "@/content/site";

type Item = { key: "github" | "linkedin" | "email"; label: string; href: string | null; icon: React.ReactNode };

export function profileItems(): Item[] {
  const { github, linkedin, email } = site.links;
  return [
    { key: "github", label: "GitHub", href: github, icon: <Github size={18} aria-hidden /> },
    { key: "linkedin", label: "LinkedIn", href: linkedin, icon: <Linkedin size={18} aria-hidden /> },
    { key: "email", label: "Email", href: email ? `mailto:${email}` : null, icon: <Mail size={18} aria-hidden /> },
  ];
}

/** Links render only when the owner has supplied them. Missing ones show as unavailable, never as dead links. */
export function ProfileLinks({ only }: { only?: Item["key"][] }) {
  const items = profileItems().filter((i) => !only || only.includes(i.key));
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((i) =>
        i.href ? (
          <li key={i.key}>
            <a href={i.href} {...(i.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-ink">
              {i.icon}
              <span className="link-quiet">{i.label}</span>
            </a>
          </li>
        ) : (
          <li key={i.key} className="inline-flex min-h-11 items-center gap-2 text-muted" title={`${i.label} link has not been added yet`}>
            {i.icon}
            <span>{i.label}</span>
            <span className="text-xs">(link not added yet)</span>
          </li>
        ),
      )}
    </ul>
  );
}
