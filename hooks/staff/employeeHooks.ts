import { supabase } from "@/lib/browserClient";
import { toUpdateClientArgs } from "@/services/clientService";
import {
  createEmployee,
  getEmployees,
  removeEmployee,
  toCreateEmployeeArgs,
  toUpdateEmployeeArgs,
  updateEmployee,
} from "@/services/staff/employeeService";
import { EmployeeFormValues } from "@/zodSchemas/employeeSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(supabase),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EmployeeFormValues) =>
      createEmployee(supabase, toCreateEmployeeArgs(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, employeeId }: { values: EmployeeFormValues; employeeId: string }) =>
      updateEmployee(supabase, toUpdateEmployeeArgs(values, employeeId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useRemoveEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => removeEmployee(supabase, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
