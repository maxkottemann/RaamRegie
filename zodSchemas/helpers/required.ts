import z from "zod";

export const requiredInt = z.coerce
  .number({ message: "Vul een getal in" })
  .int("Alleen hele aantallen")
  .gte(1, "Minimaal 1");

export const requiredNumber = z.coerce
  .number({ message: "Vul een getal in" })
  .gt(0, "Moet groter zijn dan 0");

export const requiredUuid = z
  .string({ message: "Maak een keuze" })
  .min(1, "Maak een keuze")
  .uuid("Ongeldige keuze");
