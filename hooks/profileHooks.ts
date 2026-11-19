import { supabase } from "@/lib/browserClient";
import { getCompanyProfileOptions } from "@/services/profileService";
import { useQuery } from "@tanstack/react-query";

export function useCompanyProfileOptions() {
  return useQuery({
    queryKey: ["profiles", "options"],
    queryFn: () => getCompanyProfileOptions(supabase),
  });
}
