import z from "zod";

const POSTAL_CODE_REGEX = /^[1-9]\d{3}\s?[a-zA-Z]{2}$/;
const POSTAL_CODE_MESSAGE = "Gebruik het formaat 1234 AB";

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
  .union([z.literal(""), z.coerce.number().positive({ error: "Moet groter dan 0 zijn" })])
  .transform((v) => (v === "" ? null : v));
export const optionalNonNegativeNumber = z
  .union([z.literal(""), z.coerce.number().nonnegative({ error: "Mag niet negatief zijn" })])
  .transform((v) => (v === "" ? null : v));
export const optionalInt = z
  .union([z.literal(""), z.coerce.number().int().positive()])
  .transform((v) => (v === "" ? null : v));
export const optionalDate = z
  .union([z.literal(""), z.iso.date({ error: "Ongeldige datum" })]) // zod 4
  .transform((v) => (v === "" ? null : v));

export const optionalUuid = z
  .union([z.literal(""), z.uuid("Ongeldige keuze")])
  .transform((v) => (v === "" ? null : v));

const formatPostalCode = (value: string) => `${value.slice(0, 4)} ${value.slice(-2).toUpperCase()}`;

export const optionalPostalCode = z
  .string()
  .trim()
  .refine((v) => v === "" || POSTAL_CODE_REGEX.test(v), { error: POSTAL_CODE_MESSAGE })
  .transform((v) => (v === "" ? null : formatPostalCode(v)));

export const isoDate = (error: string) => z.iso.date({ error });
