import { supabase } from "@/lib/browserClient";
import { getProjectsForList } from "@/services/projectServices/projectService";
import { useQuery } from "@tanstack/react-query";

export function useProjectList(page = 0, pageSize = 25) {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsForList(supabase, page, pageSize),
  });
}
