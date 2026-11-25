"use client";

import { PageHeader } from "@/components/headers/pageHeader";
import ClientSelector from "@/components/selectors/clientSelectors";
import RoomError from "@/components/states/ErrorState";
import RoomLoader from "@/components/states/loadingState";
import Button from "@/components/ui/buttons/Button";
import { useClients } from "@/hooks/clientHooks";
import { UserPlus, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientPage() {
  const { data: clients, isPending, error } = useClients();

  const router = useRouter();

  if (isPending) return <RoomLoader />;
  if (error) return <RoomError />;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <PageHeader title="Klanten" description="Beheer al uw klanten" />
        <Button icon={UserPlus} size="md" variant="secondary" href="clients/new">
          Klant toevoegen
        </Button>
      </div>
      <ClientSelector
        clients={clients ?? []}
        onSelect={(client) => router.push(`clients/${client.id}`)}
      />
    </div>
  );
}
