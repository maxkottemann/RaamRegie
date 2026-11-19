import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string; // a second line, e.g. a license plate or an email
  icon?: React.ReactNode; // a vehicle icon, an avatar
  badge?: string; // e.g. "Elektrisch"
  disabled?: boolean;
};

type Props<T extends string> = {
  options: SelectOption<T>[];
  placeholder?: string;
  searchable?: boolean;
} & (
  | { multiple?: false; value: T | null; onChange: (v: T | null) => void }
  | { multiple: true; value: T[]; onChange: (v: T[]) => void }
);

export function CustomSelect<T extends string>(props: Props<T>) {
  const { options, placeholder = "Kies...", searchable = true } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  // close on outside click and on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected: T[] = props.multiple ? props.value : props.value ? [props.value] : [];
  const isSelected = (v: T) => selected.includes(v);

  function toggle(v: T) {
    if (props.multiple) {
      props.onChange(isSelected(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    } else {
      props.onChange(isSelected(v) ? null : v);
      setOpen(false);
    }
  }

  const q = query.trim().toLowerCase();
  const visible = options.filter(
    (o) => !q || o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q),
  );

  const summary =
    selected?.length === 0
      ? placeholder
      : props.multiple
        ? `${selected?.length} geselecteerd`
        : (options.find((o) => o.value === selected[0])?.label ?? placeholder);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
      >
        <span className={selected.length ? "text-slate-800" : "text-slate-300"}>{summary}</span>
        <ChevronDownIcon
          className={`h-4 w-4 text-slate-300 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-999 mt-1 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
          {searchable && (
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoeken..."
              className="w-full border-b border-slate-100 px-3 py-2 text-sm outline-none"
            />
          )}
          <ul
            role="listbox"
            aria-multiselectable={props.multiple}
            className="max-h-60 overflow-y-auto py-1"
          >
            {visible.length === 0 && (
              <li className="px-3 py-3 text-xs text-slate-400">Geen resultaten</li>
            )}
            {visible.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected(o.value)}
                  disabled={o.disabled}
                  onClick={() => toggle(o.value)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 disabled:opacity-40"
                >
                  {props.multiple && (
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected(o.value) ? "border-primary bg-primary" : "border-slate-300"}`}
                    >
                      {isSelected(o.value) && <CheckIcon className="h-3 w-3 text-white" />}
                    </span>
                  )}
                  {o.icon}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-slate-800">{o.label}</span>
                    {o.description && (
                      <span className="block truncate text-xs text-slate-400">{o.description}</span>
                    )}
                  </span>
                  {o.badge && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                      {o.badge}
                    </span>
                  )}
                  {!props.multiple && isSelected(o.value) && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
