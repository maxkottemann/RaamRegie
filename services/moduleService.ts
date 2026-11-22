import { createClient } from "@/lib/serverClient";
import { ModuleKey } from "@/modules/types/types";

export async function getCompanyModules(): Promise<ModuleKey[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("company_modules").select("module").order("module");

  if (error) throw error;
  return data.map((row) => row.module);
}
