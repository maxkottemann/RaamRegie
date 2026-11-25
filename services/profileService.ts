import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/database.types";

type Profile = Tables<"profiles">;

export async function getProfile(supabase: SupabaseClient<Database>): Promise<Profile> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCompanyProfileOptions(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("profiles").select("id,name");

  if (error) throw error;
  return data;
}

export type CompanyProfileOptions = Awaited<ReturnType<typeof getCompanyProfileOptions>>;
export type CompanyProfileOption = CompanyProfileOptions[number];
