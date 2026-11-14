import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAssets } from "@/lib/assets";
import { PageIntro } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Resume", robots: { index: false } };

export default function ResumePage() {
  const { resume } = getAssets();
  if (resume) redirect(resume);
  return (
    <>
      <PageIntro title="Resume">The resume file has not been published yet.</PageIntro>
      <div className="wrap">
        <p className="prose-body text-muted">
          In the meantime, the <Link href="/experience" className="link-quiet">experience page</Link> lists my education, internships and skills, and the <Link href="/contact" className="link-quiet">contact page</Link> has ways to reach me.
        </p>
      </div>
    </>
  );
}
