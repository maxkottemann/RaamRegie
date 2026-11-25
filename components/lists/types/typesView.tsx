import { ModuleKey } from "@/modules/types/types";
import { CleaningMethod } from "@/services/cleaningMethodsService";

export type TypeDialog =
  | { type: "create" }
  | { type: "edit"; cleaningMethod: CleaningMethod }
  | { type: "delete"; cleaningMethod: CleaningMethod }
  | null;

export default function TypesView({ module }: { module: ModuleKey }) {}
