import { boolean, z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const locationSchema = z.object({
  client_id: z.string().min(1, "Kies een klant"),

  name: z.string().trim().min(1, "Naam is verplicht").max(120, "Maximaal 120 tekens"),

  city: z.string().trim().min(1, "Plaats is verplicht"),
  street: z.string().trim().min(1, "Straatnaam is verplicht"),
  number: z.string().trim().min(1, "Huisnummer is verplicht").max(10, "Maximaal 10 tekens"),

  postal_code: z
    .string()
    .trim()
    .regex(/^\d{4}\s?[a-zA-Z]{2}$/, "Gebruik het formaat van 1234 AB")
    .transform((value) => `${value.slice(0, 4)} ${value.slice(-2).toUpperCase()}`),

  external_id: optionalText,
  internal_id: optionalText,
  checkin_procedure: z.boolean(),
});

export type LocationFormInput = z.input<typeof locationSchema>;
export type LocationFormValues = z.output<typeof locationSchema>;
