import { Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../formsection";
import { User } from "lucide-react";
import FormField from "../formField";
import Input from "../inputs/input";
import { EmployeeFormInput } from "@/zodSchemas/employeeSchema";
import Select from "../inputs/select";
import { useCompanyProfileOptions } from "@/hooks/profileHooks";

interface EmployeeFormFieldProps {
  register: UseFormRegister<EmployeeFormInput>;
  control: UseFormCo;
  errors: FieldErrors<EmployeeFormInput>;
  isEditing: boolean;
}

export default function EmployeeFormFields({
  register,
  errors,
  isEditing,
}: EmployeeFormFieldProps) {
  const { data: profileOptions } = useCompanyProfileOptions();
  return (
    <div className="space-y-6">
      <FormSection
        icon={User}
        title="Medewerker"
        description={isEditing ? "Bewerk deze medewerker" : "Medewerker toevoegen"}
      >
        <FormField id="name" label="Naam" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="Bijv. Jan Bakker"
            invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField id="account" label="Account" error={errors.profile_id?.message}>
          <Controller
            name="details.curtain_type_id"
            control={control}
            render={({ field }) => (
              <Select
                id="client_id"
                options={profileOptions?.map((p) => ({ label: p.name, value: p.id })) ?? []}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isFetching}
                invalid={!!error}
              />
            )}
          />
          <Select
            options={profileOptions?.map((p) => ({ label: p.name, value: p.id })) ?? []}
            id="account"
            value=""
            invalid={!!errors.profile_id}
            {...register("profile_id")}
          />
        </FormField>
      </FormSection>
    </div>
  );
}
