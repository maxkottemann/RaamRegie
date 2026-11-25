import type { CleaningMethodFormInput } from "@/zodSchemas/cleaningMethodSchema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormSection from "../formsection";
import FormField from "../formField";
import Input from "../inputs/input";
import {
  Calculator,
  Droplet,
  FlaskConical,
  Package,
  Sparkle,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface CleaningMethodFormFieldsProps {
  register: UseFormRegister<CleaningMethodFormInput>;
  errors: FieldErrors<CleaningMethodFormInput>;
  isEditing: boolean;
}

type MetricKey = "water_usage" | "waste_water" | "chemical_usage" | "electricity" | "packaging";

const METRICS: {
  key: MetricKey;
  label: string;
  unit: string;
  icon: LucideIcon;
  placeholderNew: string;
  placeholderOld: string;
}[] = [
  {
    key: "water_usage",
    label: "Waterverbruik",
    unit: "L per m²",
    icon: Droplet,
    placeholderNew: "0,023",
    placeholderOld: "0,046",
  },
  {
    key: "waste_water",
    label: "Afvalwater",
    unit: "L per m²",
    icon: Waves,
    placeholderNew: "0,018",
    placeholderOld: "0,040",
  },
  {
    key: "chemical_usage",
    label: "Chemicaliën",
    unit: "ml per m²",
    icon: FlaskConical,
    placeholderNew: "1,2",
    placeholderOld: "3,5",
  },
  {
    key: "electricity",
    label: "Elektriciteit",
    unit: "kWh per m²",
    icon: Zap,
    placeholderNew: "0,05",
    placeholderOld: "0,12",
  },
  {
    key: "packaging",
    label: "Verpakking",
    unit: "kg per m²",
    icon: Package,
    placeholderNew: "0,05",
    placeholderOld: "0.14",
  },
];

export default function CleaningMethodFormFields({
  register,
  errors,
  isEditing,
}: CleaningMethodFormFieldsProps) {
  return (
    <div className="space-y-6">
      <FormSection
        icon={Sparkle}
        title="Methode"
        description={
          isEditing ? "Wijzig de basisgegevens van deze methode" : "Basisgegevens van de methode"
        }
      >
        <FormField id="method-name" label="Methodenaam" error={errors.name?.message}>
          <Input
            id="method-name"
            placeholder="Bijv. Schrobben"
            invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField id="method-description" label="Omschrijving" error={errors.description?.message}>
          <Input
            id="method-description"
            placeholder="Bijv. Voor grondige reiniging van vitrages"
            invalid={!!errors.description}
            {...register("description")}
          />
        </FormField>
      </FormSection>

      <FormSection
        icon={Calculator}
        title="Milieu-impact"
        description="Vul per onderdeel het verbruik in van deze methode en van de traditionele methode. Laat leeg wat niet van toepassing is."
      >
        {/* column headers */}
        <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-1 text-[11px] font-medium tracking-wider text-muted/80 uppercase sm:grid">
          <span>Onderdeel</span>
          <span>Deze methode</span>
          <span>Traditioneel</span>
        </div>

        <div className="divide-y divide-line overflow-hidden rounded-lg border border-line">
          {METRICS.map(({ key, label, unit, icon: Icon, placeholderNew, placeholderOld }) => {
            const oldKey = `${key}_old` as const;
            const newError = errors[key]?.message;
            const oldError = errors[oldKey]?.message;

            return (
              <div
                key={key}
                className="grid grid-cols-1 gap-3 px-4 py-3.5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-start sm:gap-4"
              >
                {/* label */}
                <div className="flex items-center gap-3 sm:pt-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <Icon strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{label}</p>
                    <p className="text-xs text-muted">{unit}</p>
                  </div>
                </div>

                {/* this method */}
                <FormField id={`method-${key}`} label="Deze methode" error={newError}>
                  <Input
                    id={`method-${key}`}
                    type="number"
                    step="any"
                    inputMode="decimal"
                    placeholder={placeholderNew}
                    invalid={!!newError}
                    {...register(key)}
                  />
                </FormField>

                {/* traditional */}
                <FormField id={`method-${oldKey}`} label="Traditioneel" error={oldError}>
                  <Input
                    id={`method-${oldKey}`}
                    type="number"
                    step="any"
                    inputMode="decimal"
                    placeholder={placeholderOld}
                    invalid={!!oldError}
                    {...register(oldKey)}
                  />
                </FormField>
              </div>
            );
          })}
        </div>
      </FormSection>
    </div>
  );
}
