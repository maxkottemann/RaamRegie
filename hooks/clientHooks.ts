import { supabase } from "@/lib/browserClient";
import {
  createClient,
  getClient,
  getClientOptions,
  getClients,
  toCreateClientArgs,
  toUpdateClientArgs,
  updateClient,
} from "@/services/clientService";
import { ClientFormValues } from "@/zodSchemas/clientSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useClientOptions() {
  return useQuery({
    queryKey: ["clients", "options"],
    queryFn: () => getClientOptions(supabase),
  });
}

export function useClients() {
  return useQuery({
    queryKey: ["clients", "clients"],
    queryFn: () => getClients(supabase),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ClientFormValues) => createClient(supabase, toCreateClientArgs(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient(id: string) {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: (values: ClientFormValues) =>
      updateClient(supabase, id, toUpdateClientArgs(values)),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => getClient(supabase, id!),
    enabled: !!id,
  });
}
