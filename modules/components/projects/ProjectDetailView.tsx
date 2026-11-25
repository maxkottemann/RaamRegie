"use client";

import LoadingState from "@/components/states/loadingState";
import { useProject, useProjectVehicles } from "@/hooks/projectHooks/projectHooks";
import { getModule } from "@/modules/registry";
import { ModuleKey } from "@/modules/types/types";
import ProjectDetailPageHeader from "./_components/detailsPage/projectHeader";
import ErrorState from "@/components/states/ErrorState";
import ProjectVehicleCard from "./_components/detailsPage/projectVehicleCard";
import ProjectCo2ImpactCard from "./_components/detailsPage/projectCo2ImpactCard";

export default function ProjectDetailView({
  projectId,
  module,
}: {
  projectId: string;
  module: ModuleKey;
}) {
  const { data: project, isPending, error } = useProject(projectId);

  const ModuleDetail = getModule(module)!.ProjectDetailPage;

  if (isPending) return <LoadingState />;
  if (error || !project) return <ErrorState />;

  return (
    <div className="flex flex-col gap-6">
      <ProjectDetailPageHeader project={project} /> {/* shared */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <ModuleDetail projectId={projectId} /> {/* module: the objects */}
        </div>
        <div className="flex flex-col gap-4">
          <ProjectVehicleCard projectId={projectId} />
          <ProjectCo2ImpactCard projectId={projectId} />

          {/*<ProjectLocationCard project={project} /> {/* shared: snapshot */}
          {/*} <ProjectProgressCard projectId={projectId} /> {/* shared: done / planned */}
        </div>
      </div>
    </div>
  );
}
