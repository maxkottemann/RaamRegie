"use client";

import Button from "@/components/ui/buttons/Button";
import { REQUIRED_FIELDS_LOCATION } from "@/lib/constants";
import { Building2, Save, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

type LocationFormSummarySidebarProps = {
  name?: string;
  clientName?: string;
  addressLine: string;
  cityLine: string;
  filled: number;
  isPending: boolean;
  hasError: boolean;
  isDirty: boolean;
  submitLabel: string;
  errorMessage: string;
};

export default function LocationFormSummarySidebar({
  name,
  clientName,
  addressLine,
  cityLine,
  filled,
  isPending,
  hasError,
  isDirty,
  submitLabel,
  errorMessage,
}: LocationFormSummarySidebarProps) {
  const router = useRouter();
  const total = REQUIRED_FIELDS_LOCATION.length;
  const progress = Math.round((filled / total) * 100);
  const trimmedName = name?.trim();

  return (
    <aside className="space-y-4 lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="bg-brand h-1" />

        <div className="p-5">
          <p className="text-[11px] font-medium tracking-wider text-muted/70 uppercase">
            Overzicht
          </p>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white text-ink shadow-card">
              <Building2 strokeWidth={1.75} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${trimmedName ? "text-ink" : "text-muted/50"}`}
              >
                {trimmedName || "Naam van de locatie"}
              </p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                <UsersRound strokeWidth={1.75} className="h-3.5 w-3.5 shrink-0" />
                {clientName ?? "Geen klant gekozen"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-0.5 rounded-lg bg-surface px-3 py-2.5 text-xs">
            <p className={addressLine ? "text-ink" : "text-muted/50"}>
              {addressLine || "Straat en huisnummer"}
            </p>
            <p className={cityLine ? "text-ink" : "text-muted/50"}>
              {cityLine || "Postcode en plaats"}
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink">Verplichte velden</span>
              <span className="text-muted tabular-nums">
                {filled} van {total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-line p-5">
          {hasError && (
            <p
              role="alert"
              className="rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger"
            >
              {errorMessage}
            </p>
          )}
          <Button
            icon={Save}
            disabled={!isDirty}
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
          >
            {submitLabel}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => router.back()}>
            Annuleren
          </Button>
        </div>
      </div>
    </aside>
  );
}
