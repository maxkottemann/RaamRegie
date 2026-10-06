import { Database, TablesUpdate } from "@/types/database.types";
import { ClientFormValues } from "@/zodSchemas/clientSchema";
import { SupabaseClient } from "@supabase/supabase-js";
import { th } from "zod/locales";

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

export async function getClient(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "*,locations(id,name,checkin_procedure,city,postal_code,street,number,created_at,internal_id,external_id)",
    )
    .eq("id", id)
    .maybeSingle();

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

export function toUpdateClientArgs(values: ClientFormValues): TablesUpdate<"clients"> {
  return {
    name: values.name,
    city: values.city,
    postal_code: values.postal_code,
    street: values.street,
    number: values.number,
    logo_url: values.logo_url,
    primary_color: values.primary_color,
    secondary_color: values.secondary_color,
    accent_color: values.accent_color,
    email: values.email,
    website: values.website,
    btw_num: values.btw_num,
    kvk: values.kvk,
  };
}

export async function createClient(supabase: SupabaseClient<Database>, args: CreateClientArgs) {
  const { data, error } = await supabase.rpc("create_client", args);

  if (error) throw error;
  return data;
}

export async function updateClient(
  supabase: SupabaseClient<Database>,
  id: string,
  values: TablesUpdate<"clients">,
) {
  const { data, error } = await supabase
    .from("clients")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export type Clients = Awaited<ReturnType<typeof getClients>>;
export type ClientOption = Awaited<ReturnType<typeof getClientOptions>>[number];
export type ClientListItem = Awaited<ReturnType<typeof getClients>>[number];
export type ClientDetail = Awaited<ReturnType<typeof getClient>>;
