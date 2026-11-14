import Link from "next/link";

const W = 640, H = 200, BEATS = 4, N = 480;
const g = (t: number, mu: number, s: number) => Math.exp(-((t - mu) ** 2) / (2 * s * s));
const amp = [0.94, 1, 0.9, 0.97];

const pts: string[] = [];
for (let i = 0; i <= N; i++) {
  const x = (i / N) * W;
  const u = (i / N) * BEATS;
  const b = Math.min(BEATS - 1, Math.floor(u));
  const t = u - b;
  const v = amp[b]! * (1.0 * g(t, 0.17, 0.055) + 0.38 * g(t, 0.42, 0.085)) - 0.12 * g(t, 0.31, 0.03);
  pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(H - 28 - v * 128).toFixed(1)}`);
}
const PATH = pts.join(" ");

export function PulseTrace() {
  return (
    <figure className="panel overflow-hidden p-5 sm:p-6">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Illustrative pulse waveform with four beats. Each beat has a sharp systolic peak followed by a smaller diastolic wave." className="block h-auto w-full">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)" strokeWidth="1" />
        ))}
        <path d={PATH} className="trace-line" fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        A synthetic pulse waveform, drawn for illustration. It is not a recording or a measurement. The real signal work is in{" "}
        <Link href="/projects/agni-pulse" className="link-quiet">Agni-Pulse</Link>.
      </figcaption>
    </figure>
  );
}
