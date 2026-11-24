"use client";

import { ProjectFormInput, VanDay } from "@/zodSchemas/projectSchema";
import { format, parseISO } from "date-fns";
import { eachDayOfInterval } from "date-fns/fp";
import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import FormSection from "../formsection";
import { Truck } from "lucide-react";
import { useActiveVehiclesWithEmployees } from "@/hooks/staff/vehicleHooks";

export default function NewProjectVehicleSelector() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormInput>();

  const { data: vehicles, isPending, error } = useActiveVehiclesWithEmployees();

  const values = useWatch({ control });
  const { fields, append, remove, update } = useFieldArray({ control, name: "vehicles" });

  const startDate = values.start_date;
  const endDate = values.end_date;

  const days = eachDayOfInterval({
    start: parseISO(startDate ?? ""),
    end: parseISO(endDate ?? ""),
  }).map((d) => format(d, "yyyy-MM-dd"));

  const [selectedDate, setSelectedDate] = useState<string>(days[0] ?? "");

  const vehiclesOnDay = (date: string) => fields.filter((f) => f.date === date);
  const isOnDay = (date: string, vehicleId: string) =>
    fields.some((f) => f.date === date && f.vehicle_id === vehicleId);

  return (
    <div className="space-y-6">
      <FormSection title="Voertuigen" icon={Truck} description="Selecteer de voertuigen per dag">
        <div></div>
      </FormSection>
    </div>
  );
}
