import { headers } from "next/headers";
import type { ModuleKey } from "@/modules/types/types";

export interface Brand {
  key: string;
  name: string;
  tagline?: string;
  logo: string;
  favicon: string;
  module: ModuleKey | null; // null = Room360: all modules
}

const ROOM360: Brand = {
  key: "room360",
  name: "Room360",
  logo: "/fulllogo.png",
  favicon: "/favicon.ico",
  module: null,
};

const CURTAINCONTROL: Brand = {
  key: "curtaincontrol",
  name: "CurtainControl",
  tagline: "",
  logo: "/brands/curtaincontrol.png",
  favicon: "/brands/curtaincontrol.ico",
  module: "curtains",
};

/** domain → brand */
export const BRANDS: Record<string, Brand> = {
  // production
  "app.room360.nl": ROOM360,
  "curtaincontrol.nl": CURTAINCONTROL,

  // local development
  localhost: ROOM360,
  "app.localhost": ROOM360,
  "curtains.localhost": CURTAINCONTROL,
};

export async function getBrand(): Promise<Brand> {
  const host =
    (await headers())
      .get("host")
      ?.replace(/^www\./, "")
      .split(":")[0] ?? "";
  return BRANDS[host] ?? ROOM360;
}
