import z from "zod";

export const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => value === "" || z.email().safeParse(value).success, "Ongeldig e-mailadres")
  .transform((value) => (value === "" ? null : value));

export const optionalNumber = z
  .union([z.literal(""), z.coerce.number().positive()])
  .transform((v) => (v === "" ? null : v));
export const optionalInt = z
  .union([z.literal(""), z.coerce.number().int().positive()])
  .transform((v) => (v === "" ? null : v));
export const optionalDate = z
  .union([z.literal(""), z.iso.date({ error: "Ongeldige datum" })]) // zod 4
  .transform((v) => (v === "" ? null : v));

export const optionalUuid = z
  .union([z.literal(""), z.string().uuid("Ongeldige keuze")])
  .transform((v) => (v === "" ? null : v));
