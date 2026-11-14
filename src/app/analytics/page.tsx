import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnalyticsBoard } from "@/components/analytics/AnalyticsBoard";
import { formatMonth } from "@/lib/dates";
import { asOf } from "@/lib/metrics";

export const metadata: Metadata = {
  title: "Portfolio analytics",
  description: "An interactive view of Uttam Singh's projects, experience, skills and education. Every figure is derived from the portfolio's own records.",
  alternates: { canonical: "/analytics" },
};

export default function AnalyticsPage() {
  return (
    <>
      <div className="wrap pt-14 pb-10 sm:pt-20">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden /> Back to portfolio</Link>
        <h1 className="serif mt-4 text-[clamp(2.4rem,5.5vw,3.9rem)] leading-[1.05] tracking-[-0.02em]">What the evidence shows</h1>
        <p className="mt-5 max-w-[60ch] text-lg text-muted">
          A look at progress, role evidence, milestones and skills, built only from dated and linked records. Nothing here is a score or a percentage of skill. Data last reviewed {formatMonth(asOf)}.
        </p>
      </div>
      <div className="wrap"><AnalyticsBoard /></div>
    </>
  );
}
