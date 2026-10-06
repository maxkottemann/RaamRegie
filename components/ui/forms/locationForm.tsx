import { LocationFormInput, LocationFormValues } from "@/zodSchemas/locationSchema";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "./input";
import FormField from "./formField";
import { Building2, Hash, MapIcon, MapPin, Tag, UsersRound } from "lucide-react";
import FormSection from "./formsection";
import Select from "./select";

type LocationFormFieldsProps = {
  clientOptions: { label: string; value: string }[];
  register: UseFormRegister<LocationFormInput>;
  errors: FieldErrors<LocationFormInput>;
  control: Control<LocationFormInput, unknown, LocationFormValues>;
  clientsLoading: boolean;
};

export default function LocationFormnFields({
  register,
  errors,
  clientOptions,
  control,
  clientsLoading,
}: LocationFormFieldsProps) {
  return (
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
                placeholder={clientsLoading ? "Laden…" : "Kies een klant"}
                disabled={clientsLoading}
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
  );
}
