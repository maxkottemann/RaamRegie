"use client";

import { PageHeader } from "@/components/headers/pageHeader";
import ErrorState from "@/components/states/errorState";
import WindowLoader from "@/components/states/loadingState";
import Button from "@/components/ui/buttons/Button";
import { useLocationsWithClient } from "@/hooks/locationHooks";
import { BuildingComplex, BuildingComplexPlus } from "lucide-react";

export default function LocationPage() {
  const { data: locations, isPending, error } = useLocationsWithClient();

  if (isPending) return <WindowLoader />;
  if (error) return <ErrorState />;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <PageHeader title="Locaties" icon={BuildingComplex} description="Beheer al uw locaties" />
        <Button icon={BuildingComplexPlus} size="md" variant="secondary" href="locations/new">
          Locatie toevoegen
        </Button>
      </div>
    </div>
  );
}
