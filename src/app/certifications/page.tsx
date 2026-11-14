import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/primitives";
import { CertificationsGallery } from "@/components/CertificationsGallery";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Seven certificates from IBM, Google and IIT Guwahati, each with a verification link.",
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return (
    <>
      <PageIntro title="Certifications">
        Seven courses and badges from IBM, Google and IIT Guwahati. Each links to the issuer&rsquo;s verification page, which is the source of truth for dates and the full skill list.
      </PageIntro>
      <div className="wrap pb-10"><CertificationsGallery /></div>
    </>
  );
}
