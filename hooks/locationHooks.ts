import { supabase } from "@/lib/browserClient";
import {
  createLocation,
  getClientLocations,
  getLocationItemsCount,
  getLocationOptionsForPlanning,
  getLocationRoomCount,
  getLocationStoryCount,
  getLocationsWithClient,
  getLocationWithClient,
  toCreateLocationArgs,
  toUpdateLocationArgs,
  updateLocation,
} from "@/services/locationService";
import { LocationFormValues } from "@/zodSchemas/locationSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
///selects
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

export function useClientLocations(id: string | undefined) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: () => getClientLocations(supabase, id!),
    enabled: !!id,
  });
}

///counts

export function useLocationStoryCount(id: string | undefined) {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => getLocationStoryCount(supabase, id!),
    enabled: !!id,
  });
}

export function useLocationRoomCount(id: string | undefined) {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => getLocationRoomCount(supabase, id!),
    enabled: !!id,
  });
}

export function useLocationItemCount(id: string | undefined) {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => getLocationItemsCount(supabase, id!),
    enabled: !!id,
  });
}

export function useLocationOptionsForPlanning() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocationOptionsForPlanning(supabase),
  });
}

///mutations

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
