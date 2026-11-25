"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useCompany } from "@/hooks/companyHooks";
import { useProfile } from "@/context/ProfileContext";
import { supabase } from "@/lib/browserClient";
import LoadingState from "@/components/states/loadingState";

/*
 * White-label theme: the two brand colors from globals.css.
 *   primary → --brand-primary (buttons, links, active nav item)
 *   nav     → --brand-nav     (sidebar / top bar)
 * Hover and soft variants are derived in CSS, so only these two are set here.
 * A missing color is simply not set, so the default from :root in globals.css applies.
 */

interface Theme {
  primary: string | null;
  nav: string | null;
}

const NO_THEME: Theme = { primary: null, nav: null };

const ThemeContext = createContext<Theme>(NO_THEME);

const HEX = /^#[0-9a-f]{6}$/i;
const valid = (color: string | null | undefined) => (color && HEX.test(color) ? color : null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { company, loading: companyLoading } = useCompany();
  const { profile } = useProfile();
  const [theme, setTheme] = useState<Theme | null>(null); // null = still resolving

  useEffect(() => {
    let cancelled = false;

    async function resolveTheme() {
      const isCompanyUser = profile.role === "company_admin" || profile.role === "company_employee";
      const isClientUser = profile.role === "client_admin" || profile.role === "client_viewer";

      // company users: their own company's colors
      if (isCompanyUser) {
        if (companyLoading) return; // wait for the company, then this effect runs again
        return finish({
          primary: valid(company?.primary_color),
          nav: valid(company?.secondary_color),
        });
      }

      // client users: the colors of the company that serves them (only if there is exactly one)
      if (isClientUser && profile.client_id) {
        const { data, error } = await supabase
          .from("company_clients")
          .select("companies(primary_color, secondary_color)")
          .eq("client_id", profile.client_id);

        if (!error && data?.length === 1) {
          const c = data[0].companies;
          return finish({ primary: valid(c?.primary_color), nav: valid(c?.secondary_color) });
        }
      }

      // super admin, several companies, or something went wrong: the Room360 defaults
      finish(NO_THEME);
    }

    function finish(next: Theme) {
      if (!cancelled) setTheme(next);
    }

    resolveTheme().catch(() => finish(NO_THEME));

    return () => {
      cancelled = true;
    };
  }, [company, companyLoading, profile]);

  if (!theme) return <LoadingState fullScreen />;

  // only override what the tenant actually set
  const style = {
    ...(theme.primary && { "--brand-primary": theme.primary }),
    ...(theme.nav && { "--brand-nav": theme.nav }),
  } as CSSProperties;

  return (
    <ThemeContext.Provider value={theme}>
      {/* "contents": the wrapper adds no box, so it never breaks your layout; CSS variables still inherit */}
      <div className="contents" style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
