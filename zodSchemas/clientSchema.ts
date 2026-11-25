import { boolean, z } from "zod";
import { optionalEmail, optionalText } from "./helpers/optionals";

export const clientSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht").max(120, "Maximaal 120 tekens"),

  city: z.string().trim().min(1, "Plaats is verplicht"),
  street: z.string().trim().min(1, "Straatnaam is verplicht"),
  number: z.string().trim().min(1, "Huisnummer is verplicht").max(10, "Maximaal 10 tekens"),

  postal_code: z
    .string()
    .trim()
    .regex(/^\d{4}\s?[a-zA-Z]{2}$/, "Gebruik het formaat van 1234 AB")
    .transform((value) => `${value.slice(0, 4)} ${value.slice(-2).toUpperCase()}`),

  logo_url: optionalText,
  primary_color: optionalText,
  secondary_color: optionalText,
  accent_color: optionalText,
  email: optionalEmail,
  website: optionalText,
  kvk: optionalText,
  btw_num: optionalText,
});
export type ClientFormInput = z.input<typeof clientSchema>;
export type ClientFormValues = z.output<typeof clientSchema>;
