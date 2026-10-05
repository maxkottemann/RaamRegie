import { supabase } from "@/lib/browserClient";
import {
  createLocation,
  getLocationsWithClient,
  toCreateLocationArgs,
} from "@/services/locationService";
import { LocationFormValues } from "@/zodSchemas/locationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLocationsWithClient() {
  return useQuery({
    queryKey: ["locations", "with-client"],
    queryFn: () => getLocationsWithClient(supabase),
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LocationFormValues) =>
      createLocation(supabase, toCreateLocationArgs(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
