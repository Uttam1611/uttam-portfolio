import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/primitives";
import { JourneySlides } from "@/components/JourneySlides";

export const metadata: Metadata = {
  title: "Journey",
  description: "A slide-by-slide story from choosing Computer Science in Class 11 to internships, hackathons and applied machine learning projects.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return (
    <>
      <PageIntro title="How I got here">
        One milestone per slide, from a Class 11 subject choice to the work I do now. Use Next and Previous, the flags, the arrow keys or swipe. Where a detail is not confirmed yet, the slide says so.
      </PageIntro>
      <div className="wrap pb-16"><JourneySlides /></div>
    </>
  );
}
