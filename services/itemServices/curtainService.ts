import { SupabaseClient } from "@supabase/supabase-js";

export async function getCurtainTypesOptions(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("curtain_types").select("id,name");

  if (error) throw error;
  return data;
}

export async function getCurtainMaterialsOptions(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("curtain_materials").select("id,name");

  if (error) throw error;
  return data;
}

export type CurtainTypes = Awaited<ReturnType<typeof getCurtainTypesOptions>>;
export type CurtainType = CurtainTypes[number];
export type CurtainMaterials = Awaited<ReturnType<typeof getCurtainTypesOptions>>;
export type CurtainMaterial = CurtainTypes[number];
