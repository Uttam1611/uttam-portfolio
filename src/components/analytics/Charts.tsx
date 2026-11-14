"use client";
import type { ReactNode } from "react";

export function ChartCard({ title, what, children, table }: { title: string; what: string; children: ReactNode; table?: ReactNode }) {
  return (
    <section className="panel p-6 sm:p-7" aria-label={title}>
      <h3 className="h-card">{title}</h3>
      <p className="mt-1.5 max-w-[60ch] text-sm text-muted">{what}</p>
      <div className="mt-6">{children}</div>
      {table && (
        <details className="mt-6 text-sm">
          <summary className="cursor-pointer text-muted hover:text-ink">View as table</summary>
          <div className="mt-3 overflow-x-auto">{table}</div>
        </details>
      )}
    </section>
  );
}

export interface BarItem {
  key: string;
  label: string;
  count: number;
  detail: string;
}

/** Horizontal bars. Each row is a button so chart segments are keyboard- and touch-friendly. */
export function BarList({ items, selected, onSelect, max, unit }: { items: BarItem[]; selected?: string | null; onSelect?: (key: string) => void; max: number; unit: string }) {
  return (
    <ul className="space-y-1">
      {items.map((it) => {
        const isSel = selected === it.key;
        const dim = selected && !isSel;
        const disabled = it.count === 0 || !onSelect;
        return (
          <li key={it.key}>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={onSelect ? isSel : undefined}
              onClick={() => onSelect?.(it.key)}
              className="has-tip relative grid min-h-11 w-full grid-cols-[minmax(0,9.5rem)_1fr_1.75rem] items-center gap-3 rounded-md px-1 text-left text-sm enabled:hover:bg-surface-2 disabled:cursor-default sm:grid-cols-[minmax(0,12rem)_1fr_1.75rem]"
            >
              <span className={`truncate ${it.count === 0 ? "text-muted" : ""} ${isSel ? "font-semibold" : ""}`}>{it.label}</span>
              <span className="h-3 rounded-[4px] bg-surface-2">
                {it.count > 0 && (
                  <span className="bar-fill block h-full rounded-[4px]" style={{ width: `${(it.count / max) * 100}%`, background: "var(--accent)", opacity: dim ? 0.4 : 1 }} />
                )}
              </span>
              <span className="text-right tabular-nums text-muted">{it.count}</span>
              <span className="tip bottom-full left-0 mb-0.5" role="tooltip">
                {it.count === 0 ? `No ${unit} recorded for ${it.label}.` : `${it.count} ${it.count === 1 ? unit : unit + "s"}: ${it.detail}`}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong px-5 py-8">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </div>
  );
}

export function SimpleTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full min-w-[20rem] border-collapse text-left">
      <thead><tr>{head.map((h) => <th key={h} scope="col" className="border-b border-line-strong py-2 pr-4 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border-b border-line py-2 pr-4 text-muted">{c}</td>)}</tr>)}</tbody>
    </table>
  );
}
