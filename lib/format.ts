import { format } from "date-fns";
import { nl } from "date-fns/locale";

type AddressParts = {
  street?: string | null;
  number?: string | null;
  postal_code?: string | null;
  city?: string | null;
};

export function formatAddress({ street, number, postal_code, city }: AddressParts) {
  const line1 = [street, number].filter(Boolean).join(" ");
  const line2 = [postal_code, city].filter(Boolean).join(" ");
  return [line1, line2].filter(Boolean).join(", ");
}

export function formatDate(date: string) {
  return format(new Date(date), "dd MMM yyyy", { locale: nl });
}
