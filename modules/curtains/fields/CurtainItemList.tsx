"use client";

import { useItemSelection } from "@/context/SelectItemContext";
import { useItemsFromRoomsByCategory } from "@/hooks/itemHooks";
import { formatNumber2Decimals } from "@/lib/format";
import { Check, QrCode, Ruler } from "lucide-react";
import { useState } from "react";

const STATUS = {
  good: { label: "Goed", dot: "bg-success" },
  moderate: { label: "Matig", dot: "bg-warning" },
  poor: { label: "Slecht", dot: "bg-danger" },
} as const;

export default function CurtainItemList({ roomId }: { roomId: string }) {
  const { isSelected, toggle } = useItemSelection();
  const [page, setPage] = useState(0);
  const { data, isPending, error } = useItemsFromRoomsByCategory(roomId, page, 25, "curtain");
  const items = data?.items ?? [];

  if (isPending) {
    return (
      <div className="space-y-1.5 py-1">
        {[0, 1].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="py-2 text-sm text-danger">Gordijnen konden niet worden geladen.</p>;
  }

  if (items.length === 0) {
    return <p className="py-2 text-sm text-muted">Geen gordijnen in deze ruimte.</p>;
  }

  return (
    <ul className="space-y-0.5 py-1">
      {items.map((item) => {
        const status = STATUS[item.status as keyof typeof STATUS];
        const details = item.curtain_details;
        const typeName = details?.curtain_types?.name;
        const height = formatNumber2Decimals(details?.height ?? 0);
        const width = formatNumber2Decimals(details?.lower_width ?? 0);
        const selected = isSelected(item.id);

        return (
          <li key={item.id}>
            <label
              className={`group relative flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors ${
                selected ? "bg-primary-soft/60" : "hover:bg-surface/70"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                onClick={() =>
                  toggle({
                    item_id: item.id,
                    quantity: item.quantity,
                    room_id: item.rooms?.id ?? "",
                    story_id: item.rooms?.stories.id ?? "",
                  })
                }
                checked={selected}
                readOnly
              />
              <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  selected
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white group-hover:border-primary/60"
                }`}
              >
                {selected && <Check strokeWidth={3} className="h-2.5 w-2.5" />}
              </span>

              {/* name + type */}
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className={`truncate text-sm ${selected ? "font-medium text-ink" : "text-ink-soft"}`}
                >
                  {item.name}
                </span>
                {typeName && (
                  <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[11px] font-medium text-muted">
                    {typeName}
                  </span>
                )}
              </span>

              {/* QR */}
              {item.qr_code_id && (
                <span className="hidden shrink-0 items-center gap-1 text-[11px] text-muted tabular-nums lg:flex">
                  <QrCode className="h-3 w-3" aria-hidden="true" />
                  {item.qr_code_id}
                </span>
              )}

              {/* measurements: height × lower width */}
              <span
                title="Hoogte × onderbreedte (cm)"
                className="hidden w-24 shrink-0 items-center justify-end gap-1 text-xs text-muted tabular-nums sm:flex"
              >
                {height || width ? (
                  <>
                    <Ruler className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {height ?? "–"} × {width ?? "–"}
                  </>
                ) : (
                  <span className="text-muted/50">—</span>
                )}
              </span>

              {/* status */}
              {status && (
                <span
                  title={status.label}
                  aria-label={`Staat: ${status.label}`}
                  className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                />
              )}

              {/* quantity */}
              <span className="w-8 shrink-0 text-right text-xs font-medium text-ink-soft tabular-nums">
                {item.quantity}×
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
