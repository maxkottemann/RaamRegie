import { RoomFormInput, RoomFormvalues } from "@/zodSchemas/roomSchema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { DoorOpen } from "lucide-react";
import FormField from "../formField";
import Input from "../inputs/input";

type RoomFormFieldsProps = {
  register: UseFormRegister<RoomFormInput>;
  errors: FieldErrors<RoomFormInput>;
  control: Control<RoomFormInput, unknown, RoomFormvalues>;
};

export default function RoomFormFields({ register, errors, control }: RoomFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormField id="name" label="Naam" error={errors.name?.message}>
        <Input
          id="name"
          icon={DoorOpen}
          placeholder="Bijv. 1.01"
          invalid={!!errors.name}
          {...register("name")}
        />
      </FormField>
      <FormField id="function" label="Functie" error={errors.function?.message}>
        <Input
          id="function"
          icon={DoorOpen}
          placeholder="Bijv. Opbergruimte"
          invalid={!!errors.function}
          {...register("function")}
        />
      </FormField>

      <FormField id="category" label="Category" error={errors.category?.message}>
        <Input
          id="category"
          icon={DoorOpen}
          placeholder="Bijv. Kantoor"
          invalid={!!errors.function}
          {...register("category")}
        />
      </FormField>

      <FormField id="section" label="Afdeling" error={errors.category?.message}>
        <Input
          id="section"
          icon={DoorOpen}
          placeholder="Bijv. A"
          invalid={!!errors.section}
          {...register("section")}
        />
      </FormField>
    </div>
  );
}
