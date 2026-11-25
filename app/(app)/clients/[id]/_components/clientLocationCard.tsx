"use client";

import { useState } from "react";
import { Building2, ChevronRight, MapPin, Search } from "lucide-react";
import Card from "@/components/ui/cards/card";
import LocationSelector from "@/components/selectors/locationSelector";
import { LocationsWithClient } from "@/services/locationService";
import { useRouter } from "next/navigation";

interface ClientLocationsCardProps {
  locations: LocationsWithClient;
}

export default function ClientLocationsCard({ locations }: ClientLocationsCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const term = searchTerm.trim().toLowerCase();

  const router = useRouter();

  const filtered = term
    ? locations.filter((l) =>
        [l.name, l.city, l.street].some((value) => value?.toLowerCase().includes(term)),
      )
    : locations;

  return (
    <Card
      icon={Building2}
      title="Klantlocaties"
      subtitle={`${locations.length} ${locations.length === 1 ? "locatie" : "locaties"}`}
    >
      {locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Building2 strokeWidth={1.75} className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-ink">Nog geen locaties</p>
          <p className="mt-1 text-sm text-muted">Deze klant heeft nog geen locaties.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Geen locaties gevonden voor “{searchTerm.trim()}”.
            </p>
          ) : (
            <LocationSelector
              locations={filtered}
              onSelect={(val) => router.push(`/locations/${val.id}`)}
            />
          )}
        </div>
      )}
    </Card>
  );
}
