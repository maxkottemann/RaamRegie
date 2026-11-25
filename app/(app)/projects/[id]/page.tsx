// app/(app)/projects/[id]/page.tsx  (server)
import NotFoundState from "@/components/states/notFound";
import { getBrand } from "@/modules/brands";
import ProjectDetailView from "@/modules/components/projects/ProjectDetailView";
import { getModule } from "@/modules/registry";
import { getProjectServer } from "@/services/projectServices/projectServerSerivce";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, brand] = await Promise.all([getProjectServer(id), getBrand()]);

  // RLS already hides projects you may not see, so null here = not found or no access
  if (!project) return <NotFoundState title="Project niet gevonden" />;

  // on CurtainControl, only show curtain projects
  if (brand.module && project.project_module !== brand.module) {
    return <NotFoundState title="Project niet gevonden" />;
  }

  if (!getModule(project.project_module)) {
    return <NotFoundState title="Module niet beschikbaar" />;
  }

  return <ProjectDetailView projectId={project.id} module={project.project_module} />;
}
