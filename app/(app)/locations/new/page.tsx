"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";

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
import NotFoundState from "@/components/states/notFound";
import RoomLoader from "@/components/states/loadingState";
import RoomError from "@/components/states/ErrorState";
import { REQUIRED_FIELDS_LOCATION } from "@/lib/constants";
import LocationFormSummarySidebar from "../[id]/edit/_components/LocationFormSummarySidebar";
import { useForm, useWatch } from "react-hook-form";
import LocationFormnFields from "@/components/ui/forms/locationForms/locationForm";

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
    formState: { errors, isDirty },
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

  if (isPending) return <RoomLoader />;
  if (error) return <RoomError />;
  if (!clients) return <NotFoundState />;

  const clientOptions = (clients ?? []).map((c) => ({ value: c.id, label: c.name }));
  const clientName = clientOptions.find((c) => c.value === values.client_id)?.label;

  const filled = REQUIRED_FIELDS_LOCATION.filter((key) => {
    const value = values[key];
    return typeof value === "string" && value.trim() !== "" && !errors[key];
  }).length;

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
        <LocationFormSummarySidebar
          name={values.name}
          clientName={clientName}
          addressLine={addressLine}
          cityLine={cityLine}
          filled={filled}
          isPending={createLocation.isPending}
          hasError={!!createLocation.error}
          isDirty={isDirty}
          submitLabel="Locatie aanmaken"
          errorMessage="De locatie kon niet worden aangemaakt. Probeer het opnieuw."
        />
      </form>
    </div>
  );
}
