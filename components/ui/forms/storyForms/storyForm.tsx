import { StoryFormInput, StoryFormValues } from "@/zodSchemas/storySchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Building2, Layers } from "lucide-react";
import FormSection from "../formsection";
import FormField from "../formField";
import Input from "../inputs/input";

type StoryFormFieldsProps = {
  register: UseFormRegister<StoryFormInput>;
  errors: FieldErrors<StoryFormInput>;
  control: Control<StoryFormInput, unknown, StoryFormValues>;
};

export default function StoryFormFields({ register, errors, control }: StoryFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormSection icon={Layers} title="Verdieping" description="Voeg een locatie toe">
        <FormField id="name" label="Naam" error={errors.name?.message}>
          <Input
            id="name"
            icon={Building2}
            placeholder="Bijv. Verdieping 1"
            invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>
      </FormSection>
    </div>
  );
}
