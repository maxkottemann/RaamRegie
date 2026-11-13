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
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-focus-within/search:text-primary"
        />
        <input
          type="search"
          placeholder="Zoek op naam of plaats"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Zoek klant"
          className="h-10 w-full rounded-md border border-line bg-white pr-3 pl-9 text-sm text-ink transition-colors outline-none placeholder:text-muted/70 hover:border-ink/25 focus:border-primary focus:ring-3 focus:ring-primary/15"
        />
      </div>

      <div className={`flex flex-col gap-2 overflow-y-auto ${maxHeight ?? ""}`}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white px-6 py-10 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted">
              <Search strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
            </span>
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
                className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary-soft ${
                  isSelected
                    ? "border-primary bg-primary-soft"
                    : "border-line bg-white hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors duration-150 ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-surface text-ink group-hover:text-primary"
                  }`}
                >
                  <UsersRound strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p
                    className={`truncate text-sm font-semibold transition-colors duration-150 ${
                      isSelected ? "text-ink" : "text-ink group-hover:text-primary"
                    }`}
                  >
                    {c.name}
                  </p>

                  {(c.city || address) && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      {c.city && (
                        <span className="flex items-center gap-1">
                          <MapPin strokeWidth={1.75} className="h-3.5 w-3.5" aria-hidden="true" />
                          {c.city}
                        </span>
                      )}
                      {c.city && address && (
                        <span aria-hidden="true" className="text-muted/50">
                          •
                        </span>
                      )}
                      {address && <span className="truncate">{address}</span>}
                    </div>
                  )}
                </div>

                {isSelected ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check strokeWidth={3} className="h-3 w-3 text-white" aria-hidden="true" />
                  </span>
                ) : (
                  <ChevronRight
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-muted transition-colors duration-150 group-hover:text-primary"
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
