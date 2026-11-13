import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/types/database.types";
import { LocationFormValues } from "@/zodSchemas/locationSchema";

type CreateLocationArgs = Database["public"]["Functions"]["create_location"]["Args"];

export async function getLocationsWithClient(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, name, checkin_procedure, city, postal_code, street, number,internal_id,external_id,clients(id, name, city, postal_code, street, number)",
    );

  if (error) throw error;
  return data;
}

export async function getLocationWithClient(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, name, checkin_procedure, city, postal_code, street, number,internal_id,external_id,clients(id, name, city, postal_code, street, number)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateLocation(
  supabase: SupabaseClient<Database>,
  id: string,
  values: TablesUpdate<"locations">,
) {
  const { data, error } = await supabase
    .from("locations")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function toCreateLocationArgs(values: LocationFormValues): CreateLocationArgs {
  return {
    p_client_id: values.client_id,
    p_name: values.name,
    p_street: values.street,
    p_number: values.number,
    p_postal_code: values.postal_code,
    p_city: values.city,
    p_checkin_procedure: values.checkin_procedure ?? false,
    p_external_id: values.external_id ?? undefined,
    p_internal_id: values.internal_id ?? undefined,
  };
}

export function toUpdateLocationArgs(values: LocationFormValues): TablesUpdate<"locations"> {
  return {
    client_id: values.client_id,
    name: values.name,
    street: values.street,
    number: values.number,
    postal_code: values.postal_code,
    city: values.city,
    checkin_procedure: values.checkin_procedure,
    internal_id: values.internal_id,
    external_id: values.external_id,
  };
}

export async function createLocation(supabase: SupabaseClient<Database>, args: CreateLocationArgs) {
  const { data, error } = await supabase.rpc("create_location", args);

  if (error) throw error;
  return data;
}

export type LocationsWithClient = Awaited<ReturnType<typeof getLocationsWithClient>>;
export type LocationWithClientListItem = Awaited<ReturnType<typeof getLocationsWithClient>>[number];
export type LocationDetail = Awaited<ReturnType<typeof getLocationWithClient>>;
