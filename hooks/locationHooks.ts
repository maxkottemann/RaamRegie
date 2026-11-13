import { supabase } from "@/lib/browserClient";
import {
  createLocation,
  getLocationsWithClient,
  getLocationWithClient,
  toCreateLocationArgs,
  toUpdateLocationArgs,
  updateLocation,
} from "@/services/locationService";
import { LocationFormValues } from "@/zodSchemas/locationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLocationsWithClient() {
  return useQuery({
    queryKey: ["locations", "with-client"],
    queryFn: () => getLocationsWithClient(supabase),
  });
}

export function useLocationWithClient(id: string | undefined) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: () => getLocationWithClient(supabase, id!),
    enabled: !!id,
  });
}

export function useUpdateLocation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LocationFormValues) =>
      updateLocation(supabase, id, toUpdateLocationArgs(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
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
