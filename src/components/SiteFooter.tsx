import Link from "next/link";
import { site } from "@/content/site";
import { formatMonth } from "@/lib/dates";
import { asOf } from "@/lib/metrics";

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="wrap flex flex-col gap-6 py-10 text-[0.95rem] text-muted sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-ink">{site.name}</p>
          <p>{site.location}</p>
          <p className="mt-3 max-w-[44ch]">Everything on this site is drawn from structured records. Anything not yet confirmed is marked as such.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link className="link-quiet" href="/projects">Work</Link>
          <Link className="link-quiet" href="/journey">Journey</Link>
          <Link className="link-quiet" href="/certifications">Certifications</Link>
          <Link className="link-quiet" href="/about">About</Link>
          <Link className="link-quiet" href="/experience">Experience</Link>
          <Link className="link-quiet" href="/analytics">Analytics</Link>
          <Link className="link-quiet" href="/contact">Contact</Link>
          <Link className="link-quiet" href="/resume">Resume</Link>
        </nav>
      </div>
      <div className="wrap pb-10 text-sm text-muted">Content last reviewed {formatMonth(asOf)}.</div>
    </footer>
  );
}
