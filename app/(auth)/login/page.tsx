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
              Welkom terug
            </p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inloggen
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Log in op uw RaamRegie dashboard
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                placeholder="jan@bedrijf.nl"
                value={email}
                suppressHydrationWarning
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#154273]/40 focus:ring-2 focus:ring-[#154273]/10 placeholder:text-slate-300 transition-all shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                  Wachtwoord
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-brand hover:text-[#154273]/70 font-semibold transition-colors"
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
                className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#154273]/40 focus:ring-2 focus:ring-[#154273]/10 placeholder:text-slate-300 transition-all shadow-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <p className="text-xs font-semibold text-red-600">
                  E-mailadres of wachtwoord incorrect
                </p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand hover:bg-[#0f2f52] disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
