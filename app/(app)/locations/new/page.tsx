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
import FormField from "@/components/ui/forms/formField";
import FormSection from "@/components/ui/forms/formsection";
import Input from "@/components/ui/forms/input";
import Select from "@/components/ui/forms/select";
import Button from "@/components/ui/buttons/Button";
import { useCreateLocation } from "@/hooks/locationHooks";
import { useToast } from "@/context/ToastContext";

const REQUIRED_FIELDS = ["client_id", "name", "street", "number", "postal_code", "city"] as const;

export default function NewLocationPage() {
  const router = useRouter();
  const clients = useClientOptions();
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

  const clientOptions = (clients.data ?? []).map((c) => ({ value: c.id, label: c.name }));
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
        <div className="space-y-6">
          <FormSection
            icon={UsersRound}
            title="Klant"
            description="Bij welke klant hoort deze locatie?"
          >
            <FormField id="client_id" label="Klant" error={errors.client_id?.message}>
              <Controller
                name="client_id"
                control={control}
                render={({ field }) => (
                  <Select
                    id="client_id"
                    options={clientOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={clients.isPending ? "Laden…" : "Kies een klant"}
                    disabled={clients.isPending}
                    invalid={!!errors.client_id}
                  />
                )}
              />
            </FormField>
          </FormSection>

          <FormSection icon={Building2} title="Locatie" description="Hoe heet de locatie?">
            <FormField id="name" label="Naam" error={errors.name?.message}>
              <Input
                id="name"
                icon={Building2}
                placeholder="Bijv. Isala Zwolle, gebouw B"
                invalid={!!errors.name}
                {...register("name")}
              />
            </FormField>
          </FormSection>

          <FormSection icon={MapIcon} title="Adres" description="Waar staat de locatie?">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_8rem]">
              <FormField id="street" label="Straat" error={errors.street?.message}>
                <Input
                  id="street"
                  icon={MapPin}
                  autoComplete="address-line1"
                  invalid={!!errors.street}
                  {...register("street")}
                />
              </FormField>
              <FormField id="number" label="Huisnummer" error={errors.number?.message}>
                <Input id="number" invalid={!!errors.number} {...register("number")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <FormField id="postal_code" label="Postcode" error={errors.postal_code?.message}>
                <Input
                  id="postal_code"
                  autoComplete="postal-code"
                  placeholder="1234 AB"
                  invalid={!!errors.postal_code}
                  {...register("postal_code")}
                />
              </FormField>
              <FormField id="city" label="Plaats" error={errors.city?.message}>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  invalid={!!errors.city}
                  {...register("city")}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            icon={Tag}
            title="Referenties"
            description="Handig om de locatie terug te vinden"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="external_id"
                label="Extern ID"
                optional
                hint="Nummer van de klant"
                error={errors.external_id?.message}
              >
                <Input
                  id="external_id"
                  icon={Hash}
                  invalid={!!errors.external_id}
                  {...register("external_id")}
                />
              </FormField>
              <FormField
                id="internal_id"
                label="Intern ID"
                optional
                hint="Alleen zichtbaar voor jullie"
                error={errors.internal_id?.message}
              >
                <Input
                  id="internal_id"
                  icon={Hash}
                  invalid={!!errors.internal_id}
                  {...register("internal_id")}
                />
              </FormField>
            </div>
          </FormSection>
        </div>

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
