import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { getPhoto } from "@/content/photos";
import { ProfileLinks } from "./ProfileLinks";
import { ResumeButton } from "./ResumeButton";

export function Hero({ resume }: { resume: boolean }) {
  const portrait = getPhoto("main-profile")!;
  return (
    <section aria-labelledby="hero-title" className="wrap grid items-center gap-12 pt-12 pb-20 sm:pt-20 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
      <div className="order-2 lg:order-1">
        <p className="flex items-center gap-2 text-muted">
          <MapPin size={16} aria-hidden /> {site.location}
        </p>
        <h1 id="hero-title" className="display mt-5">
          Building machine learning systems I can explain and defend.
        </h1>
        <p className="lede mt-7 max-w-[34ch] text-muted">
          I&rsquo;m Uttam Singh, a Computer Science student specialising in Data Science. I work on signal processing, computer vision and the data pipelines behind them.
        </p>
        <p className="mt-4 max-w-[58ch] text-[0.95rem] text-muted">{site.academicStatus}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/projects" className="btn btn-primary">
            See the work <ArrowRight size={17} aria-hidden />
          </Link>
          <Link href="/journey" className="btn btn-ghost">Read the journey</Link>
          <ResumeButton available={resume} />
        </div>
        <div className="mt-6"><ProfileLinks only={["linkedin", "github"]} /></div>
      </div>

      <figure className="order-1 mx-auto w-full max-w-[21rem] lg:order-2 lg:max-w-[24rem] lg:justify-self-end">
        <div className="rounded-[28px] bg-accent-soft p-3 ring-1 ring-line sm:p-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-surface-2">
            <Image src={portrait.file} alt={portrait.alt} fill priority sizes="(min-width: 1024px) 384px, 336px" className="object-cover object-[50%_20%]" />
          </div>
        </div>
        <figcaption className="mt-4 text-center text-sm text-muted">Uttam Singh · B.Tech CSE (Data Science), The NorthCap University</figcaption>
      </figure>
    </section>
  );
}
