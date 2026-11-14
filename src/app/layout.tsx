import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { site } from "@/content/site";
import { getAssets } from "@/lib/assets";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionRoot } from "@/components/MotionRoot";

const description =
  "Portfolio of Uttam Singh, a Computer Science and Engineering student specialising in Data Science. Machine learning, computer vision and applied AI projects, with an evidence-based analytics view.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: AI/ML engineer and data science student`, template: `%s | ${site.name}` },
  description,
  openGraph: { type: "website", siteName: site.name, title: `${site.name}: AI/ML engineer and data science student`, description, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: site.name, description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1020" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { resume } = getAssets();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "AI/ML engineer and data science student",
    address: { "@type": "PostalAddress", addressLocality: "Gurugram", addressRegion: "Haryana", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "The NorthCap University" },
    sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
  };
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <MotionRoot>
          <SiteHeader hasResume={Boolean(resume)} />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionRoot>
      </body>
    </html>
  );
}
