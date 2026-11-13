"use client";

import { Check, Layers } from "lucide-react";
import type { LocationStories } from "@/services/storyService";

interface StorySelectorProps {
  stories: LocationStories;
  selectedStories: string[];
  onChange: (storyId: string) => void;
}

export default function StorySelector({ stories, selectedStories, onChange }: StorySelectorProps) {
  if (stories.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-line px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-muted">
          <Layers strokeWidth={1.75} className="h-4 w-4" />
        </span>
        <p className="text-sm text-muted">Nog geen verdiepingen. Voeg eerst een verdieping toe.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Verdiepingen</p>
        <p className="text-xs text-muted tabular-nums">
          {selectedStories.length} van {stories.length} geselecteerd
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stories.map((story) => {
          const isSelected = selectedStories.includes(story.id);

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => onChange(story.id)}
              aria-pressed={isSelected}
              className={`group relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg border px-3 py-2.5 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isSelected
                  ? "border-primary/40 bg-primary-soft"
                  : "border-line bg-white hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              {/* brand accent on the left when selected */}
              <span
                aria-hidden="true"
                className={`bg-brand-vertical absolute inset-y-0 left-0 w-[3px] transition-opacity duration-200 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}
              />

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 transition-colors duration-200 ${
                  isSelected
                    ? "bg-primary text-white ring-primary"
                    : "bg-primary-soft text-primary ring-primary/10 group-hover:bg-primary/15 group-hover:ring-primary/25"
                }`}
              >
                <Layers strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                {story.name}
              </span>

              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition duration-200 ${
                  isSelected ? "bg-brand scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              >
                <Check strokeWidth={2.5} className="h-3 w-3 text-white" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
