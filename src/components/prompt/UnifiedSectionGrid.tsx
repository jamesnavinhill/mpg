"use client";
import React from "react";
import SimpleSelect from "../ui/SimpleSelect";
import {
  GENRES,
  GenreKey,
  SECTIONS,
  SectionId,
  getOptions,
} from "../../lib/promptConfig";

export type MatrixSelections = Record<
  string,
  { genre?: GenreKey; value?: string }
>;

export default function UnifiedSectionGrid({
  selectedGenres,
  selections,
  onChange,
}: {
  selectedGenres: GenreKey[];
  selections: MatrixSelections;
  onChange: (
    sectionId: SectionId,
    rowIndex: number,
    genre: GenreKey,
    value: string
  ) => void;
}) {
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SECTIONS.forEach((s) => (init[s.id] = true));
    return init;
  });

  const toggleCard = (id: string) =>
    setOpenMap((m) => ({ ...m, [id]: !m[id] }));
  const handleGroupedChange = (
    sectionId: SectionId,
    rowIndex: number,
    encoded: string
  ) => {
    if (!encoded) {
      onChange(sectionId, rowIndex, undefined as any, "");
      return;
    }
    const [genreStr, ...rest] = encoded.split("::");
    const genre = genreStr as GenreKey;
    const value = rest.join("::");
    onChange(sectionId, rowIndex, genre, value);
  };

  const shortLabel = (cat: string) => {
    if (cat === "Genre/Style") return "Style";
    if (cat === "BPM/Tempo") return "Tempo";
    if (cat === "Key/Scale") return "Key";
    if (cat === "Time Signature") return "Time";
    return cat;
  };

  return (
    <div className="space-y-2">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-neutral-800 bg-neutral-950"
          >
            <div
              className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 rounded-t-lg flex items-center justify-between cursor-pointer select-none hover:bg-neutral-950/60"
              onClick={() => toggleCard(section.id)}
              title={`Toggle ${section.name}`}
            >
              <div className="text-sm font-medium text-accent-300">
                {section.name}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-neutral-400">
                  {(() => {
                    const chosen = section.categories.reduce(
                      (acc, _cat, rowIndex) => {
                        const key = `${section.id}-${rowIndex}`;
                        return (
                          acc + ((selections[key]?.value ? 1 : 0) as number)
                        );
                      },
                      0
                    );
                    const total = section.categories.length;
                    const chosenClass =
                      chosen === total ? "text-accent-300" : "text-neutral-400";
                    return (
                      <span>
                        <span className={chosenClass}>{chosen}</span>
                        <span className="px-0.5">/</span>
                        <span className="text-accent-300">{total}</span>
                      </span>
                    );
                  })()}
                </div>
                <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <svg
                    className={`h-4 w-4 text-neutral-400 transition-transform ${
                      openMap[section.id] ? "rotate-180" : "rotate-0"
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
            <div
              id={`section-${section.id}`}
              className={openMap[section.id] ? "px-3 py-2.5" : "hidden"}
            >
              <div className="pt-3">
                <div className="space-y-2">
                  {section.categories.map((cat, rowIndex) => {
                    const key = `${section.id}-${rowIndex}`;
                    const current = selections[key] || {};
                    const availableGenres = selectedGenres;

                    const groups = availableGenres
                      .map((g) => {
                        const opts = getOptions(section.id, cat, g);
                        if (!opts || opts.length === 0) return null;
                        return {
                          label: GENRES[g],
                          options: opts.map((opt) => ({
                            label: opt,
                            value: `${g}::${opt}`,
                          })),
                        };
                      })
                      .filter(Boolean) as {
                      label: string;
                      options: { label: string; value: string }[];
                    }[];

                    return (
                      <div key={rowIndex} className="grid grid-cols-1 gap-2">
                        <div>
                          <SimpleSelect
                            value={
                              current.genre && current.value
                                ? `${current.genre}::${current.value}`
                                : ""
                            }
                            onChange={(val) =>
                              handleGroupedChange(section.id, rowIndex, val)
                            }
                            placeholder={shortLabel(cat)}
                            groups={groups}
                            className="w-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
