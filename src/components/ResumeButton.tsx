import Link from "next/link";
import { Download } from "lucide-react";
import { RESUME_PATH } from "@/lib/resume-path";

export function ResumeButton({ available, variant = "ghost" }: { available: boolean; variant?: "ghost" | "primary" }) {
  const cls = `btn ${variant === "primary" ? "btn-primary" : "btn-ghost"}`;
  if (available) {
    return (
      <a href={RESUME_PATH} download className={cls}>
        <Download size={17} aria-hidden /> Download resume
      </a>
    );
  }
  return (
    <Link href="/resume" className={cls}>
      <Download size={17} aria-hidden /> Resume
    </Link>
  );
}
