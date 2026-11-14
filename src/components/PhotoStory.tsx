"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Photo } from "@/content/types";

const INTERVAL = 6000;

/**
 * Photo slideshow. Changes slide automatically (pauses on hover, focus, touch or when the tab is hidden, and has a
 * Pause button). Previous and Next buttons, arrow keys, Home and End, swipe and thumbnails all work.
 * The current photo and its context are highlighted together.
 */
export function PhotoStory({ photos }: { photos: Photo[] }) {
  const n = photos.length;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const touch = useRef<number | null>(null);
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  const p = photos[i]!;
  const running = playing && !hold;

  useEffect(() => {
    if (!running) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, i, go]);

  useEffect(() => {
    const onVis = () => setHold(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "Home") { e.preventDefault(); setI(0); }
    else if (e.key === "End") { e.preventDefault(); setI(n - 1); }
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Photo story"
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onTouchStart={(e) => { setHold(true); touch.current = e.touches[0]?.clientX ?? null; }}
      onTouchEnd={(e) => {
        setHold(false);
        if (touch.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
      className="surface-card overflow-hidden outline-offset-4"
      data-testid="photo-story"
    >
      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        <div className="relative flex min-h-[18rem] items-center justify-center bg-surface-2 p-3 sm:min-h-[26rem] lg:min-h-[30rem]">
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex h-full w-full items-center justify-center">
              <Image src={p.file} alt={p.alt} width={p.width} height={p.height} sizes="(min-width: 1024px) 720px, 100vw" className="max-h-[28rem] w-auto max-w-full rounded-xl object-contain shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]" priority={i === 0} />
            </motion.div>
          </AnimatePresence>
          <button type="button" className="btn btn-ghost absolute left-3 top-1/2 -translate-y-1/2 !px-3 bg-surface/90" onClick={() => go(-1)} aria-label="Previous photo"><ChevronLeft size={18} aria-hidden /></button>
          <button type="button" className="btn btn-ghost absolute right-3 top-1/2 -translate-y-1/2 !px-3 bg-surface/90" onClick={() => go(1)} aria-label="Next photo"><ChevronRight size={18} aria-hidden /></button>
        </div>
        <div className="flex flex-col justify-between gap-6 border-t border-line p-6 sm:p-8 lg:border-l lg:border-t-0" aria-live="polite">
          <div key={p.id}>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent-strong">Now showing</p>
            <h3 className="serif mt-4 text-2xl leading-snug sm:text-[1.75rem]">{p.title}</h3>
            <p className="mt-1 text-sm text-muted">{p.event}{p.dateLabel ? ` · ${p.dateLabel}` : ""}</p>
            <p className="mt-4" data-testid="photo-caption">{p.caption}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => setPlaying((v) => !v)} aria-pressed={!playing}>
              {playing ? <><Pause size={16} aria-hidden /> Pause</> : <><Play size={16} aria-hidden /> Play</>}
            </button>
            <span className="text-sm tabular-nums text-muted">{i + 1} of {n}</span>
          </div>
        </div>
      </div>

      <div className="h-1 bg-surface-2" aria-hidden>
        <div key={`${p.id}-${running}`} className="h-full bg-accent" style={running ? { animation: `slideprogress ${INTERVAL}ms linear forwards` } : { width: `${((i + 1) / n) * 100}%` }} />
      </div>
      <ul className="flex gap-2 overflow-x-auto p-3" aria-label="Choose a photo">
        {photos.map((ph, idx) => (
          <li key={ph.id} className="shrink-0">
            <button type="button" onClick={() => setI(idx)} aria-label={`${ph.title}${idx === i ? " (current)" : ""}`} aria-current={idx === i} className={`block h-16 w-16 overflow-hidden rounded-lg ring-2 transition ${idx === i ? "ring-accent" : "opacity-60 ring-transparent hover:opacity-100"}`}>
              <Image src={ph.file} alt="" width={64} height={64} className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
