"use client";

import { Search, X } from "lucide-react";
import type { InputHTMLAttributes, Ref } from "react";

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "size"
> {
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  ref?: Ref<HTMLInputElement>;
}

const SIZES = {
  sm: { input: "h-9 text-sm pl-8.5", icon: "left-2.5 h-4 w-4" },
  md: { input: "h-10 text-sm pl-9", icon: "left-3 h-4 w-4" },
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Zoeken…",
  size = "md",
  className = "",
  ref,
  onKeyDown,
  "aria-label": ariaLabel,
  ...props
}: SearchInputProps) {
  const s = SIZES[size];

  return (
    <div className={`group/search relative ${className}`}>
      <Search
        strokeWidth={1.75}
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within/search:text-primary ${s.icon}`}
      />

      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
          onKeyDown?.(e);
        }}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`w-full rounded-md border border-line bg-white pr-9 text-ink transition-colors outline-none placeholder:text-muted/70 hover:border-ink/25 focus:border-primary focus:ring-3 focus:ring-primary/15 [&::-webkit-search-cancel-button]:appearance-none ${s.input}`}
        {...props}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Zoekopdracht wissen"
          className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
