"use client";

import { PageHeader } from "@/components/headers/pageHeader";
import LocationSelector from "@/components/selectors/locationSelector";
import RoomError from "@/components/states/ErrorState";
import RoomLoader from "@/components/states/loadingState";
import Button from "@/components/ui/buttons/Button";
import { useLocationsWithClient } from "@/hooks/locationHooks";
import { BuildingComplexPlus, Import } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LocationPage() {
  const { data: locations, isPending, error } = useLocationsWithClient();

  const router = useRouter();

  if (isPending) return <RoomLoader />;
  if (error) return <RoomError />;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <PageHeader title="Locaties" description="Beheer al uw locaties" />
        <div className="flex flex-row gap-3">
          <Button icon={Import} size="md" variant="secondary" href="locations/import">
            Locatie importeren
          </Button>
          <Button icon={BuildingComplexPlus} size="md" variant="primary" href="locations/new">
            Locatie toevoegen
          </Button>
        </div>
      </div>
      <LocationSelector
        locations={locations}
        onSelect={(location) => router.push(`/locations/${location.id}`)}
      />
    </div>
  );
}
