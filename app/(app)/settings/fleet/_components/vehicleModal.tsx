import VehicleFormFields from "@/components/ui/forms/vehicleForms/vehicleForm";
import AddModal from "@/components/ui/modals/addModal";
import { useTheme } from "@/context/ThemeProviderContext";
import { useToast } from "@/context/ToastContext";
import { useCreateVehicle, useUpdateVehicle } from "@/hooks/staff/vehicleHooks";
import { getErrorMessage } from "@/lib/dbErrors";
import { VehicleBasic } from "@/services/staff/vehicleService";
import { VehicleFormInput, VehicleFormValues, VehicleSchema } from "@/zodSchemas/vehicleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

interface VehicleFormModalProps {
  open: boolean;
  vehicle?: VehicleBasic | undefined; // undefined = create, otherwise edit
  onClose: () => void;
}

export const EMPTY_VEHICLE: VehicleFormInput = {
  name: "",
  license_plate: "",
  street: "",
  number: "",
  postal_code: "",
  city: "",
  co2: "",
  co2_old: "",
};

export function vehicleToForm(v: VehicleBasic): VehicleFormInput {
  return {
    name: v.name,
    license_plate: v.license_plate ?? "",
    street: v.street ?? "",
    number: v.number ?? "",
    postal_code: v.postal_code ?? "",
    city: v.city ?? "",
    co2: v.co2 != null ? String(v.co2) : "",
    co2_old: v.co2_old != null ? String(v.co2_old) : "",
  };
}

export default function VehicleFormModal({ open, vehicle, onClose }: VehicleFormModalProps) {
  const isEdit = !!vehicle;
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const mutation = isEdit ? updateVehicle : createVehicle;

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isDirty },
  } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(VehicleSchema),
    mode: "onTouched",
    defaultValues: {
      ...EMPTY_VEHICLE,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(vehicle ? vehicleToForm(vehicle) : EMPTY_VEHICLE);
    createVehicle.reset();
    updateVehicle.reset();
  }, [open, vehicle, reset]);

  function onSubmit(values: VehicleFormValues) {
    const options = {
      onSuccess: () => {
        showToast(isEdit ? "Voertuig bijgewerkt" : "Voertuig toegevoegd", "success");
        onClose();
      },
      onError: (error: unknown) => showToast(getErrorMessage(error), "error"),
    };

    if (isEdit) {
      updateVehicle.mutate({ vehicleId: vehicle.id, values }, options);
    } else {
      createVehicle.mutate(values, options);
    }
  }

  return (
    <AddModal
      size="lg"
      icon={isEdit ? Edit : Plus}
      open={open}
      onClose={onClose}
      title={isEdit ? "Voertuig bewerken" : "Voertuig toevoegen"}
      description={
        isEdit
          ? `Wijzig de gegevens van ${vehicle.name}`
          : "Voeg een voertuig toe aan uw vloot om het te kunnen inplannen"
      }
      submitLabel={isEdit ? "Opslaan" : "Toevoegen"}
      loading={mutation.isPending}
      submitDisabled={isEdit && !isDirty}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VehicleFormFields register={register} errors={errors} isEditing={isEdit} />
    </AddModal>
  );
}
