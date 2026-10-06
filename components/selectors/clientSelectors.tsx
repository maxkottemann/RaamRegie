"use client";

import { useState } from "react";
import { Check, ChevronRight, MapPin, Search, UsersRound } from "lucide-react";
import type { ClientListItem, Clients } from "@/services/clientService";

interface ClientSelectorProps {
  clients: Clients;
  selectedClient?: ClientListItem | null;
  selectedClientIds?: string[];
  onSelect: (client: ClientListItem) => void;
  maxHeight?: string;
}

export default function ClientSelector({
  clients,
  selectedClient,
  selectedClientIds,
  onSelect,
  maxHeight,
}: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const term = searchTerm.trim().toLowerCase();

  const filtered = term
    ? clients.filter((c) =>
        [c.name, c.city, c.street, c.postal_code].some((value) =>
          value?.toLowerCase().includes(term),
        ),
      )
    : clients;

  return (
    <div className="flex flex-col gap-3">
      <div className="group/search relative">
        <Search
          strokeWidth={1.75}
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted/60 transition-colors group-focus-within/search:text-primary"
        />
        <input
          type="search"
          placeholder="Zoek op naam of plaats"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 w-full rounded-lg border border-line bg-surface/70 pr-3 pl-9 text-sm text-ink transition outline-none placeholder:text-muted/50 hover:border-muted/30 hover:bg-white focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div className={`flex flex-col gap-2 overflow-y-auto ${maxHeight ?? ""}`}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white px-6 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Search strokeWidth={1.75} className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">Geen klanten gevonden</p>
            <p className="mt-1 text-sm text-muted">Probeer een andere zoekterm.</p>
          </div>
        ) : (
          filtered.map((c) => {
            const isSelected =
              c.id === selectedClient?.id || (selectedClientIds?.includes(c.id) ?? false);
            const address = [c.street, c.number].filter(Boolean).join(" ");

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c)}
                aria-pressed={isSelected}
                className={`group relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl border p-3 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? "border-primary/40 bg-primary-soft"
                    : "border-line bg-white hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <div
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface transition-colors duration-300 ${
                    isSelected
                      ? "text-white shadow-sm"
                      : "text-muted group-hover:text-white group-hover:shadow-sm"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-brand transition-opacity duration-300 ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  <UsersRound strokeWidth={1.75} className="relative h-5 w-5" />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-semibold text-ink">{c.name}</p>

                  {(c.city || address) && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      {c.city && (
                        <span className="flex items-center gap-1">
                          <MapPin strokeWidth={1.75} className="h-3.5 w-3.5" />
                          {c.city}
                        </span>
                      )}
                      {c.city && address && <span className="text-line">•</span>}
                      {address && <span className="truncate">{address}</span>}
                    </div>
                  )}
                </div>

                {isSelected ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand shadow-sm">
                    <Check strokeWidth={2.5} className="h-3.5 w-3.5 text-white" />
                  </span>
                ) : (
                  <ChevronRight
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-muted/40 transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                )}
              </button>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-right text-xs text-muted tabular-nums">
          {filtered.length} {filtered.length === 1 ? "klant" : "klanten"}
        </p>
      )}
    </div>
  );
}
