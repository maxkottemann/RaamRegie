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
    <div className="min-h-screen flex">
      <div className="hidden xl:block xl:w-1/2 relative overflow-hidden">
        <img
          src="/bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t/oklch from-ink/85 via-ink/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <div className="mb-5 h-1 w-12 rounded-full bg-brand" />
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
            Controle over elk raam.
          </h2>
          <p className="mt-3 max-w-sm text-base text-white/70">
            Beheer uw locaties, projecten en ramen vanuit één platform.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 xl:p-12 bg-[#F5F6FA]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex justify-center mb-7">
              <img
                src="/fulllogo.png"
                alt="RaamRegie"
                className="h-30 object-contain"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#154273]/60 mb-2">
              {sent ? "E-mail verzonden" : "Wachtwoord vergeten"}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {sent ? "Controleer uw inbox" : "Wachtwoord resetten"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {sent
                ? "We hebben u een link gestuurd om een nieuw wachtwoord in te stellen"
                : "Vul uw e-mailadres in en we sturen u een resetlink"}
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center">
                <CheckCircleIcon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Als er een account bestaat bij <strong>{email}</strong>, ontvangt u binnen
                enkele minuten een e-mail met instructies.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand hover:brightness-110 text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer mt-2"
              >
                Terug naar inloggen
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2"
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
                  className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#154273]/40 focus:ring-2 focus:ring-[#154273]/10 placeholder:text-slate-300 transition-all shadow-sm"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <p className="text-xs font-semibold text-red-600">
                    Er ging iets mis. Probeer het opnieuw.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand from-primary to-secondary hover:brightness-110 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  "Resetlink versturen"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-400">
              Wachtwoord weer te binnen geschoten?{" "}
              <a
                href="/login"
                className="text-primary font-bold hover:text-primary-hover transition-colors"
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