import { supabase } from "@/lib/browserClient";
import { getCompanyByUserId } from "@/services/companyService";
import { Tables } from "@/types/database.types";
import { useEffect, useState } from "react";

type Company = Tables<"companies">;

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        const company = await getCompanyByUserId(supabase);
        setCompany(company);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);
  return { company, setCompany, loading, error };
}
