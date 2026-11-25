// modules/registry.ts
import { Blinds, BookOpen, Box, Grid3X3 } from "lucide-react";
import { ModuleDefinition, ModuleKey } from "./types/types";
import CurtainInsertForm from "./curtains/itemForm";
import NewCurtainProjectForm from "./curtains/newProjectForm";
import CurtainProjectDetailPage from "./curtains/ProjectDetailPage";

export const MODULES = {
  curtains: {
    key: "curtains",
    label: "Raambekleding",
    icon: Blinds,
    description: "Gordijnen",
    categories: ["curtain"],
    nav: [
      { label: "Objecten", href: "/items", icon: Box },
      { label: "Catalogus", href: "/catalog", icon: BookOpen },
    ],
    ItemForm: CurtainInsertForm,
    ProjectPlanner: NewCurtainProjectForm,
    ProjectDetailPage: CurtainProjectDetailPage,
  },
} satisfies Partial<Record<ModuleKey, ModuleDefinition>>;

export type BuiltModuleKey = keyof typeof MODULES; // only modules that actually exist

export function getModule(key: ModuleKey): ModuleDefinition | null {
  return (MODULES as Partial<Record<ModuleKey, ModuleDefinition>>)[key] ?? null;
}
