"use client";

import NotFoundState from "@/components/states/notFound";
import { useClient } from "@/hooks/clientHooks";
import { useParams } from "next/navigation";
import EditClientForm from "./_components/editClientForm";
import LoadingState from "@/components/states/loadingState";
import ErrorState from "@/components/states/ErrorState";

export default function EditClientPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const { data: client, isPending, error } = useClient(id);

  if (isPending) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!client) return <NotFoundState />;

  return <EditClientForm client={client} />;
}
