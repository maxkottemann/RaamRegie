import { QUALITY } from "@/lib/constants";

export function QualityIndicator({ value }: { value: string | null | undefined }) {
  const quality = value ? QUALITY[value] : undefined;
  if (!quality) return <span className="text-sm text-muted/60">—</span>;

  return (
    <span className="inline-flex items-center gap-2" title={`Kwaliteit: ${quality.label}`}>
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={`w-1 rounded-sm ${bar <= quality.level ? quality.color : "bg-line"}`}
            style={{ height: 4 + bar * 3 }}
          />
        ))}
      </span>
      <span className="text-xs font-medium text-ink-soft">{quality.label}</span>
    </span>
  );
}
