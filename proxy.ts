import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/serverClient";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (pathname.startsWith("/login")) {
    if (!error && data?.claims) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return;
  }

  const role = data?.claims.user_role;

  if (error || !data?.claims) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("auth_id", data.claims.sub)
    .single();

  if (profileError || !profile) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!signup|unauthorized|access-paused|forgot-password|reset-password|tablet/login|api/cron/send-project-reminders|floorscan/login|invite|invite-expired|callback|api/accept-invite|privacyverklaring.pdf|algemene-voorwaarden.pdf|_next/static|_next/image|favicon.ico|logo.svg|smalllogo.png|fulllogo.png|icon-192.png|icon-512.png|logo.png|bg.jpg).*)",
  ],
};
