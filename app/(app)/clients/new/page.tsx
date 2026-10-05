"use client";

import { SubPageHeader } from "@/components/headers/pageHeader";
import Button from "@/components/ui/buttons/Button";
import FormField from "@/components/ui/forms/formField";
import FormSection from "@/components/ui/forms/formsection";
import Input from "@/components/ui/forms/input";
import { useToast } from "@/context/ToastContext";
import { useCreateClient } from "@/hooks/clientHooks";
import { ClientFormInput, ClientFormValues, clientSchema } from "@/zodSchemas/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Globe,
  Info,
  Landmark,
  Mail,
  MapIcon,
  MapPin,
  ReceiptText,
  Tag,
  User,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

const REQUIRED_FIELDS = ["name", "street", "number", "postal_code", "city"] as const;
export default function NewClientPage() {
  const router = useRouter();
  const createClient = useCreateClient();
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormInput, unknown, ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      city: "",
      postal_code: "",
      street: "",
      number: "",
      logo_url: "",
      primary_color: "",
      secondary_color: "",
      accent_color: "",
      email: "",
      website: "",
      kvk: "",
      btw_num: "",
    },
  });

  const values = useWatch({ control });

  const filled = REQUIRED_FIELDS.filter((key) => {
    const value = values[key];
    return typeof value === "string" && value.trim() !== "" && !errors[key];
  }).length;
  const progress = Math.round((filled / REQUIRED_FIELDS.length) * 100);

  const addressLine = [values.street, values.number].filter((v) => v?.trim()).join(" ");
  const cityLine = [values.postal_code, values.city].filter((v) => v?.trim()).join("  ");

  function onSubmit(formValues: ClientFormValues) {
    createClient.mutate(formValues, {
      onSuccess: (client) => {
        showToast("Klant aangemaakt", "success");
        router.push(`clients/${client.id}`);
      },
      onError: () => {
        showToast("Kon klant niet aanmaken", "error");
      },
    });
  }

  return (
    <div className="mx-auto">
      <SubPageHeader
        title="Nieuwe klant"
        description="Voeg een nieuwe klant toe"
        icon={User}
        fallbackHref="/locations"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="space-y-6">
          <FormSection icon={User} title="Klant" description="Vul de naam van de klant in">
            <FormField id="name" label="Naam" error={errors.name?.message}>
              <Input
                id="name"
                icon={Building2}
                placeholder="Bijv. Nepbedrijf B.V"
                invalid={!!errors.name}
                {...register("name")}
              />
            </FormField>
          </FormSection>

          <FormSection icon={MapIcon} title="Adres" description="Vul het adres van de klant in">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_8rem]">
              <FormField id="street" label="Straat" error={errors.street?.message}>
                <Input
                  id="street"
                  icon={MapPin}
                  autoComplete="address-line1"
                  invalid={!!errors.street}
                  {...register("street")}
                />
              </FormField>
              <FormField id="number" label="Huisnummer" error={errors.number?.message}>
                <Input id="number" invalid={!!errors.number} {...register("number")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <FormField id="postal_code" label="Postcode" error={errors.postal_code?.message}>
                <Input
                  id="postal_code"
                  autoComplete="postal-code"
                  placeholder="1234 AB"
                  invalid={!!errors.postal_code}
                  {...register("postal_code")}
                />
              </FormField>
              <FormField id="city" label="Plaats" error={errors.city?.message}>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  invalid={!!errors.city}
                  {...register("city")}
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            icon={Tag}
            title="Klantgegevens"
            description="Vul extra gegevens van de klant in"
          >
            <div className="grid grid-cols-2 gap-5">
              <FormField id="email" label="E-mailadres" optional error={errors.email?.message}>
                <Input
                  id="email"
                  icon={Mail}
                  invalid={!!errors.email}
                  {...register("email")}
                ></Input>
              </FormField>
              <FormField id="website" label="Website" optional error={errors.website?.message}>
                <Input
                  id="email"
                  icon={Globe}
                  invalid={!!errors.website}
                  {...register("website")}
                ></Input>
              </FormField>
              <FormField id="kvk" label="KVK Nummer" optional error={errors.kvk?.message}>
                <Input
                  id="email"
                  icon={Landmark}
                  invalid={!!errors.kvk}
                  {...register("email")}
                ></Input>
              </FormField>
              <FormField id="btw" label="BTW Nummer" optional error={errors.btw_num?.message}>
                <Input
                  id="btw"
                  icon={ReceiptText}
                  invalid={!!errors.btw_num}
                  {...register("website")}
                ></Input>
              </FormField>
            </div>
          </FormSection>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="h-1 bg-brand" />

            <div className="p-5">
              <p className="text-[11px] font-medium tracking-wider text-muted/70 uppercase">
                Overzicht
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
                  <User strokeWidth={1.75} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${values.name?.trim() ? "text-ink" : "text-muted/50"}`}
                  >
                    {values.name?.trim() || "Naam van de klant"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-0.5 rounded-lg bg-surface px-3 py-2.5 text-xs">
                <p className={addressLine ? "text-ink" : "text-muted/50"}>
                  {addressLine || "Straat en huisnummer"}
                </p>
                <p className={cityLine ? "text-ink" : "text-muted/50"}>
                  {cityLine || "Postcode en plaats"}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">Verplichte velden</span>
                  <span className="text-muted tabular-nums">
                    {filled} van {REQUIRED_FIELDS.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-line p-5">
              {createClient.error && (
                <p
                  role="alert"
                  className="rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger"
                >
                  De klant kon niet worden aangemaakt. Probeer het opnieuw.
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" loading={createClient.isPending}>
                Klant aanmaken
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.back()}>
                Annuleren
              </Button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
