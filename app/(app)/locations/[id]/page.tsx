"use client";

import { SubPageHeader } from "@/components/headers/pageHeader";
import RoomError from "@/components/states/ErrorState";
import RoomLoader from "@/components/states/loadingState";
import NotFoundState from "@/components/states/notFound";
import Button from "@/components/ui/buttons/Button";
import Card from "@/components/ui/cards/card";
import {
  useLocationItemCount,
  useLocationRoomCount,
  useLocationWithClient,
} from "@/hooks/locationHooks";
import { useLocationStories } from "@/hooks/storyHooks";
import { ITEM_CATEGORY } from "@/lib/constants";
import {
  Box,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  DoorOpen,
  Edit,
  Layers,
  MapPin,
  Package,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { DetailRow } from "./_components/detailRow";
import { formatAddress, formatAddressNoPostalCode } from "@/lib/format";
import { sortAndFilteritemsCounts } from "@/lib/categories";

const EXECUTIONS = [
  { label: "Afgerond", value: 3, dot: "bg-success" },
  { label: "Bezig", value: 1, dot: "bg-warning" },
  { label: "Gepland", value: 2, dot: "bg-primary" },
];

const CONDITION = [
  { label: "Goed", value: 114, pct: 87, bar: "bg-success" },
  { label: "Matig", value: 12, pct: 9, bar: "bg-warning" },
  { label: "Slecht", value: 5, pct: 4, bar: "bg-danger" },
];

export default function LocationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;

  const { data: location, isPending, error } = useLocationWithClient(id);
  const { data: stories, isPending: storiesPending } = useLocationStories(id);
  const { data: roomCount } = useLocationRoomCount(id);
  const { data: itemCounts, isPending: itemCountsPending } = useLocationItemCount(id);

  if (isPending) return <RoomLoader />;
  if (error) return <RoomError />;
  if (!location) return <NotFoundState />;

  const categories = sortAndFilteritemsCounts(itemCounts ?? []);

  const totalObjects = categories.reduce((sum, c) => sum + c.total, 0);

  const address = formatAddressNoPostalCode({
    city: location.city,
    street: location.street,
    number: location.number,
  });

  const executionsTotal = EXECUTIONS.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SubPageHeader title={location.name} description="Bekijk de gegevens van uw locatie" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            href={`/locations/${location.id}/edit`}
            variant="secondary"
            icon={Edit}
            className="w-full sm:w-auto"
          >
            Bewerken
          </Button>
          <Button
            href={`/locations/${location.id}/addstories`}
            icon={Plus}
            className="w-full sm:w-auto"
          >
            Toevoegen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* ---------- Main column ---------- */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          {/* Overview */}
          <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-line bg-white md:grid-cols-2 md:divide-x md:divide-line">
            {/* Next execution */}
            <div className="flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <CalendarClock strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">Volgende uitvoering</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ink">
                  Wisselronde gordijnen
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">
                    12 dec. 2026
                  </span>
                  <span className="text-muted">over 29 dagen · 42 objecten</span>
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="border-t border-line p-5 md:border-t-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs text-muted">Staat van objecten</p>
                <p className="text-xs text-muted">
                  <span className="font-semibold text-ink tabular-nums">87%</span> in goede staat
                </p>
              </div>

              <div className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full bg-surface">
                {CONDITION.map((c) => (
                  <div key={c.label} className={c.bar} style={{ width: `${c.pct}%` }} />
                ))}
              </div>

              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                {CONDITION.map((c) => (
                  <li key={c.label} className="flex items-center gap-1.5 text-ink-soft">
                    <span className={`h-2 w-2 rounded-full ${c.bar}`} aria-hidden="true" />
                    {c.label}
                    <span className="font-medium text-ink tabular-nums">{c.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Verdiepingen */}
          <Card
            icon={Layers}
            title="Verdiepingen"
            subtitle={storiesPending ? "Laden…" : `${stories?.length ?? 0} verdiepingen`}
            flush
          >
            {storiesPending ? (
              <div className="space-y-2 p-5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-11 animate-pulse rounded-md bg-surface" />
                ))}
              </div>
            ) : !stories || stories.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-muted">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">Nog geen verdiepingen</p>
                  <p className="mt-0.5 text-sm text-muted">
                    Voeg een verdieping toe om ruimtes te beheren.
                  </p>
                </div>
                <Button href={`/locations/${location.id}/addstories`} size="sm" icon={Plus}>
                  Verdieping toevoegen
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {stories.map((story, i) => (
                  <li key={story.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-xs font-semibold text-primary tabular-nums">
                      {i + 1}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                      {story.name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* ---------- Side column ---------- */}
        <div className="flex flex-col gap-4">
          {/* Locatiegegevens */}
          <Card icon={MapPin} title="Locatiegegevens" subtitle="Adres en klant" flush>
            <dl className="divide-y divide-line">
              <DetailRow icon={Briefcase} label="Klant" value={location.clients?.name} />
              <DetailRow icon={MapPin} label="Adres" value={address} />
              <DetailRow icon={Layers} label="Verdiepingen" value={stories?.length ?? 0} />
              <DetailRow icon={DoorOpen} label="Ruimtes" value={roomCount ?? 0} />
              <DetailRow icon={Box} label="Objecten" value={totalObjects} />
            </dl>
          </Card>

          {/* Objecten per categorie */}
          <Card icon={Box} title="Objecten per categorie" subtitle={`${totalObjects} in totaal`}>
            {itemCountsPending ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded-md bg-surface" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">
                Nog geen objecten op deze locatie.
              </p>
            ) : (
              <ul className="space-y-3.5">
                {categories.map((c) => {
                  const meta = ITEM_CATEGORY[c.category] ?? { label: c.category, icon: Package };
                  const pct = totalObjects ? Math.round((c.total / totalObjects) * 100) : 0;
                  return (
                    <li key={c.category}>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-ink-soft">
                          <meta.icon className="h-4 w-4 text-muted" aria-hidden="true" />
                          {meta.label}
                        </span>
                        <span className="font-medium text-ink tabular-nums">
                          {c.total.toLocaleString("nl-NL")}
                          <span className="ml-1.5 text-xs font-normal text-muted">{pct}%</span>
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Uitvoeringen */}
          <Card icon={ClipboardCheck} title="Projecten" subtitle="Totaal op deze locatie">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-ink tabular-nums">
                {executionsTotal.toLocaleString("nl-NL")}
              </span>
              <span className="text-sm text-muted">projecten</span>
            </div>

            <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-surface">
              {EXECUTIONS.map((e) => (
                <div
                  key={e.label}
                  className={e.dot}
                  style={{ width: `${executionsTotal ? (e.value / executionsTotal) * 100 : 0}%` }}
                />
              ))}
            </div>

            <dl className="space-y-2 text-sm">
              {EXECUTIONS.map((e) => (
                <div key={e.label} className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-ink-soft">
                    <span className={`h-2 w-2 rounded-full ${e.dot}`} aria-hidden="true" />
                    {e.label}
                  </dt>
                  <dd className="font-medium text-ink tabular-nums">{e.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
