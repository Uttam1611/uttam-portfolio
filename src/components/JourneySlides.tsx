"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BadgeCheck, Briefcase, ChevronLeft, ChevronRight, Flag, GraduationCap, Layers, Pause, Play, Rocket, School, Trophy, Users } from "lucide-react";
import { chapters, journey } from "@/content/journey";
import { getPhoto } from "@/content/photos";
import { getProject } from "@/content/projects";
import type { JourneyKind } from "@/content/types";

const kindMeta: Record<JourneyKind, { label: string; Icon: typeof Flag; color: string }> = {
  school: { label: "School", Icon: School, color: "var(--blue)" },
  university: { label: "University", Icon: GraduationCap, color: "var(--accent)" },
  project: { label: "Project", Icon: Layers, color: "var(--accent)" },
  internship: { label: "Internship", Icon: Briefcase, color: "var(--blue)" },
  hackathon: { label: "Hackathon", Icon: Trophy, color: "var(--ochre)" },
  certification: { label: "Certificate", Icon: BadgeCheck, color: "var(--accent)" },
  leadership: { label: "Leadership", Icon: Users, color: "var(--blue)" },
  present: { label: "Now", Icon: Rocket, color: "var(--accent)" },
};
const shortDate = (e: (typeof journey)[number]) => (e.date ? new Date(`${e.date}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }) : e.dateLabel.split(",")[0]!);

/** Slide-based journey: one milestone per slide with a date, a flag, an image and a short description. */
export function JourneySlides() {
  const n = journey.length;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [playing, setPlaying] = useState(false);
  const touch = useRef<number | null>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const e = journey[i]!;
  const meta = kindMeta[e.kind];
  const photo = e.photoId ? getPhoto(e.photoId) : undefined;
  const project = e.projectSlug ? getProject(e.projectSlug) : undefined;
  const chapter = chapters.find((c) => c.id === e.chapter)!;

  const goTo = useCallback((next: number) => { setDir(next >= i ? 1 : -1); setI(((next % n) + n) % n); }, [i, n]);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (i === n - 1) { const t = window.setTimeout(() => setPlaying(false), 0); return () => window.clearTimeout(t); }
    const t = window.setTimeout(() => goTo(i + 1), 7000);
    return () => window.clearTimeout(t);
  }, [playing, i, n, goTo]);

  useEffect(() => {
    const el = railRef.current?.children[i] as HTMLElement | undefined;
    const rail = railRef.current;
    if (el && rail) rail.scrollTo({ left: el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowRight") { ev.preventDefault(); goTo(Math.min(i + 1, n - 1)); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); goTo(Math.max(i - 1, 0)); }
    else if (ev.key === "Home") { ev.preventDefault(); goTo(0); }
    else if (ev.key === "End") { ev.preventDefault(); goTo(n - 1); }
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Career journey" tabIndex={0} onKeyDown={onKey} data-testid="journey-slides" className="outline-offset-8"
      onTouchStart={(t) => { touch.current = t.touches[0]?.clientX ?? null; }}
      onTouchEnd={(t) => { if (touch.current === null) return; const dx = (t.changedTouches[0]?.clientX ?? 0) - touch.current; if (Math.abs(dx) > 50) goTo(Math.min(Math.max(i + (dx < 0 ? 1 : -1), 0), n - 1)); touch.current = null; }}>
      {/* Flag rail */}
      <ul ref={railRef} className="relative flex gap-1 overflow-x-auto pb-4 pt-2" aria-label="Milestones">
        {journey.map((m, idx) => {
          const M = kindMeta[m.kind];
          const active = idx === i;
          return (
            <li key={m.id} className="relative shrink-0">
              <button type="button" onClick={() => goTo(idx)} aria-current={active} aria-label={`${m.dateLabel}: ${m.title}`} data-testid="journey-flag"
                className={`group flex w-24 flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition ${active ? "bg-accent-soft" : "hover:bg-surface-2"}`}>
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 transition" style={{ borderColor: M.color, background: active ? M.color : "var(--surface)", color: active ? "var(--bg)" : M.color }}>
                  <Flag size={15} aria-hidden />
                </span>
                <span className={`text-center text-xs leading-tight ${active ? "font-semibold text-ink" : "text-muted"}`}>{shortDate(m)}</span>
              </button>
              {idx < n - 1 && <span aria-hidden className="absolute left-[calc(50%+1.4rem)] right-[-0.35rem] top-[1.55rem] h-0.5 bg-line-strong" style={{ width: "calc(100% - 2.8rem)" }} />}
            </li>
          );
        })}
      </ul>

      {/* Slide */}
      <div className="surface-card overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={e.id} custom={dir} initial={{ opacity: 0, x: dir * 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -36 }} transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid md:grid-cols-[1.1fr_1fr]" aria-live="polite" data-testid="journey-slide">
            <div className="relative flex min-h-[16rem] items-center justify-center bg-surface-2 p-4 md:min-h-[26rem]">
              {photo ? (
                <Image src={photo.file} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width:768px) 560px, 100vw" className="max-h-[24rem] w-auto max-w-full rounded-xl object-contain shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]" />
              ) : (
                <div className="flex h-full min-h-[14rem] w-full flex-col items-center justify-center gap-4 rounded-xl text-center" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${meta.color} 16%, transparent), transparent)` }} aria-hidden>
                  <span className="grid h-24 w-24 place-items-center rounded-3xl" style={{ background: `color-mix(in srgb, ${meta.color} 18%, var(--surface))`, color: meta.color }}><meta.Icon size={44} /></span>
                  <span className="serif text-3xl">{shortDate(e)}</span>
                </div>
              )}
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-line"><Flag size={14} style={{ color: meta.color }} aria-hidden />{meta.label}</span>
            </div>
            <div className="flex flex-col p-6 sm:p-9">
              <p className="text-sm text-muted">{chapter.title}</p>
              <p className="mt-3 text-lg font-semibold" style={{ color: meta.color === "var(--ochre)" ? "var(--ochre)" : "var(--accent-strong)" }}>{e.dateLabel}</p>
              <h2 className="serif mt-2 text-[1.75rem] leading-tight sm:text-[2rem]">{e.title}</h2>
              <p className="mt-4 text-[1.0625rem]">{e.summary}</p>
              {e.detail && <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[0.95rem] text-muted marker:text-line-strong">{e.detail.map((d) => <li key={d}>{d}</li>)}</ul>}
              {e.status === "to-confirm" && <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted"><Award size={14} aria-hidden /> Some details are still being added.</p>}
              {project && <p className="mt-auto pt-6"><Link href={`/projects/${project.slug}`} className="link-quiet">Open {project.title}</Link></p>}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="h-1 bg-surface-2" aria-hidden><div className="h-full bg-accent transition-all duration-500" style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => goTo(i - 1)} disabled={i === 0} aria-label="Previous milestone"><ChevronLeft size={18} aria-hidden /> Previous</button>
          <button type="button" className="btn btn-primary" onClick={() => goTo(i + 1)} disabled={i === n - 1} aria-label="Next milestone">Next <ChevronRight size={18} aria-hidden /></button>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="tabular-nums" data-testid="journey-count">{i + 1} of {n}</span>
          <button type="button" className="btn btn-ghost" onClick={() => { if (!playing && i === n - 1) goTo(0); setPlaying((v) => !v); }} aria-pressed={playing}>
            {playing ? <><Pause size={16} aria-hidden /> Pause</> : <><Play size={16} aria-hidden /> Play the story</>}
          </button>
        </div>
      </div>
    </div>
  );
}
