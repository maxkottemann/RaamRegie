"use client";

import { PageHeader } from "@/components/headers/pageHeader";
import ProjectListBasic from "@/components/lists/projects/basicProjectList";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/loadingState";
import Button from "@/components/ui/buttons/Button";
import { useModule } from "@/context/moduleContext";
import { useDebouncedValue } from "@/hooks/helpers/debouncedValue";
import { useProjectList } from "@/hooks/projectHooks/projectHooks";
import ModulePickerModal from "@/modules/components/modulePicker";
import { ModuleKey } from "@/modules/types/types";
import { ProjectFilters } from "@/services/projectServices/projectService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProjectOverViewPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ProjectFilters["status"]>();
  const [search, setSearch] = useState("");

  const [pickerOpen, setPickerOpen] = useState(false);

  const { companyModules, lockedModule, isSingle, available } = useModule();

  function goToNew(module: ModuleKey) {
    router.push(`/projects/new?module=${module}`);
  }

  function handleNewProject() {
    if (isSingle) return goToNew(available[0]); // locked domain or one module
    setPickerOpen(true); // several modules: choose
  }
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebouncedValue(search);

  const {
    data: projects,
    isPending,
    error,
  } = useProjectList({ search: debouncedSearch, status, page });

  if (isPending) return <LoadingState />;
  if (error || !projects) return <ErrorState />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <PageHeader title="Projecten" description="Bekijk al uw projecten" />
        <Button icon={Plus} onClick={handleNewProject} disabled={available.length === 0}>
          Nieuw project
        </Button>
      </div>
      <ModulePickerModal
        open={pickerOpen}
        available={available}
        onClose={() => setPickerOpen(false)}
        onSelect={(module) => {
          setPickerOpen(false);
          goToNew(module);
        }}
      />
      <ProjectListBasic
        page={page}
        pageSize={25}
        isFetching={isPending}
        onPageChange={setPage}
        projects={projects?.projects}
        onSelect={(val) => {
          router.push(`/projects/${val.id}`);
        }}
        total={projects.count}
      />
    </div>
  );
}
