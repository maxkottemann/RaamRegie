import EmployeeFormFields from "@/components/ui/forms/employeeForms/EmployeeForm";
import AddModal from "@/components/ui/modals/addModal";
import { useToast } from "@/context/ToastContext";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/staff/employeeHooks";
import { getErrorMessage } from "@/lib/dbErrors";
import { Employee } from "@/services/staff/employeeService";
import { EmployeeFormInput, EmployeeFormValues, EmployeeSchema } from "@/zodSchemas/employeeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EmployeeFormModalProps {
  open: boolean;
  employee?: Employee | undefined; // undefined = create, otherwise edit
  onClose: () => void;
}

export const EMPTY_EMPLOYEE: EmployeeFormInput = {
  name: "",
  profile_id: "",
  vehicle_ids: [],
};

export function employeeToForm(e: Employee): EmployeeFormInput {
  return {
    name: e.name,
    profile_id: e.profile_id ?? "",
    vehicle_ids: e.vans.map((v) => v.id),
  };
}

export default function EmployeeFormModal({ open, employee, onClose }: EmployeeFormModalProps) {
  const isEdit = !!employee;
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const mutation = isEdit ? updateEmployee : createEmployee;

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<EmployeeFormInput, unknown, EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    mode: "onTouched",
    defaultValues: {
      ...EMPTY_EMPLOYEE,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(employee ? employeeToForm(employee) : EMPTY_EMPLOYEE);
    createEmployee.reset();
    updateEmployee.reset();
  }, [open, employee, reset]);

  function onSubmit(values: EmployeeFormValues) {
    const options = {
      onSuccess: () => {
        showToast(isEdit ? "Voertuig bijgewerkt" : "Voertuig toegevoegd", "success");
        onClose();
      },
      onError: (error: unknown) => showToast(getErrorMessage(error), "error"),
    };

    if (isEdit) {
      updateEmployee.mutate({ employeeId: employee.id, values }, options);
    } else {
      createEmployee.mutate(values, options);
    }
  }

  return (
    <AddModal
      size="lg"
      open={open}
      onClose={onClose}
      icon={isEdit ? Edit : UserPlus}
      title={isEdit ? "Medewerker bewerken" : "Medewerker toevoegen"}
      description={
        isEdit
          ? `Wijzig de gegevens van ${employee.name}`
          : "Voeg een medewerker toe aan uw team om hem/haar in te planner"
      }
      submitLabel={isEdit ? "Opslaan" : "Toevoegen"}
      loading={mutation.isPending}
      submitDisabled={isEdit && !isDirty}
      onSubmit={handleSubmit(onSubmit)}
    >
      <EmployeeFormFields
        register={register}
        control={control}
        errors={errors}
        isEditing={isEdit}
      />
    </AddModal>
  );
}
