import type { Experience } from "@/content/types";
import { degreeProgress, asOf } from "@/lib/metrics";
import { formatMonth, formatRange, monthIndex } from "@/lib/dates";
import type { YearMonth } from "@/content/types";

interface Props {
  experiences: Experience[];
  /** ids to dim (filtered out) */
  dimmed?: Set<string>;
  compact?: boolean;
}

export function TimelineChart({ experiences, dimmed, compact }: Props) {
  const deg = degreeProgress();
  const min = monthIndex(deg.start);
  const span = monthIndex(deg.end) - min + 1;
  const pos = (ym: YearMonth) => ((monthIndex(ym) - min) / span) * 100;
  const width = (s: YearMonth, e: YearMonth | null) => ((monthIndex(e ?? asOf) - monthIndex(s) + 1) / span) * 100;
  const years = [2024, 2025, 2026, 2027].map((y) => ({ y, left: pos(`${y}-01` as YearMonth) }));
  const nowLeft = pos(asOf) + 100 / span / 2;

  const rows = [
    { id: "degree", label: "B.Tech, NorthCap University", start: deg.start, end: deg.end as YearMonth | null, tip: `B.Tech, ${formatRange(deg.start, deg.end)}`, kind: "degree" as const },
    ...[...experiences].reverse().map((e) => ({ id: e.id, label: e.organisation, start: e.startDate, end: e.endDate, tip: `${e.role}, ${formatRange(e.startDate, e.endDate)}`, kind: e.category })),
  ];

  return (
    <div role="group" aria-label="Timeline of education and experience from August 2023 to May 2027">
      <div className={`relative ${compact ? "h-6" : "h-7"} sm:ml-[13rem]`} aria-hidden>
        {years.map((y) => (
          <span key={y.y} className="absolute top-0 text-xs text-muted" style={{ left: `${y.left}%` }}>
            <span className="absolute -left-px top-5 h-2 w-px bg-line-strong" />
            {y.y}
          </span>
        ))}
      </div>
      <ul className="relative">
        {rows.map((r) => {
          const left = pos(r.start);
          const w = width(r.start, r.end);
          const rightHalf = left > 30;
          const isDim = dimmed?.has(r.id);
          return (
            <li key={r.id} className={`grid items-center gap-1 py-1.5 transition-opacity sm:grid-cols-[13rem_1fr] sm:gap-0 ${isDim ? "opacity-30" : ""}`}>
              <span className="pr-3 text-sm text-muted sm:truncate" title={r.label}>{r.label}{r.kind !== "degree" && !compact && <span className="sm:hidden">, {formatRange(r.start, r.end)}</span>}</span>
              <div className="relative h-8 border-l border-line">
                <div className="has-tip absolute top-1 h-6" style={{ left: `${left}%`, width: `${w}%`, minWidth: 10 }} tabIndex={0} aria-label={r.tip}>
                  <span
                    className="block h-full rounded-[4px]"
                    style={{
                      background: r.kind === "degree" ? "var(--surface-2)" : r.kind === "Leadership" ? "var(--accent-soft)" : "var(--accent)",
                      border: r.kind === "degree" ? "1px solid var(--line-strong)" : r.kind === "Leadership" ? "1px solid var(--accent)" : "none",
                    }}
                  />
                  <span className={`tip bottom-full mb-1.5 ${rightHalf ? "right-0" : "left-0"}`}>{r.tip}</span>
                </div>
                {r.kind !== "degree" && !compact && (
                  <span className="pointer-events-none absolute hidden sm:block top-1 whitespace-nowrap text-xs leading-6 text-muted" style={left + w > 80 ? { left: `${left + 1}%`, color: "var(--text)" } : rightHalf ? { right: `${100 - left + 1}%` } : { left: `${left + w + 1}%` }}>
                    {formatRange(r.start, r.end).replace(" to ", " to ")}
                  </span>
                )}
                {r.kind === "degree" && (
                  <span aria-hidden className="absolute top-0 h-8 w-px bg-accent" style={{ left: `${nowLeft}%` }} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-muted sm:ml-[13rem]">Solid bars are internships and the outlined bar is the leadership role. The vertical mark is {formatMonth(asOf)}, when the content was last reviewed.</p>
    </div>
  );
}
