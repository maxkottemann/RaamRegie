import { supabase } from "@/lib/browserClient";
import { getProjectsForList, ProjectFilters } from "@/services/projectServices/projectService";
import { useQuery } from "@tanstack/react-query";

export function useProjectList(filters: ProjectFilters) {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsForList(supabase, filters),
  });
}
