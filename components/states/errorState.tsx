"use client";

import Link from "next/link";
import { useId } from "react";
import { RotateCw } from "lucide-react";

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
  const id = useId();
  const handleRetry = onRetry ?? (() => window.location.reload());
  const gradientId = `${id}-gradient`;
  const glassId = `${id}-glass`;

  const content = (
    <div role="alert" className="flex max-w-sm flex-col items-center px-6 text-center">
      <svg
        width={128}
        height={128}
        viewBox="0 0 112 112"
        fill="none"
        aria-hidden="true"
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="12"
            y1="12"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" style={{ stopColor: "var(--brand-primary)" }} />
            <stop offset="100%" style={{ stopColor: "var(--brand-secondary)" }} />
          </linearGradient>
          <clipPath id={glassId}>
            <rect x="20" y="24" width="72" height="68" rx="3" />
          </clipPath>
        </defs>

        {/* soft ambient glow */}
        <rect
          x="12"
          y="16"
          width="88"
          height="84"
          rx="12"
          fill={`url(#${gradientId})`}
          opacity=".1"
        />

        {/* glass and panes, dimmed */}
        <g clipPath={`url(#${glassId})`}>
          <rect x="20" y="24" width="72" height="68" fill={`url(#${gradientId})`} opacity=".08" />
          <rect
            x="23"
            y="27"
            width="31"
            height="29"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".5"
          />
          <rect
            x="58"
            y="27"
            width="31"
            height="29"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".28"
          />
          <rect
            x="23"
            y="61"
            width="31"
            height="28"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".28"
          />
          <rect
            x="58"
            y="61"
            width="31"
            height="28"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".5"
          />

          {/* crack in the top-right pane */}
          <path
            d="M76 27 L71 36 L77 42 L69 50 L73 56"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M71 36 L63 39 M77 42 L86 45 M69 50 L62 53"
            stroke="white"
            strokeOpacity=".75"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>

        {/* frame and dividers */}
        <rect
          x="18"
          y="22"
          width="76"
          height="72"
          rx="5"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
        />
        <path
          d="M56 24V92 M20 58H92"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* shutter housing */}
        <rect x="15" y="14" width="82" height="12" rx="5" fill={`url(#${gradientId})`} />
        <path
          d="M21 20H91"
          stroke="white"
          strokeOpacity=".35"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* window sill */}
        <rect x="11" y="96" width="90" height="5" rx="2.5" fill={`url(#${gradientId})`} />

        {/* error badge */}
        <circle
          cx="96"
          cy="30"
          r="11"
          style={{ fill: "var(--color-danger, #d64545)" }}
          stroke="white"
          strokeWidth="3"
        />
        <path d="M96 24.5V31" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="96" cy="35.2" r="1.5" fill="white" />
      </svg>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <RotateCw strokeWidth={1.75} className="h-4 w-4" />
          Opnieuw proberen
        </button>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {backLabel}
          </Link>
        )}
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="flex h-full items-center justify-center">{content}</div>;
  }

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-background">
      {content}
    </div>
  );
}
