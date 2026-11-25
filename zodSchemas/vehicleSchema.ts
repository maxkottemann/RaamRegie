import z from "zod";
import { optionalNumber, optionalPostalCode, optionalText } from "./helpers/optionals";

export const VehicleSchema = z.object({
  name: z.string().trim().min(1, "Voertuignaam is verplicht").max(100, "Maximaal 100 tekens"),
  license_plate: optionalText,
  street: optionalText,
  number: optionalText,
  postal_code: optionalPostalCode,
  city: optionalText,
  co2: optionalNumber,
  co2_old: optionalNumber,
});

export type VehicleFormInput = z.input<typeof VehicleSchema>;
export type VehicleFormValues = z.output<typeof VehicleSchema>;
