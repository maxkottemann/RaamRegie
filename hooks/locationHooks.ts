import { supabase } from "@/lib/browserClient";
import { getLocationsWithClient } from "@/services/locationService";
import { useQuery } from "@tanstack/react-query";


export function useLocationsWithClient(){
    return useQuery({
        queryKey:['locations','with-client'],
        queryFn:()=>getLocationsWithClient(supabase)
    })
}