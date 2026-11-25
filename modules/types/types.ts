import { Database } from "@/types/database.types";
import { PlannedItem } from "@/zodSchemas/projectSchema";
import { LucideIcon } from "lucide-react";
import { Project } from "next/dist/build/swc/types";
import { Component, ComponentType } from "react";

// → "curtains" | "floors" | "chairs"
export type ModuleKey = Database["public"]["Enums"]["module_key"];
export type ItemCategory = Database["public"]["Enums"]["item_category"];

export interface ModuleNavItem {
  label: string;
  href: string; // relative to the module: "/items" → /curtains/items
  icon: LucideIcon;
}

export interface ItemListProps {
  roomId: string;
}

export interface ItemFormProps {
  roomId: string;
  open: boolean;
  onClose: () => void;
}

export interface ProjectPlannerProps {
  locationId: string;
  value: PlannedItem[];
  onChange: (items: PlannedItem[]) => void;
}
export interface ProjectDetailProps {
  projectId: string;
}
export interface ModuleDefinition {
  key: ModuleKey;
  label: string; // "Gordijnen"
  icon: LucideIcon; // Blinds
  description: string;
  categories: ItemCategory[]; // which item categories belong to this module
  nav: ModuleNavItem[]; // extra menu items for this module

  ItemForm: ComponentType<ItemFormProps>;
  ProjectPlanner: ComponentType<ProjectPlannerProps>;
  ProjectDetailPage: ComponentType<ProjectDetailProps>;
}
