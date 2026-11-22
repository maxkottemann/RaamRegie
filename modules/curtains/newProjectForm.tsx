"use client";
import { ProjectPlannerProps } from "../types/types";
import { SelectionProvider } from "@/context/SelectItemContext";
import CurtainStoryList from "./fields/CurtainStoryList";

export default function NewCurtainProjectForm({
  locationId,
  value,
  onChange,
}: ProjectPlannerProps) {
  return (
    <div className="flex flex-col gap-5">
      <SelectionProvider value={value} onChange={onChange} defaultMethodId="">
        <CurtainStoryList locationId={locationId} />
      </SelectionProvider>
    </div>
  );
}
