"use client"

import ErrorState from "@/components/states/errorState";
import WindowLoader from "@/components/states/loadingState";
import { useLocationsWithClient } from "@/hooks/locationHooks"

export default function LocationPage(){
    const {data:locations,isPending,error} = useLocationsWithClient();

    if(isPending) return <WindowLoader/>
    if(error)return <ErrorState/>
}