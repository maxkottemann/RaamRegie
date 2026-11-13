"use client";

import { useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

/*
 * Date picker in the app style. Works with react-hook-form through a Controller:
 *   <Controller name="item.purchase_date" control={control}
 *     render={({ field }) => <DateInput id="..." value={field.value} onChange={field.onChange} />} />
 * The value is always a "YYYY-MM-DD" string ("" when empty), the same as a native date input,
 * so your zod optionalDate schema and the Postgres `date` column work unchanged.
 */

interface DateInputProps {
  id?: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  invalid?: boolean;
  placeholder?: string;
  /** "YYYY-MM-DD": days before / after are disabled */
  min?: string;
  max?: string;
  disabled?: boolean;
}

const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const monthFormat = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" });
const displayFormat = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/* local dates only: never through UTC, so 12 March never turns into 11 March */
function parse(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getMonth() === m - 1 ? date : null;
}

function toValue(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

/* 6 weeks × 7 days, starting on the Monday on or before the 1st */
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday = 0
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}

export default function DateInput({
  id,
  value,
  onChange,
  invalid = false,
  placeholder = "Kies een datum",
  min,
  max,
  disabled = false,
}: DateInputProps) {
  const selected = parse(value);
  const today = new Date();
  const todayValue = toValue(today);
  const [view, setView] = useState(() => {
    const start = selected ?? today;
    return { year: start.getFullYear(), month: start.getMonth() };
  });

  const days = monthGrid(view.year, view.month);
  const isOutOfRange = (day: string) => (min ? day < min : false) || (max ? day > max : false);

  function shiftMonth(delta: number) {
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <div className="group relative">
            <PopoverButton
              id={id}
              disabled={disabled}
              aria-invalid={invalid || undefined}
              onClick={() => {
                // open on the selected month (or today's)
                const start = selected ?? today;
                setView({ year: start.getFullYear(), month: start.getMonth() });
              }}
              className={`flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border pr-9 pl-3 text-left text-sm transition outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 data-open:bg-white ${
                invalid
                  ? "border-danger bg-danger/5 focus-visible:border-danger focus-visible:ring-danger/10"
                  : "border-line bg-surface/70 hover:border-muted/30 hover:bg-white focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/10 data-open:border-primary data-open:ring-4 data-open:ring-primary/10"
              }`}
            >
              <CalendarDays
                strokeWidth={1.75}
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 transition-colors ${
                  invalid ? "text-danger" : "text-muted/60 group-focus-within:text-primary"
                }`}
              />
              <span className={`truncate ${selected ? "text-ink" : "text-muted/50"}`}>
                {selected ? displayFormat.format(selected) : placeholder}
              </span>
            </PopoverButton>

            {/* clear button, only when there's a value */}
            {selected && !disabled && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Datum wissen"
                className="absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
              >
                <X strokeWidth={1.75} className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <PopoverPanel
            anchor={{ to: "bottom start", gap: 6 }}
            transition
            className="z-[350] w-72 rounded-lg border border-line bg-white p-3 shadow-float transition duration-100 ease-out data-closed:-translate-y-1 data-closed:opacity-0"
          >
            {/* month navigation */}
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Vorige maand"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronLeft strokeWidth={1.75} className="h-4 w-4" />
              </button>
              <p className="text-sm font-semibold text-ink capitalize">
                {monthFormat.format(new Date(view.year, view.month, 1))}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Volgende maand"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronRight strokeWidth={1.75} className="h-4 w-4" />
              </button>
            </div>

            {/* weekday header */}
            <div className="grid grid-cols-7 pb-1">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="py-1 text-center text-[11px] font-semibold text-muted uppercase"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* days */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day) => {
                const dayValue = toValue(day);
                const inMonth = day.getMonth() === view.month;
                const isSelected = dayValue === value;
                const isToday = dayValue === todayValue;
                const off = isOutOfRange(dayValue);

                return (
                  <button
                    key={dayValue}
                    type="button"
                    disabled={off}
                    onClick={() => {
                      onChange(dayValue);
                      close();
                    }}
                    aria-pressed={isSelected}
                    aria-label={displayFormat.format(day)}
                    className={`flex h-9 cursor-pointer items-center justify-center rounded-md text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30 ${
                      isSelected
                        ? "bg-primary font-semibold text-white hover:bg-primary-hover"
                        : isToday
                          ? "font-semibold text-primary ring-1 ring-primary/40 ring-inset hover:bg-primary-soft"
                          : inMonth
                            ? "text-ink hover:bg-primary-soft hover:text-primary"
                            : "text-muted/50 hover:bg-surface"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* footer */}
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  close();
                }}
                className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
              >
                Wissen
              </button>
              <button
                type="button"
                disabled={isOutOfRange(todayValue)}
                onClick={() => {
                  onChange(todayValue);
                  close();
                }}
                className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Vandaag
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
