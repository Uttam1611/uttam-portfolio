"use client";
import { PageIntro } from "@/components/ui/primitives";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <PageIntro title="Something went wrong">This page failed to load. Trying again usually fixes it.</PageIntro>
      <div className="wrap"><button type="button" onClick={reset} className="btn btn-primary">Try again</button></div>
    </>
  );
}
