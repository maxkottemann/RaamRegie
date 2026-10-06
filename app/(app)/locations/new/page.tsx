"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Hash, Map as MapIcon, MapPin, Tag, UsersRound } from "lucide-react";

import { useClientOptions } from "@/hooks/clientHooks";
import {
  locationSchema,
  type LocationFormInput,
  type LocationFormValues,
} from "@/zodSchemas/locationSchema";
import { SubPageHeader } from "@/components/headers/pageHeader";
import Button from "@/components/ui/buttons/Button";
import { useCreateLocation } from "@/hooks/locationHooks";
import { useToast } from "@/context/ToastContext";
import LocationFormnFields from "@/components/ui/forms/locationForm";
import NotFoundState from "@/components/states/notFound";
import WindowLoader from "@/components/states/loadingState";
import ErrorState from "@/components/states/errorState";

const REQUIRED_FIELDS = ["client_id", "name", "street", "number", "postal_code", "city"] as const;

export default function NewLocationPage() {
  const router = useRouter();
  const { data: clients, isPending, error } = useClientOptions();
  const createLocation = useCreateLocation();
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormInput, unknown, LocationFormValues>({
    resolver: zodResolver(locationSchema),
    mode: "onTouched",
    defaultValues: {
      client_id: "",
      name: "",
      street: "",
      number: "",
      postal_code: "",
      city: "",
      external_id: "",
      internal_id: "",
      checkin_procedure: false,
    },
  });

  const values = useWatch({ control });

  if (isPending) return <WindowLoader />;
  if (error) return <ErrorState />;
  if (!clients) return <NotFoundState />;

  const clientOptions = (clients ?? []).map((c) => ({ value: c.id, label: c.name }));
  const clientName = clientOptions.find((c) => c.value === values.client_id)?.label;

  const filled = REQUIRED_FIELDS.filter((key) => {
    const value = values[key];
    return typeof value === "string" && value.trim() !== "" && !errors[key];
  }).length;
  const progress = Math.round((filled / REQUIRED_FIELDS.length) * 100);

  const addressLine = [values.street, values.number].filter((v) => v?.trim()).join(" ");
  const cityLine = [values.postal_code, values.city].filter((v) => v?.trim()).join("  ");

  function onSubmit(formValues: LocationFormValues) {
    createLocation.mutate(formValues, {
      onSuccess: (location) => {
        showToast("Locatie aangemaakt", "success");
        router.push(`/locations/${location.id}`);
      },
    });
  }

  return (
    <div className="mx-auto">
      <SubPageHeader
        title="Nieuwe locatie"
        description="Voeg een locatie toe aan een van je klanten"
        icon={MapPin}
        fallbackHref="/locations"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        {/* form sections */}
        <LocationFormnFields
          register={register}
          control={control}
          clientOptions={clientOptions}
          clientsLoading={isPending}
          errors={errors}
        />

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="h-1 bg-brand" />

            <div className="p-5">
              <p className="text-[11px] font-medium tracking-wider text-muted/70 uppercase">
                Overzicht
              </p>

              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
                  <Building2 strokeWidth={1.75} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${values.name?.trim() ? "text-ink" : "text-muted/50"}`}
                  >
                    {values.name?.trim() || "Naam van de locatie"}
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
                    {filled} van {REQUIRED_FIELDS.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-line p-5">
              {createLocation.error && (
                <p
                  role="alert"
                  className="rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger"
                >
                  De locatie kon niet worden aangemaakt. Probeer het opnieuw.
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" loading={createLocation.isPending}>
                Locatie aanmaken
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.back()}>
                Annuleren
              </Button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
