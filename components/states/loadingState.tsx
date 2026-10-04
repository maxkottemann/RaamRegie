
import { useId } from "react";

type WindowLoaderProps = {
  fullScreen?: boolean;
  size?: number;
  label?: string;
};

export default function WindowLoader({
  fullScreen = false,
  size = 144,
  label = "Laden…",
}: WindowLoaderProps) {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const glassId = `${id}-glass`;
  const shineId = `${id}-shine`;
  const shutterId = `${id}-shutter`;

  const loader = (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center gap-5"
    >
      <svg
        width={size}
        height={size}
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
            <stop
              offset="0%"
              style={{ stopColor: "var(--color-primary)" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--color-secondary)" }}
            />
          </linearGradient>

          <linearGradient
            id={shineId}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity=".8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <clipPath id={glassId}>
            <rect x="20" y="24" width="72" height="68" rx="3" />
          </clipPath>

          <clipPath id={shutterId}>
            <rect x="20" y="24" width="72" height="68" rx="2" />
          </clipPath>
        </defs>

        <style>{`
          .wl-halo {
            animation: wl-halo 3.6s ease-in-out infinite;
          }

          .wl-shutter {
            animation: wl-shutter 3.6s cubic-bezier(.65, 0, .35, 1)
              infinite;
          }

          .wl-glass-shine {
            animation: wl-shine 3.6s ease-in-out infinite;
          }

          .wl-spinner {
            transform-origin: center;
            animation: wl-spin 1s linear infinite;
          }

          @keyframes wl-shutter {
            0%, 8% {
              transform: translateY(-68px);
            }
            38%, 58% {
              transform: translateY(0);
            }
            88%, 100% {
              transform: translateY(-68px);
            }
          }

          @keyframes wl-halo {
            0%, 8%, 88%, 100% {
              opacity: .12;
            }
            38%, 58% {
              opacity: .35;
            }
          }

          @keyframes wl-shine {
            0%, 12% {
              transform: translateX(-90px);
              opacity: 0;
            }
            28% {
              opacity: .9;
            }
            58% {
              transform: translateX(100px);
              opacity: .9;
            }
            72%, 100% {
              transform: translateX(100px);
              opacity: 0;
            }
          }

          @keyframes wl-spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .wl-halo,
            .wl-shutter,
            .wl-glass-shine,
            .wl-spinner {
              animation: none;
            }
            .wl-shutter {
              transform: translateY(-68px);
            }
          }
        `}</style>

        {/* Soft ambient glow */}
        <rect
          className="wl-halo"
          x="12"
          y="16"
          width="88"
          height="84"
          rx="12"
          fill={`url(#${gradientId})`}
          opacity=".15"
        />

        {/* Glass and four gradient panes */}
        <g clipPath={`url(#${glassId})`}>
          <rect
            x="20"
            y="24"
            width="72"
            height="68"
            fill={`url(#${gradientId})`}
            opacity=".13"
          />

          <rect
            x="23"
            y="27"
            width="31"
            height="29"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".72"
          />
          <rect
            x="58"
            y="27"
            width="31"
            height="29"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".4"
          />
          <rect
            x="23"
            y="61"
            width="31"
            height="28"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".4"
          />
          <rect
            x="58"
            y="61"
            width="31"
            height="28"
            rx="2"
            fill={`url(#${gradientId})`}
            opacity=".72"
          />

          {/* Light reflection across the glass */}
          <rect
            className="wl-glass-shine"
            x="32"
            y="15"
            width="12"
            height="95"
            fill={`url(#${shineId})`}
            transform="rotate(20 56 56)"
          />
        </g>

        {/* Roller shutter: drops over the glass, then rolls up */}
        <g clipPath={`url(#${shutterId})`}>
          <g className="wl-shutter">
            <rect
              x="19"
              y="18"
              width="74"
              height="76"
              rx="2"
              fill={`url(#${gradientId})`}
            />

            {/* Individual shutter slats */}
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i}>
                <path
                  d={`M20 ${22 + i * 7.2} H92`}
                  stroke="white"
                  strokeOpacity=".25"
                  strokeWidth="1.2"
                />
                <path
                  d={`M20 ${24 + i * 7.2} H92`}
                  stroke="var(--color-ink)"
                  strokeOpacity=".12"
                  strokeWidth=".8"
                />
              </g>
            ))}

            {/* Bottom bar of the roller shutter */}
            <rect
              x="18"
              y="87"
              width="76"
              height="6"
              rx="2"
              fill={`url(#${gradientId})`}
            />
            <path
              d="M22 88 H90"
              stroke="white"
              strokeOpacity=".4"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Permanent frame and window dividers */}
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

        {/* Shutter housing */}
        <rect
          x="15"
          y="14"
          width="82"
          height="12"
          rx="5"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M21 20H91"
          stroke="white"
          strokeOpacity=".35"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Window sill */}
        <rect
          x="11"
          y="96"
          width="90"
          height="5"
          rx="2.5"
          fill={`url(#${gradientId})`}
        />
      </svg>

      {/* Loading spinner and label */}
      <div className="flex items-center gap-2.5">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`${gradientId}-spinner`}
              x1="0"
              y1="0"
              x2="24"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                style={{ stopColor: "var(--color-primary)" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "var(--color-secondary)" }}
              />
            </linearGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke={`url(#${gradientId}-spinner)`}
            strokeOpacity=".18"
            strokeWidth="3"
          />
          <path
            className="wl-spinner"
            d="M12 3 A9 9 0 0 1 21 12"
            stroke={`url(#${gradientId}-spinner)`}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <p className="text-sm font-medium text-muted">{label}</p>
      </div>
    </div>
  );

  if (!fullScreen) return loader;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {loader}
    </div>
  );
}