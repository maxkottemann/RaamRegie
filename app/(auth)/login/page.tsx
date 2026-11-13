"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Building2,
  CalendarCheck,
  CircleAlert,
  Eye,
  EyeOff,
  FileCheck2,
  LogIn,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/browserClient";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/forms/inputs/input";

const HIGHLIGHTS = [
  { icon: Building2, text: "Alle locaties, verdiepingen en ruimtes op één plek" },
  { icon: CalendarCheck, text: "Jaarplanning en uitvoering per ruimte" },
  { icon: FileCheck2, text: "Werkbonnen en rapportages direct beschikbaar" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // a real <form> submit: Enter works in every field, and password managers recognise it
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setError(
        error.code === "email_not_confirmed"
          ? "Je e-mailadres is nog niet bevestigd. Controleer je inbox."
          : "E-mailadres of wachtwoord is onjuist.",
      );
      setLoading(false);
      return;
    }

    // keep the spinner on while the dashboard loads
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* left: photo panel (desktop only) */}
      <aside className="relative hidden w-[46%] max-w-3xl overflow-hidden bg-nav lg:block">
        <img src="/bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* flat navy tint so the text stays readable on any photo */}
        <div aria-hidden="true" className="absolute inset-0 bg-nav/70" />

        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-3xl leading-tight font-bold tracking-tight">
              Grip op elke ruimte.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/80">
              Plan, registreer en rapporteer facilitaire diensten per ruimte, voor elke locatie.
            </p>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/15">
                    <Icon strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-12 text-xs text-white/60">© {new Date().getFullYear()} Room360</p>
        </div>
      </aside>

      {/* right: the form */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <img src="/fulllogo.png" alt="Room360" className="h-24 w-auto object-contain" />
          </div>

          <div className="rounded-lg border border-line bg-white p-8 shadow-card">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Inloggen</h2>
            <p className="mt-1 text-sm text-muted">Log in met je account om verder te gaan.</p>

            <form onSubmit={handleLogin} noValidate className="mt-7 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-ink">
                  E-mailadres
                </label>
                <Input
                  id="email"
                  type="email"
                  icon={Mail}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <label htmlFor="password" className="text-sm font-medium text-ink">
                    Wachtwoord
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Wachtwoord vergeten?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {showPassword ? (
                      <EyeOff strokeWidth={1.75} className="h-4 w-4" />
                    ) : (
                      <Eye strokeWidth={1.75} className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-md border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger-ink"
                >
                  <CircleAlert
                    strokeWidth={2}
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                icon={LogIn}
                loading={loading}
                disabled={!email.trim() || !password}
                className="w-full"
              >
                Inloggen
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Problemen met inloggen? Neem contact op met de beheerder van je organisatie.
          </p>
        </div>
      </main>
    </div>
  );
}
