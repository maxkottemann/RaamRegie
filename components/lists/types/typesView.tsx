import { ModuleKey } from "@/modules/types/types";

export type TypeDialog =
  | { type: "create" }
  | { type: "edit"; cleaningMethod: CleaningMethod }
  | { type: "delete"; cleaningMethod: CleaningMethod }
  | null;

export default function TypesView({ module }: { module: ModuleKey }) {}
