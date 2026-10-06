import { ClientFormInput } from "@/zodSchemas/clientSchema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormField from "./formField";
import Input from "./input";
import FormSection from "./formsection";
import {
  Building2,
  Globe,
  Landmark,
  Mail,
  MapIcon,
  MapPin,
  ReceiptText,
  Tag,
  User,
} from "lucide-react";

type ClientFormFieldsProps = {
  register: UseFormRegister<ClientFormInput>;
  errors: FieldErrors<ClientFormInput>;
};

export default function ClientFormFields({ register, errors }: ClientFormFieldsProps) {
  return (
    <div className="space-y-6">
      {" "}
      <FormSection icon={User} title="Klant" description="Vul de naam van de klant in">
        <FormField id="name" label="Naam" error={errors.name?.message}>
          <Input
            id="name"
            icon={Building2}
            placeholder="Bijv. Nepbedrijf B.V"
            invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
      </FormSection>
      <FormSection icon={MapIcon} title="Adres" description="Vul het adres van de klant in">
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
        title="Klantgegevens"
        description="Vul extra gegevens van de klant in"
      >
        <div className="grid grid-cols-2 gap-5">
          <FormField id="email" label="E-mailadres" optional error={errors.email?.message}>
            <Input id="email" icon={Mail} invalid={!!errors.email} {...register("email")}></Input>
          </FormField>
          <FormField id="website" label="Website" optional error={errors.website?.message}>
            <Input
              id="website"
              icon={Globe}
              invalid={!!errors.website}
              {...register("website")}
            ></Input>
          </FormField>
          <FormField id="kvk" label="KVK Nummer" optional error={errors.kvk?.message}>
            <Input id="kvk" icon={Landmark} invalid={!!errors.kvk} {...register("kvk")}></Input>
          </FormField>
          <FormField id="btw" label="BTW Nummer" optional error={errors.btw_num?.message}>
            <Input
              id="btw"
              icon={ReceiptText}
              invalid={!!errors.btw_num}
              {...register("btw_num")}
            ></Input>
          </FormField>
        </div>
      </FormSection>
    </div>
  );
}
