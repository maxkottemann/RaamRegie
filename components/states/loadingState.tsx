"use client";

interface LoadingStateProps {
  fullScreen?: boolean;
  label?: string;
  /** "md" for pages and cards, "lg" for the full-screen app loader */
  size?: "sm" | "md" | "lg";
  /** show the logo above the spinner; on by default for the full-screen loader */
  showLogo?: boolean;
}

const SIZES = {
  sm: { box: "h-5 w-5", border: "border-2" },
  md: { box: "h-8 w-8", border: "border-[3px]" },
  lg: { box: "h-10 w-10", border: "border-[3px]" },
};

export default function LoadingState({
  fullScreen = false,
  label = "Laden",
  size = "md",
  showLogo = fullScreen,
}: LoadingStateProps) {
  const s = SIZES[fullScreen ? "lg" : size];

  const loader = (
    <div role="status" aria-live="polite" className="flex flex-col items-center">
      {showLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/fulllogo.png" alt="" className="mb-8 h-20 w-auto object-contain" />
      )}

      {/* light track with a primary arc spinning on top */}
      <span
        aria-hidden="true"
        className={`${s.box} ${s.border} animate-spin rounded-full border-primary/15 border-t-primary motion-reduce:animate-[spin_2s_linear_infinite]`}
      />
      <span className="mt-3 text-sm font-medium text-muted">{label}…</span>
    </div>
  );

  if (!fullScreen) {
    return <div className="flex h-full min-h-40 items-center justify-center py-10">{loader}</div>;
  }

  return <div className="flex h-dvh items-center justify-center bg-background">{loader}</div>;
}
