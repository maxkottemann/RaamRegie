import {
  Control,
  Controller,
  FieldErrors,
  UseControllerProps,
  UseFormRegister,
} from "react-hook-form";
import FormSection from "../formsection";
import { Truck, User } from "lucide-react";
import FormField from "../formField";
import Input from "../inputs/input";
import { EmployeeFormInput, EmployeeFormValues } from "@/zodSchemas/employeeSchema";
import Select from "../inputs/select";
import { useCompanyProfileOptions } from "@/hooks/profileHooks";
import { CustomSelect } from "../inputs/customSelect";
import { useVehicleOptions } from "@/hooks/staff/vehicleHooks";

interface EmployeeFormFieldProps {
  register: UseFormRegister<EmployeeFormInput>;
  control: Control<EmployeeFormInput, unknown, EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormInput>;
  isEditing: boolean;
}

export default function EmployeeFormFields({
  register,
  errors,
  isEditing,
  control,
}: EmployeeFormFieldProps) {
  const { data: profileOptions, isFetching } = useCompanyProfileOptions();

  const { data: vehicleOptions } = useVehicleOptions();

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

        <FormField id="account" label="Bijbehorend account" error={errors.profile_id?.message}>
          <Controller
            name="profile_id"
            control={control}
            render={({ field }) => (
              <Select
                clearable
                id="client_id"
                options={profileOptions?.map((p) => ({ label: p?.name, value: p?.id })) ?? []}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isFetching}
                invalid={!!errors?.profile_id}
              />
            )}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Voertuig"
        icon={Truck}
        description="Selecteer het voertuig waar deze medewerker standaard bijhoort"
      >
        <FormField id="vehicle" label="Standaard voertuig" error={errors.profile_id?.message}>
          <Controller
            name="vehicle_ids"
            control={control}
            render={({ field }) => (
              <CustomSelect
                multiple
                options={
                  vehicleOptions?.map((p) => ({
                    label: p?.name,
                    value: p?.id,
                    description: p?.license_plate ?? "",
                  })) ?? []
                }
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      </FormSection>
    </div>
  );
}
