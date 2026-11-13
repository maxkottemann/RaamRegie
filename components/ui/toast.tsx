"use client";

import { Check, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";

interface ToastProps {
  message: string;
  type: "error" | "success" | "info" | "warning";
  onClose?: () => void;
}

const STYLES: Record<
  ToastProps["type"],
  { icon: LucideIcon; title: string; badge: string; halo: string; line: string }
> = {
  success: {
    icon: Check,
    title: "Gelukt",
    badge: "bg-success",
    halo: "ring-success/15",
    line: "from-success",
  },
  error: {
    icon: X,
    title: "Er ging iets mis",
    badge: "bg-danger",
    halo: "ring-danger/15",
    line: "from-danger",
  },
  warning: {
    icon: TriangleAlert,
    title: "Let op",
    badge: "bg-warning",
    halo: "ring-warning/20",
    line: "from-warning",
  },
  info: {
    icon: Info,
    title: "Ter info",
    badge: "bg-secondary",
    halo: "ring-secondary/15",
    line: "from-secondary",
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const { icon: Icon, title, badge, halo, line } = STYLES[type];

  return (
    <>
      <style>{`
        @keyframes toast-in {
          0%   { opacity: 0; transform: translateX(calc(100% + 1.5rem)) scale(.96); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .toast-slide { animation: none !important; }
        }
      `}</style>

      <div
        role={type === "error" ? "alert" : "status"}
        aria-live={type === "error" ? "assertive" : "polite"}
        className="toast-slide fixed top-20 right-4 z-[400] w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white/95 shadow-[0_12px_32px_-12px_rgb(30_42_110/0.22),0_2px_6px_-2px_rgb(30_42_110/0.06)] ring-1 ring-ink/[0.06] backdrop-blur-md sm:right-6 sm:w-[22rem]"
        style={{ animation: "toast-in .45s cubic-bezier(.16,1,.3,1) both" }}
      >
        <div className="flex items-center gap-3 py-3 pr-2.5 pl-3.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ring-4 ${badge} ${halo}`}
          >
            <Icon strokeWidth={2.5} className="h-3.5 w-3.5" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-5 font-semibold text-ink">{title}</p>
            <p className="text-[13px] leading-5 text-muted">{message}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Melding sluiten"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center self-start rounded-full text-muted/50 transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X strokeWidth={2} className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* thin colored line along the bottom, fading out to the right */}
        <span
          aria-hidden="true"
          className={`block h-[2px] bg-linear-to-r to-transparent ${line}`}
        />
      </div>
    </>
  );
}
