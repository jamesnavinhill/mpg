"use client";
import React from "react";
import UnifiedSectionGrid from "./UnifiedSectionGrid";
import { GenreKey, SectionId } from "../../lib/promptConfig";
import { MatrixSelections } from "./UnifiedSectionGrid";

export default function ManualPanel({
  selectedGenres,
  selections,
  onChange,
  title = "Manual",
  defaultOpen = false,
  onGeneratePrompt,
  canGeneratePrompt,
  headerId,
  bodyId,
  onClearSelections,
  onAutoFill,
}: {
  selectedGenres: GenreKey[];
  selections: MatrixSelections;
  onChange: (
    sectionId: SectionId,
    rowIndex: number,
    genre: GenreKey,
    value: string
  ) => void;
  title?: string;
  defaultOpen?: boolean;
  onGeneratePrompt?: () => void;
  canGeneratePrompt?: boolean;
  headerId?: string;
  bodyId?: string;
  onClearSelections?: () => void;
  onAutoFill?: () => void;
}) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  return (
    <section
      aria-label={title}
      className="bg-neutral-950 rounded-lg border border-neutral-800"
    >
      <div
        id={headerId}
        className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 rounded-t-lg flex items-center justify-between cursor-pointer select-none hover:bg-neutral-950/60"
        onClick={() => setOpen((v) => !v)}
        title={`Toggle ${title}`}
      >
        <div className="text-sm font-medium text-neutral-200">{title}</div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              {onAutoFill && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAutoFill();
                  }}
                  className="btn-black-sm hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
                  title="Start with a template from your genre selection"
                >
                  Prefill
                </button>
              )}
              {onClearSelections && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearSelections();
                  }}
                  className="btn-black-sm hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
                  title="Clear manual selections"
                >
                  Clear
                </button>
              )}
            </>
          )}
          <div className="text-xs text-neutral-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
      <div id={bodyId} className={open ? "p-3" : "hidden"}>
        <UnifiedSectionGrid
          selectedGenres={selectedGenres}
          selections={selections}
          onChange={onChange}
        />
      </div>
    </section>
  );
}
