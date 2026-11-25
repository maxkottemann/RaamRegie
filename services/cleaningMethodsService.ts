import { ModuleKey } from "@/modules/types/types";
import { Database } from "@/types/database.types";
import { CleaningMethodFormValues } from "@/zodSchemas/cleaningMethodSchema";
import { SupabaseClient } from "@supabase/supabase-js";

type CreateCleaningMethodArgs = Database["public"]["Functions"]["create_cleaning_method"]["Args"];
type UpdateCleaningMethodArgs = Database["public"]["Functions"]["update_cleaning_method"]["Args"];

//selects

export async function getCleaningMethodsByModule(
  supabase: SupabaseClient<Database>,
  module: ModuleKey,
) {
  const { data, error } = await supabase
    .from("cleaning_methods")
    .select(
      "id, name, description, water_usage, waste_water, chemical_usage, electricity, packaging, water_usage_old, waste_water_old, chemical_usage_old, electricity_old, packaging_old, module",
    )
    .eq("module", module)
    .is("archived_at", null);

  if (error) throw error;
  return data;
}

//helpers
export function toCreateCleaningMethodArgs(
  values: CleaningMethodFormValues,
  module: ModuleKey,
): CreateCleaningMethodArgs {
  return {
    p_name: values.name,
    p_module: module,
    p_description: values.description ?? undefined,
    p_water_usage: values.water_usage ?? undefined,
    p_waste_water: values.waste_water ?? undefined,
    p_chemical_usage: values.chemical_usage ?? undefined,
    p_electricity: values.electricity ?? undefined,
    p_packaging: values.packaging ?? undefined,
    p_water_usage_old: values.water_usage_old ?? undefined,
    p_waste_water_old: values.waste_water_old ?? undefined,
    p_chemical_usage_old: values.chemical_usage_old ?? undefined,
    p_electricity_old: values.electricity_old ?? undefined,
    p_packaging_old: values.packaging_old ?? undefined,
  };
}

export function toUpdateCleaningMethodArgs(
  values: CleaningMethodFormValues,
  module: ModuleKey,
  cleaningMethodId: string,
): UpdateCleaningMethodArgs {
  return { ...toCreateCleaningMethodArgs(values, module), p_cleaning_method_id: cleaningMethodId };
}

//mutations
export async function createCleaningMethod(
  supabase: SupabaseClient<Database>,
  args: CreateCleaningMethodArgs,
) {
  const { data, error } = await supabase.rpc("create_cleaning_method", args);

  if (error) throw error;
  return data;
}

export async function updateCleaningMethod(
  supabase: SupabaseClient<Database>,
  args: UpdateCleaningMethodArgs,
) {
  const { data, error } = await supabase.rpc("update_cleaning_method", args);

  if (error) throw error;
  return data;
}

export async function removeCleaningMethod(
  supabase: SupabaseClient<Database>,
  cleaningMethodId: string,
) {
  const { data, error } = await supabase.rpc("delete_cleaning_method", {
    p_cleaning_method_id: cleaningMethodId,
  });
  console.log(error);
  if (error) throw error;
  return data;
}

export type CleaningMethods = Awaited<ReturnType<typeof getCleaningMethodsByModule>>;
export type CleaningMethod = CleaningMethods[number];
