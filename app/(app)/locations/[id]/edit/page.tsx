"use client";

import RoomLoader from "@/components/states/loadingState";
import EditLocationForm from "./_components/EditLocationForm";
import RoomError from "@/components/states/ErrorState";
import NotFoundState from "@/components/states/notFound";
import { useLocationWithClient } from "@/hooks/locationHooks";
import { useParams } from "next/navigation";
import { useClientOptions } from "@/hooks/clientHooks";

export default function EditLocationPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const { data: location, isPending, error } = useLocationWithClient(id);
  const {
    data: clientOptions,
    isPending: clientsPending,
    error: clientsError,
  } = useClientOptions();

  if (isPending || clientsPending) return <RoomLoader />;
  if (error || clientsError) return <RoomError />;
  if (!location || !clientOptions) return <NotFoundState />;

  return (
    <EditLocationForm location={location} clients={clientOptions} isPending={clientsPending} />
  );
}
