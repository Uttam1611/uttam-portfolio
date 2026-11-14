import Link from "next/link";
import { PageIntro } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <>
      <PageIntro title="Page not found">That address does not match anything on this site.</PageIntro>
      <div className="wrap flex gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/projects" className="btn btn-ghost">Browse projects</Link>
      </div>
    </>
  );
}
