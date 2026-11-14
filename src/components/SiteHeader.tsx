"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/projects", label: "Work" },
  { href: "/journey", label: "Journey" },
  { href: "/experience", label: "Experience" },
  { href: "/analytics", label: "Analytics" },
  { href: "/about", label: "About" },
];
const mobileExtra = [
  { href: "/certifications", label: "Certifications" },
  { href: "/contact", label: "Contact" },
  { href: "/resume", label: "Resume" },
];

export function SiteHeader({ hasResume }: { hasResume: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/92 backdrop-blur-sm">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <Link href="/" className="serif text-[1.35rem] tracking-tight" aria-label="Uttam Singh, home">Uttam Singh</Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative rounded-md px-3 py-2 text-[0.95rem] transition-colors ${isActive(n.href) ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {n.label}
              {isActive(n.href) && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-px bg-accent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/resume" className="btn btn-ghost hidden lg:inline-flex" {...(hasResume ? {} : { "aria-label": "Resume (not yet available)" })}>
            Resume
          </Link>
          <Link href="/contact" className="btn btn-primary hidden sm:inline-flex">Get in touch</Link>
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg border border-line text-muted hover:text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="border-t border-line bg-bg md:hidden"
          >
            <ul className="wrap py-2">
              {[...nav, ...mobileExtra].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} onClick={() => setOpen(false)} aria-current={isActive(n.href) ? "page" : undefined} className={`flex min-h-12 items-center border-b border-line/60 text-lg ${isActive(n.href) ? "text-ink" : "text-muted"}`}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
