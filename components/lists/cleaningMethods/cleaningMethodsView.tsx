// CleaningMethodsView.tsx
"use client";

import { useCleaningMethodsByModule } from "@/hooks/cleaningMethodHooks";
import { ModuleKey } from "@/modules/types/types";
import { useState } from "react";
import CleaningMethodList from "./CleaningMethodList";
import CleaningMethodModal from "@/app/(app)/settings/cleaning_methods/_components/cleaningMethodModal";
import SettingsHeader from "@/components/headers/settingsHeader";
import { Plus, Sparkle } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import DeleteCleaningMethodModal from "@/app/(app)/settings/cleaning_methods/_components/cleaningMethodDeleteModal";
import { CleaningMethod } from "@/services/cleaningMethodsService";

export type CleaningMethodDialog =
  | { type: "create" }
  | { type: "edit"; cleaningMethod: CleaningMethod }
  | { type: "delete"; cleaningMethod: CleaningMethod }
  | null;

export default function CleaningMethodsView({ module }: { module: ModuleKey }) {
  const { data: methods = [] } = useCleaningMethodsByModule(module);
  const [dialog, setDialog] = useState<CleaningMethodDialog>(null);

  return (
    <>
      <SettingsHeader
        icon={Sparkle}
        title="Methodes"
        description="Beheer uw methodes"
        actions={
          <Button size="sm" icon={Plus} onClick={() => setDialog({ type: "create" })}>
            Toevoegen
          </Button>
        }
      />
      <CleaningMethodList
        module={module}
        cleaningMethods={methods}
        onEdit={(method) => setDialog({ type: "edit", cleaningMethod: method })}
        onDelete={(method) => setDialog({ type: "delete", cleaningMethod: method })}
      />

      <CleaningMethodModal
        module={module}
        onClose={() => setDialog(null)}
        open={dialog?.type === "create" || dialog?.type === "edit"}
        cleaningMethod={dialog?.type === "edit" ? dialog.cleaningMethod : undefined}
      />
      <DeleteCleaningMethodModal
        onClose={() => setDialog(null)}
        open={dialog?.type === "delete"}
        cleaningMethod={dialog?.type === "delete" ? dialog.cleaningMethod : undefined}
      />
    </>
  );
}
