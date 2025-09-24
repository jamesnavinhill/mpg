"use client";
import React from "react";
import { GENRES, GenreKey } from "../../lib/promptConfig";

export function inferModeFromCount(
  count: number
): "random" | "instant" | "fusion" | "manual" {
  if (count <= 0) return "random";
  if (count === 1) return "instant";
  if (count <= 3) return "fusion";
  return "manual";
}

export default function GenrePicker({
  value,
  onChange,
  onGeneratePrompt,
  canGenerate = true,
  defaultOpen = true,
  showHeader = true,
}: {
  value: Set<GenreKey> | null; // null → all
  onChange: (next: Set<GenreKey> | null) => void;
  onGeneratePrompt?: () => void;
  canGenerate?: boolean;
  defaultOpen?: boolean;
  showHeader?: boolean;
}) {
  const allKeys = Object.keys(GENRES) as GenreKey[];
  const selected = value === null ? new Set<GenreKey>(allKeys) : value;
  const count = selected.size;
  const mode = inferModeFromCount(value === null ? 0 : count);
  const modeLabel = React.useMemo(() => {
    switch (mode) {
      case "instant":
        return "Solo";
      case "random":
        return "Shuffle";
      case "fusion":
        return "Hybrid";
      case "manual":
      default:
        return "Manual";
    }
  }, [mode]);
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  const toggle = (k: GenreKey, checked: boolean) => {
    if (value === null) {
      const s = new Set<GenreKey>();
      if (checked) s.add(k);
      onChange(s);
      return;
    }
    const s = new Set<GenreKey>(value);
    if (checked) s.add(k);
    else s.delete(k);
    if (s.size === 0) onChange(null); // back to all → random
    else onChange(s);
  };

  if (!showHeader) {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allKeys.map((id) => {
            const label = GENRES[id];
            const checked = value === null || selected.has(id);
            return (
              <label
                key={id}
                className="flex items-center gap-2 rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={(e) => toggle(id, e.target.checked)}
                />
                <span className="relative grid place-items-center h-3.5 w-3.5 rounded-sm border bg-neutral-950 border-accent-600/60 peer-checked:bg-accent-600 peer-checked:border-accent-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-150 ease-out peer-checked:opacity-100 relative z-10"
                    aria-hidden
                    focusable="false"
                  >
                    <path
                      d="M20 6L10 16l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs text-neutral-300">{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Genres"
      className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden"
    >
      <div
        className="px-3 py-2 border-b border-neutral-800 flex items-center justify-between cursor-pointer select-none hover:bg-neutral-950/60"
        onClick={() => setOpen((v) => !v)}
        title="Toggle Genres"
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Genres</div>
          {open && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border border-accent-700/40 bg-accent-700/15 text-accent-300"
              title="Selection mode"
            >
              {modeLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="btn-black-sm hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
              >
                all
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(new Set());
                }}
                className="btn-black-sm hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
              >
                Clear
              </button>
              {onGeneratePrompt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onGeneratePrompt();
                  }}
                  disabled={!canGenerate}
                  className={`px-2 py-1 text-xs rounded-md ${
                    canGenerate
                      ? "bg-accent-600 hover:bg-accent-500 text-white"
                      : "bg-accent-600/15 text-accent-300 cursor-not-allowed border border-accent-600/30"
                  }`}
                  title="Reveal prompt from selected genres"
                >
                  prompt
                </button>
              )}
            </>
          )}
          <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <svg
              className={`h-4 w-4 text-neutral-400 transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className={open ? "p-3" : "hidden"}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allKeys.map((id) => {
            const label = GENRES[id];
            const checked = value === null || selected.has(id);
            return (
              <label
                key={id}
                className="flex items-center gap-2 rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={checked}
                  onChange={(e) => toggle(id, e.target.checked)}
                />
                <span className="relative grid place-items-center h-3.5 w-3.5 rounded-sm border bg-neutral-950 border-accent-600/60 peer-checked:bg-accent-600 peer-checked:border-accent-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-150 ease-out peer-checked:opacity-100 relative z-10"
                    aria-hidden
                    focusable="false"
                  >
                    <path
                      d="M20 6L10 16l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs text-neutral-300">{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
