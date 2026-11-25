import z from "zod";
import { optionalText } from "./helpers/optionals";

export const RoomSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht").max(120, "Maximaal 120 tekens"),
  function: optionalText,
  category: optionalText,
  section: optionalText,
});

export type RoomFormInput = z.input<typeof RoomSchema>;
export type RoomFormvalues = z.output<typeof RoomSchema>;
