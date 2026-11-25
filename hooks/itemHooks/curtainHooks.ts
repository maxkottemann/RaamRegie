import { supabase } from "@/lib/browserClient";
import {
  getCurtainMaterialsOptions,
  getCurtainTypesOptions,
} from "@/services/itemServices/curtainService";
import { useQuery } from "@tanstack/react-query";

export function useCurtainTypeOptions() {
  return useQuery({
    queryKey: ["curtain_types", { active: true }],
    queryFn: () => getCurtainTypesOptions(supabase),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurtainMaterialOptions() {
  return useQuery({
    queryKey: ["curtain_materials", { active: true }],
    queryFn: () => getCurtainMaterialsOptions(supabase),
    staleTime: 5 * 60 * 1000,
  });
}
