import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { collections } from "@/content/collections";
import { PageIntro } from "@/components/ui/primitives";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Work",
  description: "Machine learning, computer vision, signal processing and industrial AI projects by Uttam Singh, each with a case study that states what is built, what is intended and what is not yet measured.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro title="Work">
        {projects.length} case studies and three groups of smaller repositories. Statuses reflect the actual state of the work, and results appear only where they were measured.
      </PageIntro>
      <div className="wrap"><ProjectsExplorer projects={projects} collections={collections} /></div>
    </>
  );
}
