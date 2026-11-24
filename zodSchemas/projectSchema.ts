import { z } from "zod";
import { isoDate, optionalText } from "./helpers/optionals";
import { requiredUuid } from "./helpers/required";

export const PlannedItemSchema = z.object({
  item_id: z.uuid({ error: "Ongeldig object" }),
  planned_quantity: z.number().int().positive({ error: "Aantal moet minimaal 1 zijn" }),
  cleaning_method_id: z.uuid({ error: "Kies een geldige methode" }),
  room_id: z.uuid(),
  story_id: z.uuid(),
});

export const PlannedVehicleSchema = z.object({
  vehicle_id: z.uuid({ error: "Ongeldig voertuig" }),
  employee_ids: z.array(z.uuid({ error: "Ongeldige medewerker" })),
  date: isoDate("Selecteer een geldige datum"),
});

export const ProjectSchema = z
  .object({
    name: z.string().trim().min(2, { error: "Projectnaam is verplicht" }).max(150),
    projectCode: optionalText,
    description: optionalText,
    location_id: requiredUuid,
    start_date: isoDate("Selecteer een startdatum"),
    end_date: isoDate("Selecteer een einddatum"),
    items: z.array(PlannedItemSchema).min(1, { error: "Plan minimaal één object in" }),
    vehicles: z.array(PlannedVehicleSchema),
  })
  .superRefine((v, ctx) => {
    if (v.end_date < v.start_date) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "Einddatum ligt vóór de startdatum",
      });
    }
    v.vehicles.forEach((veh, i) => {
      if (veh.date < v.start_date || veh.date > v.end_date) {
        ctx.addIssue({
          code: "custom",
          path: ["vehicles", i, "date"],
          message: "Datum valt buiten de projectperiode",
        });
      }
    });
  });

export type ProjectFormInput = z.input<typeof ProjectSchema>;
export type ProjectFormValues = z.output<typeof ProjectSchema>;

export type PlannedItem = z.infer<typeof PlannedItemSchema>;

export type VanDay = z.infer<typeof PlannedVehicleSchema>;

export const EMPTY_PROJECT: ProjectFormInput = {
  name: "",
  start_date: "",
  end_date: "",
  description: "",
  location_id: "",
  projectCode: "",
  items: [],
  vehicles: [],
};
