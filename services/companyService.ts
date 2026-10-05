import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/database.types";

type Company = Tables<"companies">;

export async function getCompanyByUserId(
  supabase: SupabaseClient<Database>,
): Promise<Company | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id,companies(primary_color,secondary_color,accent_color)")
    .eq("auth_id", user.id)
    .single();

  if (profileError || !profile.company_id) return null;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile?.company_id)
    .single();

  if (companyError) throw new Error(companyError.message);
  return company ?? null;
}
