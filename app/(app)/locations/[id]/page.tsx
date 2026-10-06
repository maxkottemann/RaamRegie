"use client";

import { SubPageHeader } from "@/components/headers/pageHeader";
import ErrorState from "@/components/states/errorState";
import WindowLoader from "@/components/states/loadingState";
import NotFoundState from "@/components/states/notFound";
import Button from "@/components/ui/buttons/Button";
import { useLocationWithClient } from "@/hooks/locationHooks";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

export default function LocationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;

  const { data: location, isPending, error } = useLocationWithClient(id);

  if (isPending) return <WindowLoader />;
  if (error) return <ErrorState />;
  if (!location) return <NotFoundState />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between">
        <SubPageHeader title={location.name} description="Bekijk de gegevens van uw klant" />

        <div className="flex flex-row gap-2">
          <Button href={`/locations/${location.id}/edit`} variant="secondary" icon={Edit}>
            Bewerken
          </Button>
        </div>
      </div>
    </div>
  );
}
