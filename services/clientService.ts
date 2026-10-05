import { Database } from "@/types/database.types";
import { ClientFormValues } from "@/zodSchemas/clientSchema";
import { SupabaseClient } from "@supabase/supabase-js";

type CreateClientArgs = Database["public"]["Functions"]["create_client"]["Args"];

export async function getClientOptions(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("clients")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getClients(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("clients").select("*");

  if (error) throw error;
  return data;
}

export function toCreateClientArgs(values: ClientFormValues): CreateClientArgs {
  return {
    p_name: values.name,
    p_city: values.city,
    p_postal_code: values.postal_code,
    p_street: values.street,
    p_number: values.number,
    p_logo_url: values.logo_url ?? undefined,
    p_primary_color: values.primary_color ?? undefined,
    p_secondary_color: values.secondary_color ?? undefined,
    p_accent_color: values.accent_color ?? undefined,
    p_email: values.email ?? undefined,
    p_website: values.website ?? undefined,
    p_btw_num: values.btw_num ?? undefined,
    p_kvk: values.kvk ?? undefined,
  };
}

export async function createClient(supabase: SupabaseClient<Database>, args: CreateClientArgs) {
  const { data, error } = await supabase.rpc("create_client", args);

  if (error) throw error;
  return data;
}

export type Clients = Awaited<ReturnType<typeof getClients>>;
export type Client = Clients[number];
