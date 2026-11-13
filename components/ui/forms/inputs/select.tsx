"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

type SelectProps = {
  id?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  emptyText?: string;
  "aria-describedby"?: string;
};

export default function Select({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder = "Maak een keuze",
  invalid = false,
  disabled = false,
  emptyText = "Geen opties beschikbaar",
  "aria-describedby": describedBy,
}: SelectProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton
        id={id}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`relative flex h-10 w-full cursor-pointer items-center rounded-lg border bg-white pr-9 pl-3 text-left text-sm transition outline-none focus-visible:ring-4 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-open:ring-4 ${
          invalid
            ? "border-danger focus-visible:ring-danger/10 data-open:ring-danger/10"
            : "border-line focus-visible:border-primary focus-visible:ring-primary/10 data-open:border-primary data-open:ring-primary/10"
        }`}
      >
        <span className={`truncate ${selected ? "text-ink" : "text-muted/60"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          strokeWidth={1.75}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted transition-transform duration-200 in-data-open:rotate-180"
        />
      </ListboxButton>

      <ListboxOptions
        anchor="bottom start"
        transition
        className="z-50 max-h-64 w-(--button-width) overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-lg transition duration-150 ease-out outline-none [--anchor-gap:6px] data-closed:-translate-y-1 data-closed:opacity-0"
      >
        {options.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted">{emptyText}</p>
        ) : (
          options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink select-none data-focus:bg-surface data-selected:bg-primary-soft"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate group-data-selected:font-medium">{option.label}</p>
                {option.description && (
                  <p className="truncate text-xs text-muted">{option.description}</p>
                )}
              </div>
              <span className="invisible flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand group-data-selected:visible">
                <Check strokeWidth={2.5} className="h-3 w-3 text-white" />
              </span>
            </ListboxOption>
          ))
        )}
      </ListboxOptions>
    </Listbox>
  );
}
