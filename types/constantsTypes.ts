// types/itemTypes.ts

import { Constants, Database } from "./database.types";

/** the type: "curtain" | "floor" | "chair" | "bed" | "lighting" | "sheets" | "closet" */
export type ItemCategory = Database["public"]["Enums"]["item_category"];

/** the values as an array, for dropdowns and validation */
export const ITEM_CATEGORIES = Constants.public.Enums.item_category;
