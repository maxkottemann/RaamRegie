import { SubPageHeader } from "@/components/headers/pageHeader";
import Button from "@/components/ui/buttons/Button";
import ClientFormFields from "@/components/ui/forms/clientForm";
import { useToast } from "@/context/ToastContext";
import { useUpdateClient } from "@/hooks/clientHooks";
import { REQUIRED_FIELDS } from "@/lib/constants";
import { ClientDetail } from "@/services/clientService";
import { ClientFormInput, ClientFormValues, clientSchema } from "@/zodSchemas/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

export function toClientFormInput(client: NonNullable<ClientDetail>): ClientFormInput {
  return {
    name: client.name,
    street: client.street,
    number: client.number,
    postal_code: client.postal_code,
    city: client.city,
    logo_url: client.logo_url ?? "",
    primary_color: client.primary_color ?? "",
    secondary_color: client.secondary_color ?? "",
    accent_color: client.accent_color ?? "",
    email: client.email ?? "",
    website: client.website ?? "",
    kvk: client.kvk ?? "",
    btw_num: client.btw_num ?? "",
  };
}

export default function EditClientForm({ client }: { client: ClientDetail }) {
  if (!client) return;
  const updateClient = useUpdateClient(client.id);
  const { showToast } = useToast();
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ClientFormInput, unknown, ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onTouched",
    defaultValues: toClientFormInput(client),
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
    updateClient.mutate(formValues, {
      onSuccess: (client) => {
        showToast("Klant aangemaakt", "success");
        router.push(`/clients/${client.id}`);
      },
    });
  }

  return (
    <div className="mx-auto">
      <SubPageHeader
        title="Klant bewerken"
        description="Bewerk de gegevens van de klant"
        icon={User}
        fallbackHref="/clients"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <ClientFormFields register={register} errors={errors} />
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
              {updateClient.error && (
                <p
                  role="alert"
                  className="rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger"
                >
                  De klant kon niet worden aangemaakt. Probeer het opnieuw.
                </p>
              )}
              <Button
                icon={Save}
                disabled={!isDirty}
                type="submit"
                size="lg"
                className="w-full"
                loading={updateClient.isPending}
              >
                Opslaan
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
