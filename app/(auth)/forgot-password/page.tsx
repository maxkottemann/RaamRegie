"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/browserClient";
import { CheckCircleIcon } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback`,
    });

    setLoading(false);

    if (error) {
      setError(true);
      return;
    }

    setSent(true);
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
              {sent ? "E-mail verzonden" : "Wachtwoord vergeten"}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {sent ? "Controleer uw inbox" : "Wachtwoord resetten"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {sent
                ? "We hebben u een link gestuurd om een nieuw wachtwoord in te stellen"
                : "Vul uw e-mailadres in en we sturen u een resetlink"}
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
                <CheckCircleIcon className="h-7 w-7 text-primary" />
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                Als er een account bestaat bij <strong>{email}</strong>, ontvangt u binnen enkele
                minuten een e-mail met instructies.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110"
              >
                Terug naar inloggen
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold tracking-widest text-slate-500 uppercase"
                >
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jan@bedrijf.nl"
                  value={email}
                  suppressHydrationWarning
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm transition-all outline-none placeholder:text-slate-300 focus:border-[#154273]/40 focus:ring-2 focus:ring-[#154273]/10"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <p className="text-xs font-semibold text-red-600">
                    Er ging iets mis. Probeer het opnieuw.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand from-primary to-secondary px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Resetlink versturen"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Wachtwoord weer te binnen geschoten?{" "}
              <a
                href="/login"
                className="font-bold text-primary transition-colors hover:text-primary-hover"
              >
                Inloggen
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
