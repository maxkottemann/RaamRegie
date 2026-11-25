import z from "zod";
import { optionalUuid } from "./helpers/optionals";

export const EmployeeSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht").max(100, "Maximaal 100 tekens"),
  profile_id: optionalUuid,
  vehicle_ids: z.array(z.uuid({ error: "Ongeldig voertuig" })),
});

export type EmployeeFormInput = z.input<typeof EmployeeSchema>;
export type EmployeeFormValues = z.output<typeof EmployeeSchema>;
