import { supabase } from "@/lib/browserClient";
import {
  createVehicle,
  getActiveVehiclesWithEmployees,
  getVehicleOptions,
  getVehiclesBasics,
  removeVehicle,
  toCreateVanArgs,
  toUpdateVanArgs,
  updateVehicle,
} from "@/services/staff/vehicleService";
import { VehicleFormValues } from "@/zodSchemas/vehicleSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useVehicleBasics() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehiclesBasics(supabase),
  });
}

export function useActiveVehiclesWithEmployees() {
  return useQuery({
    queryKey: ["vehicles", "employees"],
    queryFn: () => getActiveVehiclesWithEmployees(supabase),
  });
}

export function useVehicleOptions() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicleOptions(supabase),
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: VehicleFormValues) => createVehicle(supabase, toCreateVanArgs(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, values }: { vehicleId: string; values: VehicleFormValues }) =>
      updateVehicle(supabase, toUpdateVanArgs(vehicleId, values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useRemoveVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => removeVehicle(supabase, vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
