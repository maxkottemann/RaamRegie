import { supabase } from "@/lib/browserClient";
import { ModuleKey } from "@/modules/types/types";
import {
  createCleaningMethod,
  getCleaningMethodsByModule,
  removeCleaningMethod,
  toCreateCleaningMethodArgs,
  toUpdateCleaningMethodArgs,
  updateCleaningMethod,
} from "@/services/cleaningMethodsService";
import { CleaningMethodFormValues } from "@/zodSchemas/cleaningMethodSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCleaningMethodsByModule(module: ModuleKey | undefined) {
  return useQuery({
    queryKey: ["cleaning_methods", module],
    queryFn: () => getCleaningMethodsByModule(supabase, module!),
    enabled: !!module,
  });
}

export function useCreateCleaningMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ values, module }: { values: CleaningMethodFormValues; module: ModuleKey }) =>
      createCleaningMethod(supabase, toCreateCleaningMethodArgs(values, module)),

    onSuccess: (_data, { module }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning_methods", module] });
    },
  });
}
export function useUpdateCleaningMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      values,
      module,
      cleaningMethodId,
    }: {
      values: CleaningMethodFormValues;
      module: ModuleKey;
      cleaningMethodId: string;
    }) =>
      updateCleaningMethod(supabase, toUpdateCleaningMethodArgs(values, module, cleaningMethodId)),
    onSuccess: (_data, { module }) => {
      queryClient.invalidateQueries({ queryKey: ["cleaning_methods", module] });
    },
  });
}

export function useDeleteCleaningMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cleaningMethodId: string) => removeCleaningMethod(supabase, cleaningMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaning_methods"] });
    },
  });
}
