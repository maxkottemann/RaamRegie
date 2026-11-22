import z from "zod";
import { optionalNonNegativeNumber, optionalText } from "./helpers/optionals";

export const CleaningMethodSchema = z.object({
  name: z.string().trim().min(1, { error: "Methodenaam mag niet leeg zijn" }).max(120),
  description: optionalText,
  water_usage: optionalNonNegativeNumber,
  waste_water: optionalNonNegativeNumber,
  chemical_usage: optionalNonNegativeNumber,
  electricity: optionalNonNegativeNumber,
  packaging: optionalNonNegativeNumber,
  water_usage_old: optionalNonNegativeNumber,
  waste_water_old: optionalNonNegativeNumber,
  chemical_usage_old: optionalNonNegativeNumber,
  electricity_old: optionalNonNegativeNumber,
  packaging_old: optionalNonNegativeNumber,
});

export type CleaningMethodFormInput = z.input<typeof CleaningMethodSchema>;
export type CleaningMethodFormValues = z.output<typeof CleaningMethodSchema>;
