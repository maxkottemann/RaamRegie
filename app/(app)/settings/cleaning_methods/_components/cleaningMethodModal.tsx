import { useToast } from "@/context/ToastContext";
import { useCreateCleaningMethod, useUpdateCleaningMethod } from "@/hooks/cleaningMethodHooks";
import { CleaningMethod } from "@/services/cleaningMethodsService";
import {
  CleaningMethodFormInput,
  CleaningMethodFormValues,
  CleaningMethodSchema,
} from "@/zodSchemas/cleaningMethodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getErrorMessage } from "@/lib/dbErrors";
import { ModuleKey } from "@/modules/types/types";
import AddModal from "@/components/ui/modals/addModal";
import { Edit, Plus } from "lucide-react";
import CleaningMethodFormFields from "@/components/ui/forms/cleaningMethodForm/cleaningMethodForm";

interface CleaningMethodModalProps {
  open: boolean;
  cleaningMethod?: CleaningMethod | undefined; // undefined = create, otherwise edit
  onClose: () => void;
  module: ModuleKey;
}

export const EMPTY_CLEANING_METHOD: CleaningMethodFormInput = {
  name: "",
  description: "",
  water_usage: "",
  waste_water: "",
  chemical_usage: "",
  electricity: "",
  packaging: "",
  water_usage_old: "",
  waste_water_old: "",
  chemical_usage_old: "",
  electricity_old: "",
  packaging_old: "",
};

// null from the database → "" for the input; number → string
const toInput = (value: number | null) => (value == null ? "" : String(value));

export function cleaningMethodToForm(method: CleaningMethod): CleaningMethodFormInput {
  return {
    name: method.name,
    description: method.description ?? "",
    water_usage: toInput(method.water_usage),
    waste_water: toInput(method.waste_water),
    chemical_usage: toInput(method.chemical_usage),
    electricity: toInput(method.electricity),
    packaging: toInput(method.packaging),
    water_usage_old: toInput(method.water_usage_old),
    waste_water_old: toInput(method.waste_water_old),
    chemical_usage_old: toInput(method.chemical_usage_old),
    electricity_old: toInput(method.electricity_old),
    packaging_old: toInput(method.packaging_old),
  };
}

export default function CleaningMethodModal({
  open,
  cleaningMethod,
  onClose,
  module,
}: CleaningMethodModalProps) {
  const isEdit = !!cleaningMethod;
  const createCleaningMethod = useCreateCleaningMethod();
  const updateCleaningMethod = useUpdateCleaningMethod();
  const mutation = isEdit ? updateCleaningMethod : createCleaningMethod;

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CleaningMethodFormInput, unknown, CleaningMethodFormValues>({
    resolver: zodResolver(CleaningMethodSchema),
    mode: "onTouched",
    defaultValues: {
      ...EMPTY_CLEANING_METHOD,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(cleaningMethod ? cleaningMethodToForm(cleaningMethod) : EMPTY_CLEANING_METHOD);
    createCleaningMethod.reset();
    updateCleaningMethod.reset();
  }, [open, reset, cleaningMethod]);

  function onSubmit(values: CleaningMethodFormValues) {
    if (!module) return;
    const options = {
      onSuccess: () => {
        showToast(isEdit ? "Methode bijgewerkt" : "Methode toegevoegd", "success");
        onClose();
      },
      onError: (error: unknown) => {
        showToast(getErrorMessage(error), "error");
      },
    };
    if (isEdit) {
      updateCleaningMethod.mutate(
        { cleaningMethodId: cleaningMethod.id, values, module: module },
        options,
      );
    } else {
      createCleaningMethod.mutate({ values, module }, options);
    }
  }
  return (
    <AddModal
      size="lg"
      icon={isEdit ? Edit : Plus}
      open={open}
      onClose={onClose}
      title={isEdit ? "Methode bewerken" : "Methode toevoegen"}
      description={
        isEdit
          ? `Wijzig de gegevens van ${cleaningMethod.name}`
          : "Voeg een methode toe om deze kunnen te gebruiken voor objecten"
      }
      submitLabel={isEdit ? "Opslaan" : "Toevoegen"}
      loading={mutation.isPending}
      submitDisabled={isEdit && !isDirty}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CleaningMethodFormFields register={register} errors={errors} isEditing={isEdit} />
    </AddModal>
  );
}
