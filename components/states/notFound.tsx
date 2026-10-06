"use client";

import { useId } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import { useRouter } from "next/navigation";

interface NotFoundStateProps {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
  fullScreen?: boolean;
}

export default function NotFoundState({
  title = "Niet gevonden",
  message = "Dit item bestaat niet (meer) of je hebt er geen toegang toe.",
  backLabel = "Terug naar vorige pagina",
  fullScreen = false,
}: NotFoundStateProps) {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const glassId = `${id}-glass`;

  const router = useRouter();

  const content = (
    <div className="flex max-w-sm flex-col items-center px-6 text-center">
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

        {/* shutter rolled all the way down: nothing to see behind it */}
        <g clipPath={`url(#${glassId})`}>
          <rect x="20" y="24" width="72" height="68" fill={`url(#${gradientId})`} opacity=".22" />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <path
                d={`M20 ${30 + i * 7} H92`}
                stroke="white"
                strokeOpacity=".55"
                strokeWidth="1.2"
              />
              <path
                d={`M20 ${32 + i * 7} H92`}
                stroke={`url(#${gradientId})`}
                strokeOpacity=".25"
                strokeWidth=".8"
              />
            </g>
          ))}
          <rect x="20" y="86" width="72" height="6" fill={`url(#${gradientId})`} opacity=".5" />
        </g>

        {/* frame */}
        <rect
          x="18"
          y="22"
          width="76"
          height="72"
          rx="5"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
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

        {/* question badge */}
        <circle
          cx="96"
          cy="30"
          r="11"
          fill={`url(#${gradientId})`}
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="M92.6 26.6C92.6 24.6 94.1 23.2 96.1 23.2C98 23.2 99.5 24.5 99.5 26.3C99.5 28.3 97.4 28.9 96.4 30.2C96.1 30.6 96 31.1 96 31.8"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="96" cy="35.6" r="1.4" fill="white" />
      </svg>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>

      <div className="mt-6">
        <Button onClick={() => router.back()} icon={ArrowLeft}>
          {backLabel}
        </Button>
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
