import { supabase } from "@/lib/browserClient";
import {
  createClient,
  getClientOptions,
  getClients,
  toCreateClientArgs,
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
