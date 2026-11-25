import { Database, TablesInsert } from "@/types/database.types";
import { VehicleFormValues } from "@/zodSchemas/vehicleSchema";
import { SupabaseClient } from "@supabase/supabase-js";

type CreateVehicleArgs = Database["public"]["Functions"]["create_vehicle"]["Args"];
type UpdateVehicleArgs = Database["public"]["Functions"]["update_vehicle"]["Args"];

export async function getVehiclesBasics(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("id,name,license_plate,city,postal_code,street,number,co2,is_active,co2_old")
    .is("archived_at", null);

  if (error) throw error;
  return data;
}

export async function getActiveVehiclesWithEmployees(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "id,name,license_plate,city,postal_code,street,number,co2,co2_old,vehicle_default_employees(employees!inner(id,name))",
    )
    .is("archived_at", null)
    .eq("is_active", true)
    .is("vehicle_default_employees.employees.archived_at", null)
    .eq("vehicle_default_employees.employees.is_active", true);

  if (error) throw error;

  return data.map(({ vehicle_default_employees, ...vehicle }) => ({
    ...vehicle,
    employees: vehicle_default_employees
      .map((link) => link.employees)
      .filter((e): e is NonNullable<typeof e> => e != null),
  }));
}

export async function getVehicleOptions(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("id,name,license_plate")
    .is("archived_at", null);

  if (error) throw error;

  return data;
}
export function toCreateVanArgs(values: VehicleFormValues): CreateVehicleArgs {
  return {
    p_name: values.name,
    p_license_plate: values.license_plate ?? undefined,
    p_street: values.street ?? undefined,
    p_postal_code: values.postal_code ?? undefined,
    p_city: values.city ?? undefined,
    p_number: values.number ?? undefined,
    p_co2: values.co2 ?? undefined,
    p_co2_old: values.co2_old ?? undefined,
  };
}

export function toUpdateVanArgs(vehicleId: string, values: VehicleFormValues): UpdateVehicleArgs {
  return { p_vehicle_id: vehicleId, ...toCreateVanArgs(values) };
}

export async function createVehicle(supabase: SupabaseClient<Database>, args: CreateVehicleArgs) {
  const { data, error } = await supabase.rpc("create_vehicle", args);

  if (error) throw error;
  return data;
}

export async function updateVehicle(supabase: SupabaseClient<Database>, args: UpdateVehicleArgs) {
  const { data, error } = await supabase.rpc("update_vehicle", args);

  if (error) throw error;
  return data;
}

export async function removeVehicle(supabase: SupabaseClient<Database>, vehicleId: string) {
  const { data, error } = await supabase.rpc("remove_vehicle", {
    p_vehicle_id: vehicleId,
  });

  if (error) throw error;

  return data;
}

export type VehicleBasics = Awaited<ReturnType<typeof getVehiclesBasics>>;
export type VehicleBasic = VehicleBasics[number];

export type VehicleOptions = Awaited<ReturnType<typeof getVehicleOptions>>;
export type VehicleOption = VehicleOptions[number];
