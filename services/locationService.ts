import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function getLocationsWithClient(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("locations")
    .select(
      "id, name, checkin_procedure, city, postal_code, street, number, clients(id, name, city, postal_code, street, number)",
    );

  if (error) throw error;
  return data;
}

export type LocationsWithClient = Awaited<ReturnType<typeof getLocationsWithClient>>;
export type LocationWithClient = LocationsWithClient[number];