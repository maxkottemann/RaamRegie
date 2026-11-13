import { CurtainFormInput } from "@/zodSchemas/itemSchema";
import { Controller, useFormContext } from "react-hook-form";
import FormSection from "../../formsection";
import { ListPlus, MoveHorizontal, MoveVertical, Palette, Ruler, Tag, Type } from "lucide-react";
import FormField from "../../formField";
import Input from "../../inputs/input";
import DateInput from "../../inputs/dateInput";
import { useCurtainMaterialOptions, useCurtainTypeOptions } from "@/hooks/itemHooks/curtainHooks";
import Select from "../../inputs/select";
import LoadingState from "@/components/states/loadingState";
import ErrorState from "@/components/states/ErrorState";

export default function CurtainDetailsFields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CurtainFormInput>();

  const { data: curtainTypeOptions, isFetching, error } = useCurtainTypeOptions();
  const {
    data: curtainMaterialOptions,
    isFetching: isFetchingMaterials,
    error: materialsError,
  } = useCurtainMaterialOptions();

  if (error || materialsError || !curtainMaterialOptions || !curtainTypeOptions)
    return <ErrorState />;

  return (
    <>
      <FormSection
        icon={Ruler}
        title="Afmetingen"
        description="Vul de afmetingen in van het gordijn"
      >
        <FormField id="hei" label="Hoogte" error={errors?.details?.height?.message}>
          <Input
            id="height"
            type="number"
            icon={MoveVertical}
            placeholder="1.23"
            invalid={!!errors?.details?.height}
            {...register("details.height")}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-5">
          <FormField
            id="lowerwidth"
            label="Onderbreedte"
            error={errors?.details?.lower_width?.message}
          >
            <Input
              id="lowerwidth"
              type="number"
              icon={MoveHorizontal}
              placeholder="1.23"
              invalid={!!errors?.details?.lower_width}
              {...register("details.lower_width")}
            />
          </FormField>
          <FormField
            id="upperWidth"
            label="Bovenbreedte"
            error={errors?.details?.upper_width?.message}
          >
            <Input
              id="upperwidth"
              type="number"
              icon={MoveHorizontal}
              placeholder="1.23"
              invalid={!!errors?.details?.upper_width}
              {...register("details.upper_width")}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        icon={ListPlus}
        title="Overige gegevens"
        description="Vul de overige gegevens van dit gordijn in"
      >
        <div className="grid grid-cols-2 gap-5">
          <FormField
            id="date"
            label="Aanschaf datum"
            error={errors?.details?.purchase_date?.message}
          >
            <Controller
              control={control}
              name="details.purchase_date"
              render={({ field }) => (
                <DateInput
                  id="item-purchase-date"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.details?.purchase_date}
                  max={new Date().toISOString().slice(0, 10)}
                />
              )}
            />
          </FormField>

          <FormField id="color" label="Kleur" error={errors.details?.color?.message}>
            <Input
              id="color"
              icon={Palette}
              placeholder="Blauw"
              invalid={!!errors.details?.color}
              {...register("details.color")}
            />
          </FormField>

          <FormField
            id="curtaintype"
            label="Gordijntype"
            error={errors.details?.curtain_type_id?.message}
          >
            <Controller
              name="details.curtain_type_id"
              control={control}
              render={({ field }) => (
                <Select
                  id="client_id"
                  options={curtainTypeOptions.map((ct) => ({ label: ct.name, value: ct.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isFetching}
                  invalid={!!error}
                />
              )}
            />
          </FormField>
          <FormField
            id="curtainmaterials"
            label="Gordijnmateriaal"
            error={errors.details?.material_id?.message}
          >
            <Controller
              name="details.material_id"
              control={control}
              render={({ field }) => (
                <Select
                  id="client_id"
                  options={curtainMaterialOptions.map((ct) => ({ label: ct.name, value: ct.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isFetchingMaterials}
                  invalid={!!materialsError}
                />
              )}
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
