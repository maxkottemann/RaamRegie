import { supabase } from "@/lib/browserClient";
import { ModuleKey } from "@/modules/types/types";
import {
  createProject,
  getProject,
  getProjectCo2Data,
  getProjectsForList,
  getProjectVehicles,
  ProjectFilters,
} from "@/services/projectServices/projectService";
import { ProjectFormValues } from "@/zodSchemas/projectSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProjectList(filters: ProjectFilters) {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsForList(supabase, filters),
  });
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProject(supabase, projectId!),
    enabled: !!projectId,
  });
}

export function useProjectVehicles(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", "vehicles"],
    queryFn: () => getProjectVehicles(supabase, projectId!),
    enabled: !!projectId,
  });
}

export function useProjectCo2Data(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", "co2"],
    queryFn: () => getProjectCo2Data(supabase, projectId!),
    enabled: !!projectId,
  });
}
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ module, values }: { module: ModuleKey; values: ProjectFormValues }) =>
      createProject(supabase, module, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
