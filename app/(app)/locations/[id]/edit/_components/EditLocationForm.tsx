import { SubPageHeader } from "@/components/headers/pageHeader";
import Button from "@/components/ui/buttons/Button";
import { useToast } from "@/context/ToastContext";
import { useUpdateLocation } from "@/hooks/locationHooks";
import { REQUIRED_FIELDS, REQUIRED_FIELDS_LOCATION } from "@/lib/constants";
import { ClientOption } from "@/services/clientService";
import { LocationDetail } from "@/services/locationService";
import { LocationFormInput, LocationFormValues, locationSchema } from "@/zodSchemas/locationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPin, Save, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import LocationFormSummarySidebar from "./LocationFormSummarySidebar";
import LocationFormnFields from "@/components/ui/forms/locationForms/locationForm";

function toLocationFormInput(location: NonNullable<LocationDetail>): LocationFormInput {
  return {
    client_id: location?.clients?.id ?? "",
    name: location.name ?? "",
    checkin_procedure: location.checkin_procedure ?? false,
    city: location.city,
    postal_code: location.postal_code,
    street: location.street,
    number: location.number,
    internal_id: location.internal_id ?? "",
    external_id: location.external_id ?? "",
  };
}
export default function EditLocationForm({
  location,
  clients,
  isPending,
}: {
  location: LocationDetail;
  clients: ClientOption[];
  isPending: boolean;
}) {
  if (!location) return;
  const updateLocation = useUpdateLocation(location.id);
  const { showToast } = useToast();
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LocationFormInput, unknown, LocationFormValues>({
    resolver: zodResolver(locationSchema),
    mode: "onTouched",
    defaultValues: toLocationFormInput(location),
  });

  const values = useWatch({ control });

  const clientOptions = (clients ?? []).map((c) => ({ value: c.id, label: c.name }));
  const clientName = clientOptions.find((c) => c.value === values.client_id)?.label;

  const filled = REQUIRED_FIELDS_LOCATION.filter((key) => {
    const value = values[key];
    return typeof value === "string" && value.trim() !== "" && !errors[key];
  }).length;
  const progress = Math.round((filled / REQUIRED_FIELDS.length) * 100);

  const addressLine = [values.street, values.number].filter((v) => v?.trim()).join(" ");
  const cityLine = [values.postal_code, values.city].filter((v) => v?.trim()).join("  ");

  function onSubmit(formValues: LocationFormValues) {
    updateLocation.mutate(formValues, {
      onSuccess: (location) => {
        showToast("Locatie bijgewerkt", "success");
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
          isPending={updateLocation.isPending}
          hasError={!!updateLocation.error}
          isDirty={isDirty}
          submitLabel="Opslaan"
          errorMessage="De locatie kon niet worden bijgewerkt. Probeer het opnieuw."
        />
      </form>
    </div>
  );
}
