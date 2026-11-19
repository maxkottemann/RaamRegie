import { VehicleFormInput, VehicleFormValues } from "@/zodSchemas/vehicleSchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../formsection";
import { MapPinIcon, Truck } from "lucide-react";
import FormField from "../formField";
import Input from "../inputs/input";

interface VehicleFormFieldsProps {
  register: UseFormRegister<VehicleFormInput>;
  errors: FieldErrors<VehicleFormInput>;
  isEditing: boolean;
}

export default function VehicleFormFields({ register, errors, isEditing }: VehicleFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormSection
        icon={Truck}
        title="Voertuig"
        description={isEditing ? "Bewerk dit voertuig" : "Voertuig toevoegen"}
      >
        <FormField id="name" label="Voertuignaam" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="Bijv. Volvo V60"
            invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField id="co2" label="CO2 uitstoot per KM" error={errors.co2?.message}>
            <Input
              type="Number"
              id="co2"
              placeholder="Bijv. 0.013"
              invalid={!!errors.co2}
              {...register("co2")}
            />
          </FormField>
          <FormField
            id="co2old"
            label="CO2 uitstoot (Vergelijking)"
            error={errors.co2_old?.message}
          >
            <Input
              type="Number"
              id="co2old"
              placeholder="Bijv. 0.026"
              invalid={!!errors.co2_old}
              {...register("co2_old")}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        icon={MapPinIcon}
        title="Locatie"
        description="Word gebruikt voor het berekenen van de gereden kilometers voor projecten"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField id="postalcode" label="Postcode" error={errors.postal_code?.message}>
            <Input
              id="postalcode"
              placeholder="0000AA"
              invalid={!!errors.postal_code}
              {...register("postal_code")}
            />
          </FormField>
          <FormField id="number" label="Huisnummer" error={errors.number?.message}>
            <Input id="number" placeholder="11" invalid={!!errors.number} {...register("number")} />
          </FormField>
          <FormField id="street" label="Straat" error={errors.street?.message}>
            <Input
              id="street"
              placeholder="Ceintuurbaan"
              invalid={!!errors.street}
              {...register("street")}
            />
          </FormField>
          <FormField id="city" label="Plaats" error={errors.city?.message}>
            <Input
              id="city"
              placeholder="Amsterdam"
              invalid={!!errors.city}
              {...register("city")}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
}
