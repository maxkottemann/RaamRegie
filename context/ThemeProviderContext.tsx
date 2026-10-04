"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useCompany } from "@/hooks/companyHooks";
import { useProfile } from "@/context/ProfileContext";
import { supabase } from "@/lib/browserClient";
import WindowLoader from "@/components/states/loadingState";

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

const defaultTheme: Theme = {
  primary: "#154273",
  secondary: "#3ab8bf",
  accent: "#f5a623",
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { company } = useCompany();
  const { profile } = useProfile();
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    async function resolveTheme() {
      if (!profile) return;

      try {
        if (
          profile.role === "company_admin" ||
          profile.role === "company_employee"
        ) {
          if (!company) return;
          applyTheme({
            primary: company.primary_color ?? defaultTheme.primary,
            secondary: company.secondary_color ?? defaultTheme.secondary,
            accent: company.accent_color ?? defaultTheme.accent,
          });
          setThemeLoaded(true);
          return;
        }

        if (
          (profile.role === "client_admin" ||
          profile.role === "client_viewer") && profile.client_id
        ) {
        const {data:companies} = await supabase
        .from("company_clients")
        .select("companies(primary_color,secondary_color,accent_color)")
        .eq("client_id",profile.client_id)


        if(!companies?.length){
          applyTheme(defaultTheme)
          setThemeLoaded(true)
        }

          if (companies?.length === 1) {
              applyTheme({
                primary: companies[0]?.companies.primary_color ?? defaultTheme.primary,
                secondary:
                  companies[0]?.companies.secondary_color ?? defaultTheme.secondary,
                accent: companies[0]?.companies.accent_color ?? defaultTheme.accent,
              });
              setThemeLoaded(true);
              return;
          }

          applyTheme(defaultTheme);
          setThemeLoaded(true);
          return;
        }

        applyTheme(defaultTheme);
        setThemeLoaded(true);
      } catch {
        applyTheme(defaultTheme);
        setThemeLoaded(true);
      } 
    }

    resolveTheme();
  }, [company, profile]);

  function applyTheme(t: Theme) {
    setTheme(t);
  }

  if (!themeLoaded){ 
    console.log('irun')
  return <WindowLoader />;
  }
  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={
          {
            "--color-primary": theme.primary,
            "--color-secondary": theme.secondary,
            "--color-accent": theme.accent,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
