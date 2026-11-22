"use client";

import { SubPageHeader } from "@/components/headers/pageHeader";
import Button from "@/components/ui/buttons/Button";
import ProjectBaseFields from "@/components/ui/forms/projectForms/BaseProjectForms";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/lib/dbErrors";
import { getModule } from "@/modules/registry";
import type { ModuleKey } from "@/modules/types/types";
import {
  EMPTY_PROJECT,
  type ProjectFormInput,
  type ProjectFormValues,
  ProjectSchema,
} from "@/zodSchemas/projectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import FormSection from "@/components/ui/forms/formsection";
import NewProjectSummarySideBar from "./_components/NewProjectSummarySidebar";

export default function NewProjectWizard({ module }: { module: ModuleKey }) {
  const router = useRouter();
  const { showToast } = useToast();

  const mod = getModule(module)!;
  const Planner = mod.ProjectPlanner;

  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: EMPTY_PROJECT,
    mode: "onTouched",
  });

  // hooks at the top, never inside JSX
  const locationId = useWatch({ control: form.control, name: "location_id" });

  function onSubmit(values: ProjectFormValues) {}

  return (
    <div className="flex flex-col gap-6">
      <SubPageHeader
        title="Project toevoegen"
        description="Selecteer objecten en voertuigen voor een project"
      />

      <FormProvider {...form}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <form
            id="project-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex min-w-0 flex-col gap-6"
          >
            {/* 1. name, location, period */}
            <ProjectBaseFields />

            {/* 2. the module's objects */}
            <FormSection
              icon={mod.icon}
              title={mod.label}
              description="Kies welke objecten in dit project worden meegenomen"
            >
              {locationId ? (
                <Controller
                  name="items"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Planner
                        locationId={locationId}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {fieldState.error && (
                        <p role="alert" className="text-sm text-danger">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
                  <Box className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Kies eerst een locatie om objecten in te plannen.
                </div>
              )}
            </FormSection>

            {/* 3. later: <ProjectVehicleFields /> */}

            {/* submit (mobile) */}
            <div className="flex justify-end lg:hidden">
              <Button type="submit" icon={Check}>
                Project aanmaken
              </Button>
            </div>
          </form>

          {/* sidebar */}
          <div className="hidden lg:block">
            <NewProjectSummarySideBar />
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
