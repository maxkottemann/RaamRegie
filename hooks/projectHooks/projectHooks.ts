import { supabase } from "@/lib/browserClient";
import { ModuleKey } from "@/modules/types/types";
import {
  createProject,
  getProjectsForList,
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
