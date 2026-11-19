import { Database } from "@/types/database.types";
import { EmployeeFormValues } from "@/zodSchemas/employeeSchema";
import { SupabaseClient } from "@supabase/supabase-js";

type CreateEmployeeArgs = Database["public"]["Functions"]["create_employee"]["Args"];
type UpdateEmployeeArgs = Database["public"]["Functions"]["update_employee"]["Args"];

export async function getEmployees(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      id,
      name,
      is_active,
      created_at,
      profile_id,
      vehicle_default_employees (
        vehicles ( id, name, license_plate, archived_at )
      )
    `,
    )
    .is("archived_at", null)
    .order("name");

  if (error) throw error;

  // flatten: employee.vans = [{ id, name, license_plate }]
  return data.map(({ vehicle_default_employees, ...employee }) => ({
    ...employee,
    vans: vehicle_default_employees
      .map((link) => link.vehicles)
      .filter((v): v is NonNullable<typeof v> => !!v && !v.archived_at),
  }));
}

export function toCreateEmployeeArgs(values: EmployeeFormValues) {
  return {
    p_name: values.name,
    p_profile_id: values.profile_id ?? undefined,
    p_vehicle_ids: values.vehicle_ids,
  };
}

export async function createEmployee(supabase: SupabaseClient<Database>, args: CreateEmployeeArgs) {
  const { data, error } = await supabase.rpc("create_employee", args);

  if (error) throw error;
  return data;
}

export function toUpdateEmployeeArgs(values: EmployeeFormValues, employeeId: string) {
  return {
    p_employee_id: employeeId,
    ...toCreateEmployeeArgs(values),
  };
}

export async function updateEmployee(supabase: SupabaseClient<Database>, args: UpdateEmployeeArgs) {
  const { data, error } = await supabase.rpc("update_employee", args);

  if (error) throw error;
  return data;
}

export async function removeEmployee(supabase: SupabaseClient<Database>, employeeId: string) {
  const { data, error } = await supabase.rpc("remove_employee", {
    p_employee_id: employeeId,
  });
  if (error) throw error;
  return data;
}

export type Employees = Awaited<ReturnType<typeof getEmployees>>;
export type Employee = Employees[number];
