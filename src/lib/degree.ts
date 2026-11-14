import { education } from "@/content/education";

const d = education[0]!;
const [sy, sm] = d.startDate!.split("-").map(Number) as [number, number];
const [ey, em] = d.endDate!.split("-").map(Number) as [number, number];

/** Programme runs from 1 Aug 2023 to the end of May 2027: four academic years. */
export const DEGREE_START = Date.UTC(sy, sm - 1, 1);
export const DEGREE_END = Date.UTC(ey, em, 1); // first day after the end month
export const DEGREE_TOTAL_LABEL = "Four years";

export function degreeProgressAt(now: number) {
  const span = DEGREE_END - DEGREE_START;
  const raw = (now - DEGREE_START) / span;
  const fraction = Math.min(1, Math.max(0, raw));
  const elapsedDays = Math.floor((Math.min(now, DEGREE_END) - DEGREE_START) / 86400000);
  const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
  const elapsedMonths = Math.min(totalMonths, Math.max(0, Math.floor(fraction * totalMonths)));
  const years = Math.floor(elapsedMonths / 12);
  const months = elapsedMonths % 12;
  const parts = [years ? `${years} ${years === 1 ? "year" : "years"}` : "", months ? `${months} ${months === 1 ? "month" : "months"}` : ""].filter(Boolean);
  return {
    fraction,
    percent: Math.round(fraction * 100),
    elapsedLabel: parts.join(" ") || "Less than a month",
    status: raw < 0 ? "not-started" : raw >= 1 ? "complete" : "in-progress",
    elapsedDays: Math.max(0, elapsedDays),
  } as const;
}
