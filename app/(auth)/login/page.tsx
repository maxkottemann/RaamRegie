"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browserClient";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(true);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden overflow-hidden xl:block xl:w-1/2">
        <img src="/bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t/oklch from-ink/85 via-ink/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <div className="mb-5 h-1 w-12 rounded-full bg-brand" />
          <h2 className="max-w-md text-4xl leading-tight font-semibold tracking-tight text-white">
            Controle over elk raam.
          </h2>
          <p className="mt-3 max-w-sm text-base text-white/70">
            Beheer uw locaties, projecten en ramen vanuit één platform.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-[#F5F6FA] p-6 xl:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="mb-7 flex justify-center">
              <img src="/fulllogo.png" alt="RaamRegie" className="h-30 object-contain" />
            </div>
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#154273]/60 uppercase">
              Welkom terug
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inloggen</h2>
            <p className="mt-1 text-sm text-slate-400">Log in op uw RaamRegie dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-slate-500 uppercase">
                E-mailadres
              </label>
              <input
                type="email"
                placeholder="jan@bedrijf.nl"
                value={email}
                suppressHydrationWarning
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition-all outline-none placeholder:text-slate-300 focus:border-[#154273]/40 focus:ring-2 focus:ring-[#154273]/10"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Wachtwoord
                </label>
                <a
                  href="/forgot-password"
                  className="text-brand text-xs font-semibold transition-colors hover:text-[#154273]/70"
                >
                  Vergeten?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                suppressHydrationWarning
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition-all outline-none placeholder:text-slate-300 focus:border-[#154273]/40 focus:ring-2 focus:ring-[#154273]/10"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                <p className="text-xs font-semibold text-red-600">
                  E-mailadres of wachtwoord incorrect
                </p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#0f2f52] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Inloggen"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
