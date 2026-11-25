"use server";

import { createClient } from "@/lib/serverClient";

export async function getProjectServer(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, project_module")
    .eq("id", projectId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data; // null if it doesn't exist, or if RLS hides it
}
