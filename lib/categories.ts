import { LocationItemCount } from "@/services/locationService";

export function sortAndFilteritemsCounts(items: LocationItemCount) {
  return (items ?? [])
    .map((c) => ({ ...c, total: c.total_quantity ?? 0 }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}
