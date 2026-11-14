import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { getPhoto } from "@/content/photos";
import { PageIntro } from "@/components/ui/primitives";
import { ProfileLinks } from "@/components/ProfileLinks";

export const metadata: Metadata = {
  title: "About",
  description: "About Uttam Singh.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const portrait = getPhoto("main-profile")!;
  return (
    <>
      <PageIntro title="About">A student engineer who likes systems he can test.</PageIntro>
      <section className="wrap grid gap-12 pb-20 lg:grid-cols-[1fr_20rem]">
        <div className="prose-body">
          <p className="lede">{site.intro}</p>
          <p className="mt-6 text-muted">{site.academicStatus}</p>
          <p className="mt-4 text-muted">My projects so far cover signal processing, computer vision, retrieval-augmented agents and backend services. I am looking for AI/ML engineer, machine learning engineer and data scientist roles, and I am also a fit for data and backend engineering work.</p>
          <p className="mt-4 text-muted">Languages: {site.languages.join(", ")}.</p>
          <div className="mt-6"><ProfileLinks /></div>
          <p className="mt-8"><Link href="/journey" className="link-quiet">The longer story, from Class 11</Link></p>
        </div>
        <div className="photo-frame h-fit">
          <Image src={portrait.file} alt={portrait.alt} width={portrait.width} height={portrait.height} sizes="320px" className="h-auto w-full" />
        </div>
      </section>
    </>
  );
}
