"use client";

import { ArrowLeft, RotateCw, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/buttons/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  fullScreen?: boolean;
}

export default function ErrorState({
  title = "Er ging iets fout",
  message = "De pagina kon niet worden geladen. Probeer het opnieuw of ga terug.",
  onRetry,
  backHref,
  backLabel = "Naar dashboard",
  fullScreen = false,
}: ErrorStateProps) {
  const handleRetry = onRetry ?? (() => window.location.reload());

  const content = (
    <div role="alert" className="flex max-w-sm flex-col items-center px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/fulllogo.png" alt="" className="mb-8 h-20 w-auto object-contain" />

      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
        <TriangleAlert strokeWidth={1.75} className="h-6 w-6" aria-hidden="true" />
      </span>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button icon={RotateCw} onClick={handleRetry}>
          Opnieuw proberen
        </Button>
        {backHref && (
          <Button variant="secondary" icon={ArrowLeft} href={backHref}>
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
