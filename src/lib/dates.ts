import type { YearMonth } from "@/content/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthIndex(ym: YearMonth): number {
  const [y, m] = ym.split("-").map(Number) as [number, number];
  return y * 12 + (m - 1);
}

export function asYearMonth(isoDate: string): YearMonth {
  return isoDate.slice(0, 7) as YearMonth;
}

export function formatMonth(ym: YearMonth): string {
  const [y, m] = ym.split("-").map(Number) as [number, number];
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatRange(start: YearMonth | null, end: YearMonth | null): string {
  if (!start && !end) return "Dates not recorded";
  if (!start && end) return `Until ${formatMonth(end)}`;
  return `${formatMonth(start as YearMonth)} to ${end ? formatMonth(end) : "present"}`;
}

/** Inclusive calendar months. A null end means ongoing, resolved against `asOf`. */
export function monthsInclusive(start: YearMonth, end: YearMonth | null, asOf: YearMonth): number {
  return monthIndex(end ?? asOf) - monthIndex(start) + 1;
}

/** Calendar months covered by the union of ranges, so overlaps are counted once. */
export function unionMonths(ranges: { start: YearMonth; end: YearMonth | null }[], asOf: YearMonth): number {
  const covered = new Set<number>();
  for (const r of ranges) {
    for (let i = monthIndex(r.start); i <= monthIndex(r.end ?? asOf); i++) covered.add(i);
  }
  return covered.size;
}

export function formatDuration(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const years = `${y} ${y === 1 ? "year" : "years"}`;
  return m === 0 ? years : `${years} ${m} ${m === 1 ? "month" : "months"}`;
}
