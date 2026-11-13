import z from "zod";
import { optionalDate, optionalNumber, optionalText, optionalUuid } from "./helpers/optionals";
import { requiredInt, requiredNumber, requiredUuid } from "./helpers/required";

export const ItemSchema = z.object({
  name: z.string().trim().min(1, "Productnaam is verplicht").max(120, "Maximaal 120 tekens"),
  qr_code_id: optionalText,
  rfid_code: optionalText,
  quantity: requiredInt,
  manufacturer_id: optionalUuid,
});

export const curtainDetailSchema = z.object({
  height: requiredNumber,
  lower_width: requiredNumber,
  upper_width: optionalNumber,
  color: optionalText,
  purchase_date: optionalDate,
  curtain_type_id: requiredUuid,
  material_id: optionalUuid,
});

export const CurtainFormSchema = z.object({
  item: ItemSchema,
  details: curtainDetailSchema,
});

export type ItemBaseInput = z.input<typeof ItemSchema>;
export type CurtainFormInput = z.input<typeof CurtainFormSchema>;
export type CurtainFormValues = z.output<typeof CurtainFormSchema>;

// zodSchemas/itemSchema.ts, below CurtainFormSchema

export const EMPTY_CURTAIN: CurtainFormInput = {
  item: {
    name: "",
    quantity: 1,
    manufacturer_id: "",
    qr_code_id: "",
    rfid_code: "",
  },
  details: {
    purchase_date: "",
    color: "",
    curtain_type_id: "",
    material_id: "",
    height: 0,
    upper_width: "",
    lower_width: 0,
  },
};
