"use client";

import ErrorState from "@/components/states/errorState";
import WindowLoader from "@/components/states/loadingState";
import { supabase } from "@/lib/browserClient";
import { getProfile } from "@/services/profileService";
import type { Tables } from "@/types/database.types";
type Profile = Tables<"profiles">;
import { createContext, useContext, useEffect, useState } from "react";

type ProfileContextType = {
  profile: Profile;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const profile = await getProfile(supabase);

        if (!profile) {
          throw new Error("Profile not found");
        }

        setProfile(profile);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) {
    return <WindowLoader />;
  }

  if (error || !profile) {
    return <ErrorState />;
  }

  return <ProfileContext.Provider value={{ profile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}
