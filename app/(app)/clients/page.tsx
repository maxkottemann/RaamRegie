"use client";

import { PageHeader } from "@/components/headers/pageHeader";
import ErrorState from "@/components/states/errorState";
import WindowLoader from "@/components/states/loadingState";
import Button from "@/components/ui/buttons/Button";
import { useClients } from "@/hooks/clientHooks";
import { UserPlus, Users2 } from "lucide-react";

export default function ClientPage() {
  const { data: clients, isPending, error } = useClients();

  if (isPending) return <WindowLoader />;
  if (error) return <ErrorState />;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <PageHeader title="Locaties" icon={Users2} description="Beheer al uw locaties" />
        <Button icon={UserPlus} size="md" variant="secondary" href="clients/new">
          Klant toevoegen
        </Button>
      </div>
    </div>
  );
}
