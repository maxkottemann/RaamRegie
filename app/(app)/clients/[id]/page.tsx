"use client";

import { SubPageHeader } from "@/components/headers/pageHeader";
import ErrorState from "@/components/states/errorState";
import WindowLoader from "@/components/states/loadingState";
import NotFoundState from "@/components/states/notFound";
import Button from "@/components/ui/buttons/Button";
import Card from "@/components/ui/card";
import { useClient } from "@/hooks/clientHooks";
import { useCompany } from "@/hooks/companyHooks";
import { ClipboardList, Clock, Edit, Landmark, MapPinIcon, Tag, User } from "lucide-react";
import { useParams } from "next/navigation";
import ClientLocationsCard from "./_components/clientLocationCard";
import ClientInfoChip from "./_components/infochip";
import { formatAddress, formatDate } from "@/lib/format";

export default function ClientDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;

  const { company } = useCompany();

  const { data: client, isPending, error } = useClient(id);

  if (isPending) return <WindowLoader />;
  if (error) return <ErrorState />;
  if (!client) return <NotFoundState />;

  const canEditCompany = company?.id === client.owner_company_id;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between">
        <SubPageHeader title={client.name} description="Bekijk de gegevens van uw klant" />

        <div className="flex flex-row gap-2">
          {canEditCompany && (
            <Button href={`/clients/${client.id}/edit`} variant="secondary" icon={Edit}>
              Bewerken
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card icon={User} title="Klantgegevens">
          <div className="grid grid-cols-2 gap-5">
            <ClientInfoChip title="Klantnaam" value={client.name} icon={Tag} />
            <ClientInfoChip title="Adres" value={formatAddress(client)} icon={MapPinIcon} />
            <ClientInfoChip title="KVK-nummer" value={client.kvk} icon={Landmark} />
            <ClientInfoChip
              title="Klant sinds"
              value={formatDate(client.created_at ?? "")}
              icon={Clock}
            />
          </div>
        </Card>
        <Card icon={ClipboardList} title="Projectgegevens"></Card>
      </div>
      <ClientLocationsCard locations={client.locations} />
    </div>
  );
}
