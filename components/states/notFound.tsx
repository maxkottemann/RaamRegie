"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import Button from "@/components/ui/buttons/Button";

interface NotFoundStateProps {
  title?: string;
  message?: string;
  /** go here instead of the previous page */
  backHref?: string;
  backLabel?: string;
  /** used when there's no previous page (link opened in a new tab) */
  fallbackHref?: string;
  fullScreen?: boolean;
}

export default function NotFoundState({
  title = "Niet gevonden",
  message = "Dit item bestaat niet (meer) of je hebt er geen toegang toe.",
  backHref,
  backLabel = "Terug naar vorige pagina",
  fallbackHref = "/dashboard",
  fullScreen = false,
}: NotFoundStateProps) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  }

  const content = (
    <div className="flex max-w-sm flex-col items-center px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/fulllogo.png" alt="" className="mb-8 h-20 w-auto object-contain" />

      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
        <SearchX strokeWidth={1.75} className="h-6 w-6" aria-hidden="true" />
      </span>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>

      <div className="mt-6">
        {backHref ? (
          <Button href={backHref} icon={ArrowLeft}>
            {backLabel}
          </Button>
        ) : (
          <Button onClick={goBack} icon={ArrowLeft}>
            {backLabel}
          </Button>
        )}
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="flex h-full items-center justify-center py-12">{content}</div>;
  }

  return <div className="flex h-dvh items-center justify-center bg-background">{content}</div>;
}
