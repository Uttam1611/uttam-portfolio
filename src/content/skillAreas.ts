/**
 * Dated evidence behind each technical area. Only items with a verifiable date appear.
 * Sources: certificates, internship dates, hackathon dates and first/last commit months in the repositories.
 * Project dates marked "repo" are repository-commit months, which can be later than when the work began.
 */
export type EvidenceKind = "project" | "internship" | "academic" | "learning";
export interface AreaEvidence { date: `${number}-${number}`; kind: EvidenceKind; label: string; basis: string }
export interface SkillArea { id: string; name: string; evidence: AreaEvidence[] }

export const skillAreas: SkillArea[] = [
  { id: "python", name: "Python", evidence: [
    { date: "2025-03", kind: "academic", label: "Crash Course on Python (Google)", basis: "certificate" },
    { date: "2025-04", kind: "academic", label: "Summer Analytics 2025 (IIT Guwahati)", basis: "certificate" },
    { date: "2025-06", kind: "internship", label: "IBM SkillsBuild and ProdeskIT internships", basis: "internship dates" },
    { date: "2025-07", kind: "academic", label: "AI Fundamentals (IBM)", basis: "badge" },
  ] },
  { id: "sql", name: "SQL and PostgreSQL", evidence: [
    { date: "2025-06", kind: "internship", label: "ProdeskIT: schema and migrations", basis: "internship dates" },
    { date: "2026-06", kind: "internship", label: "CSIR-NPL: telemetry persistence design", basis: "internship dates" },
    { date: "2026-10", kind: "project", label: "Agni-Pulse: migrations and row-level security", basis: "repo" },
  ] },
  { id: "ml", name: "Machine learning", evidence: [
    { date: "2025-06", kind: "internship", label: "IBM SkillsBuild: salary regression", basis: "internship dates" },
    { date: "2025-08", kind: "academic", label: "Machine Learning with Python (IBM)", basis: "certificate" },
    { date: "2025-07", kind: "project", label: "employee-salary-prediction notebook", basis: "repo" },
  ] },
  { id: "dl", name: "Deep learning", evidence: [
    { date: "2025-08", kind: "academic", label: "Intro to Deep Learning with Keras (IBM)", basis: "certificate" },
    { date: "2025-09", kind: "academic", label: "Deep Learning with Keras and TensorFlow; Neural Networks and PyTorch (IBM)", basis: "certificates" },
    { date: "2025-09", kind: "project", label: "waste-classifier-tl-ft", basis: "repo" },
  ] },
  { id: "cv", name: "Computer vision", evidence: [
    { date: "2025-06", kind: "project", label: "Pose2Post: NIMA aesthetic scoring", basis: "repo" },
    { date: "2026-03", kind: "project", label: "Aircraft damage classification and BLIP captioning", basis: "repo" },
  ] },
  { id: "backend", name: "Backend engineering", evidence: [
    { date: "2025-06", kind: "internship", label: "ProdeskIT: Django REST, JWT, RBAC", basis: "internship dates" },
    { date: "2025-07", kind: "project", label: "Django practice applications", basis: "repo" },
    { date: "2026-10", kind: "project", label: "Agni-Pulse: FastAPI service", basis: "repo" },
  ] },
  { id: "data-eng", name: "Data engineering", evidence: [
    { date: "2026-06", kind: "internship", label: "CSIR-NPL: telemetry and inference persistence", basis: "internship dates" },
    { date: "2026-10", kind: "project", label: "Agni-Pulse: camera-to-database pipeline", basis: "repo" },
  ] },
  { id: "genai", name: "Generative AI and LLMs", evidence: [
    { date: "2026-09", kind: "project", label: "Customer support ticket agent (RAG, LangGraph)", basis: "repo" },
  ] },
  { id: "signal", name: "Signal processing", evidence: [
    { date: "2026-10", kind: "project", label: "Agni-Pulse: filtering, beat detection, HRV", basis: "repo" },
  ] },
];

export const evidenceKindLabel: Record<EvidenceKind, string> = {
  project: "Used in projects",
  internship: "Applied during internship",
  academic: "Academic exposure",
  learning: "Currently learning",
};
