"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, ChevronRight, MapPin, Search } from "lucide-react";
import Card from "@/components/ui/card";

type LocationRow = {
  id: string;
  name: string | null;
  city?: string | null;
  street?: string | null;
  number?: string | null;
};

interface ClientLocationsCardProps {
  locations: LocationRow[];
}

export default function ClientLocationsCard({ locations }: ClientLocationsCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const term = searchTerm.trim().toLowerCase();

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
          <div className="group/search relative">
            <Search
              strokeWidth={1.75}
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted/60 transition-colors group-focus-within/search:text-primary"
            />
            <input
              type="search"
              placeholder="Zoek op locatie of plaats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-lg border border-line bg-surface/70 pr-3 pl-9 text-sm text-ink transition outline-none placeholder:text-muted/50 hover:border-muted/30 hover:bg-white focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Geen locaties gevonden voor “{searchTerm.trim()}”.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((l) => {
                const address = [l.street, l.number].filter(Boolean).join(" ");

                return (
                  <li key={l.id}>
                    <Link
                      href={`/locations/${l.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-line bg-white p-3 transition duration-200 hover:border-primary/30 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-muted transition-colors duration-300 group-hover:text-white group-hover:shadow-sm">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <Building2 strokeWidth={1.75} className="relative h-5 w-5" />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-sm font-semibold text-ink">{l.name}</p>
                        {(l.city || address) && (
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                            {l.city && (
                              <span className="flex items-center gap-1">
                                <MapPin strokeWidth={1.75} className="h-3.5 w-3.5" />
                                {l.city}
                              </span>
                            )}
                            {l.city && address && <span className="text-line">•</span>}
                            {address && <span className="truncate">{address}</span>}
                          </div>
                        )}
                      </div>

                      <ChevronRight
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-muted/40 transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
