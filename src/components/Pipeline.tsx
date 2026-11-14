import type { ArchitectureStage } from "@/content/types";
import { stageEvidenceLabel } from "./ui/primitives";

export function Pipeline({ stages }: { stages: ArchitectureStage[] }) {
  return (
    <ol className="relative">
      {stages.map((s, i) => (
        <li key={s.label} className="relative grid grid-cols-[2rem_1fr] gap-4 pb-6 last:pb-0">
          <div className="relative flex justify-center">
            {i < stages.length - 1 && <span aria-hidden className="absolute top-8 bottom-[-0.25rem] w-px bg-line-strong" />}
            <span aria-hidden className="z-10 grid h-8 w-8 place-items-center rounded-full border border-line-strong bg-surface text-sm tabular-nums">{i + 1}</span>
          </div>
          <div className="panel px-4 py-3">
            <p className="font-medium">{s.label}</p>
            <p className="text-[0.95rem] text-muted">{s.detail}</p>
            <p className="mt-1.5 text-xs text-muted">{stageEvidenceLabel[s.evidence]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
