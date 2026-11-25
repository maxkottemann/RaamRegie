"use client";

import type { ProjectFormInput } from "@/zodSchemas/projectSchema";
import { CalendarCheck, CalendarDays, ClipboardList, Hash, MapPin } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import FormField from "../formField";
import FormSection from "../formsection";
import DateInput from "../inputs/dateInput";
import Input from "../inputs/input";
import Select from "../inputs/select";
import { useLocationOptionsForPlanning } from "@/hooks/locationHooks";

export default function ProjectBaseFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormInput>();

  const startDate = useWatch({ control, name: "start_date" });
  const { data: locations = [], isPending: locationsPending } = useLocationOptionsForPlanning();

  return (
    <div className="space-y-6">
      {/* Project */}
      <FormSection
        icon={ClipboardList}
        title="Projectgegevens"
        description="Naam en omschrijving van het project"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <FormField id="project-name" label="Naam" error={errors.name?.message}>
            <Input
              id="project-name"
              placeholder="Bijv. Jaarlijks onderhoud AMC 2026"
              invalid={!!errors.name}
              {...register("name")}
            />
          </FormField>

          <FormField id="project-code" label="Projectcode" error={errors.projectCode?.message}>
            <Input
              id="project-code"
              icon={Hash}
              placeholder="052481"
              invalid={!!errors.projectCode}
              {...register("projectCode")}
            />
          </FormField>
        </div>

        <FormField
          id="project-description"
          label="Omschrijving"
          error={errors.description?.message}
        >
          <textarea
            id="project-description"
            rows={3}
            placeholder="Bijv. reiniging van alle gordijnen op de verpleegafdelingen"
            aria-invalid={!!errors.description || undefined}
            className={`w-full resize-y rounded-md border bg-white px-3 py-2 text-sm text-ink transition-colors outline-none placeholder:text-muted/70 hover:border-ink/25 focus:border-primary focus:ring-3 focus:ring-primary/15 ${
              errors.description ? "border-danger" : "border-line"
            }`}
            {...register("description")}
          />
        </FormField>
      </FormSection>

      {/* Location + period */}
      <FormSection
        icon={CalendarDays}
        title="Locatie en periode"
        description="Waar en wanneer wordt het project uitgevoerd?"
      >
        <FormField id="project-location" label="Locatie" error={errors.location_id?.message}>
          <Controller
            control={control}
            name="location_id"
            render={({ field }) => (
              <Select
                id="project-location"
                placeholder={locationsPending ? "Laden…" : "Kies een locatie"}
                options={locations.map((l) => ({
                  value: l.id,
                  label: l.name,
                  description: l.city ?? undefined,
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={locationsPending}
                invalid={!!errors.location_id}
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField id="project-start" label="Startdatum" error={errors.start_date?.message}>
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <DateInput
                  id="project-start"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.start_date}
                />
              )}
            />
          </FormField>

          <FormField id="project-end" label="Einddatum" error={errors.end_date?.message}>
            <Controller
              control={control}
              name="end_date"
              render={({ field }) => (
                <DateInput
                  id="project-end"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.end_date}
                  min={startDate || undefined}
                />
              )}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
}
