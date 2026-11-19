import type { PostgrestError } from "@supabase/supabase-js";

// specific messages per key (hint from your functions)
const HINT_MESSAGES: Record<string, string> = {
  vehicle_not_found: "Dit voertuig bestaat niet",
  not_company_admin: "U heeft niet de juiste rechten voor deze actie",
  name_required: "Naam is verplicht",
};

// fallback per code
const CODE_MESSAGES: Record<string, string> = {
  "42501": "U heeft geen rechten voor deze actie.",
  R0001: "Het object is niet gevonden.",
  "22023": "De ingevoerde gegevens zijn ongeldig.",
  "23505": "Dit bestaat al.",
  "23503": "Dit wordt nog ergens gebruikt en kan niet worden verwijderd.",
  "23514": "Een of meer waarden zijn ongeldig.",
  PGRST202: "Deze actie is niet beschikbaar. Probeer de pagina te verversen.",
};

export function getErrorMessage(error: unknown): string {
  if (!error) return "";

  const e = error as Partial<PostgrestError>;

  if (e.hint && HINT_MESSAGES[e.hint]) return HINT_MESSAGES[e.hint];
  if (e.code && CODE_MESSAGES[e.code]) return CODE_MESSAGES[e.code];

  if (error instanceof TypeError) return "Geen verbinding. Controleer uw internet.";

  return "Er ging iets mis. Probeer het opnieuw.";
}
