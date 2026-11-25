import { Armchair, BedSingle, Blinds, Box, BrickWall, Grid3x3, LucideIcon } from "lucide-react";

export const REQUIRED_FIELDS = ["name", "street", "number", "postal_code", "city"] as const;
export const REQUIRED_FIELDS_LOCATION = [
  "name",
  "street",
  "number",
  "postal_code",
  "city",
  "client_id",
] as const;

export const ITEM_CATEGORY: Record<string, { label: string; icon: LucideIcon }> = {
  curtain: { label: "Gordijn", icon: Blinds },
  chair: { label: "Stoel", icon: Armchair },
  bed: { label: "Bed", icon: BedSingle },
  table: { label: "Tafel", icon: Box },
  floor: { label: "Vloer", icon: Grid3x3 },
  wall: { label: "Wand", icon: BrickWall },
  other: { label: "Overig", icon: Box },
};

/* status → label + pill colors; unknown values fall back to a neutral pill */
export const ITEM_STATE: Record<string, { label: string; pill: string; dot: string }> = {
  in_room: { label: "In ruimte", pill: "bg-success-soft text-success-ink", dot: "bg-success" },
  in_laundry: { label: "In de was", pill: "bg-info-soft text-info-ink", dot: "bg-info" },
  in_storage: { label: "Op voorraad", pill: "bg-surface text-muted", dot: "bg-muted" },
  in_repair: { label: "In reparatie", pill: "bg-warning-soft text-warning-ink", dot: "bg-warning" },
  retired: { label: "Afgevoerd", pill: "bg-danger-soft text-danger-ink", dot: "bg-danger" },
};

export const QUALITY: Record<string, { label: string; level: 1 | 2 | 3; color: string }> = {
  good: { label: "Goed", level: 3, color: "bg-success" },
  fair: { label: "Matig", level: 2, color: "bg-warning" },
  poor: { label: "Slecht", level: 1, color: "bg-danger" },
};
