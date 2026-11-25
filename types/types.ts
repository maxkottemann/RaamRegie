import { Database } from "./database.types";

export type SelectOption = {
  label: string;
  value: string;
};

export type ProjectStatus = Database["public"]["Enums"]["project_status"];
