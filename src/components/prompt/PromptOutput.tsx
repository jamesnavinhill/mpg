"use client";
import React from "react";
import { MatrixSelections } from "./UnifiedSectionGrid";
import { GENRES, SECTIONS, SectionId } from "../../lib/promptConfig";
import { formatSelectionsAsSongPrompt } from "../../lib/promptFormatter";

export default function PromptOutput({
  selections,
  onApplyEdited,
  defaultOpen = true,
  onGenerateAudio,
  generating = false,
  externalText,
  onSavePreset,
  onClearAll,
  collapseSignal,
}: {
  selections: MatrixSelections;
  onApplyEdited: (text: string) => void;
  defaultOpen?: boolean;
  onGenerateAudio?: (text: string) => void;
  generating?: boolean;
  externalText?: string | undefined;
  onSavePreset?: (text: string) => void;
  onClearAll?: () => void;
  collapseSignal?: number;
}) {
  const base = React.useMemo(() => {
    return formatSelectionsAsSongPrompt(selections as any);
  }, [selections]);
  const [text, setText] = React.useState(base);
  const [confirmAudio, setConfirmAudio] = React.useState(false);
  const [cleanOpen, setCleanOpen] = React.useState<boolean>(true);
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [open, setOpen] = React.useState<boolean>(defaultOpen);
  const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (externalText === undefined) {
      setText(base);
    }
  }, [base, externalText]);

  React.useEffect(() => {
    if (externalText !== undefined) setText(externalText);
  }, [externalText]);

  const autoSize = React.useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const max = Math.max(360, Math.floor(vh * 0.7));
    const min = 160;
    ta.style.height = "auto";
    const next = Math.max(min, Math.min(ta.scrollHeight, max));
    ta.style.height = `${next}px`;
    ta.style.overflowY = ta.scrollHeight > max ? "auto" : "hidden";
  }, []);

  React.useEffect(() => {
    autoSize();
  }, [text, autoSize]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  const detailed = React.useMemo(() => {
    const byGenre = new Map<
      string,
      Array<{
        sectionId: SectionId;
        rowIndex: number;
        category: string;
        value: string;
      }>
    >();
    const genreOrder: string[] = [];
    const sectionIndex: Record<SectionId, number> = SECTIONS.reduce(
      (acc, s, i) => {
        acc[s.id] = i as number;
        return acc;
      },
      {} as Record<SectionId, number>
    );
    const getCategory = (sectionId: SectionId, rowIndex: number) => {
      const sec = SECTIONS.find((s) => s.id === sectionId);
      return sec?.categories[rowIndex] || `Item ${rowIndex + 1}`;
    };
    const shortLabel = (cat: string) => {
      if (cat === "Genre/Style") return "Style";
      if (cat === "BPM/Tempo") return "Tempo";
      if (cat === "Key/Scale") return "Key";
      if (cat === "Time Signature") return "Time";
      return cat;
    };

    Object.entries(selections).forEach(([key, sel]) => {
      if (!sel?.value || !sel?.genre) return;
      const [sectionId, rowIndexStr] = key.split("-") as [SectionId, string];
      const rowIndex = parseInt(rowIndexStr, 10) || 0;
      const genreLabel = GENRES[sel.genre] || sel.genre;
      if (!byGenre.has(genreLabel)) {
        byGenre.set(genreLabel, []);
        genreOrder.push(genreLabel);
      }
      byGenre.get(genreLabel)!.push({
        sectionId,
        rowIndex,
        category: shortLabel(getCategory(sectionId, rowIndex)),
        value: sel.value,
      });
    });

    const lines: string[] = [];
    genreOrder.forEach((g) => {
      const items = byGenre.get(g) || [];
      items.sort((a, b) =>
        sectionIndex[a.sectionId] === sectionIndex[b.sectionId]
          ? a.rowIndex - b.rowIndex
          : sectionIndex[a.sectionId] - sectionIndex[b.sectionId]
      );
      lines.push(`[GENRE]${g}[/GENRE]:`);
      items.forEach((it) => {
        lines.push(`- ${it.category}: ${it.value}`);
      });
      lines.push("");
    });

    return lines.join("\n").trim();
  }, [selections]);

  return (
    <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
      <div
        id="prompt-output-header"
        className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 rounded-t-lg flex items-center justify-between cursor-pointer select-none hover:bg-neutral-950/60"
        onClick={() => setOpen((v) => !v)}
        title="Toggle prompt editor"
      >
        <div className="text-sm font-medium text-neutral-200">Prompts</div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              {onSavePreset && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSavePreset(text);
                  }}
                  title="Save this prompt as a preset"
                  className="btn-black-sm"
                >
                  Save
                </button>
              )}
              {onClearAll && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearAll();
                  }}
                  title="Clear prompt and selections"
                  className="btn-black-sm"
                >
                  Clear
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copy();
                }}
                title="Copy the clean prompt to clipboard"
                className="btn-black-sm"
              >
                Copy
              </button>
              {onGenerateAudio && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!generating && text.trim()) setConfirmAudio(true);
                  }}
                  disabled={generating || !text.trim()}
                  className={`px-2 py-1 text-xs rounded-md ${
                    generating || !text.trim()
                      ? "bg-accent-600/15 text-accent-300 cursor-not-allowed border border-accent-600/30"
                      : "bg-accent-600 hover:bg-accent-500 text-white"
                  }`}
                  title="Create audio from this prompt"
                >
                  {generating ? "Generating…" : "Create Audio"}
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
      <div id="prompt-output-body" className={open ? "p-3" : "hidden"}>
        {confirmAudio && (
          <div className="mb-3 p-3 border border-amber-700/40 bg-amber-900/20 rounded-md text-amber-100 text-xs">
            <div className="font-medium mb-1">Proceed to create audio?</div>
            <div className="mb-2 text-amber-200/90">
              This will send your prompt to the API and use one credit.
            </div>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 text-xs rounded-md bg-amber-700 hover:bg-amber-600 text-white"
                onClick={() => {
                  setConfirmAudio(false);
                  if (onGenerateAudio && !generating && text.trim()) {
                    onGenerateAudio(text);
                  }
                }}
              >
                Yes, continue
              </button>
              <button
                className="btn-black-sm"
                onClick={() => setConfirmAudio(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="border border-neutral-800 rounded-md overflow-hidden">
          <div
            className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 flex items-center justify-between cursor-pointer select-none"
            onClick={() => setCleanOpen((v) => !v)}
            title="Toggle prompt"
          >
            <div className="text-xs font-medium text-accent-300">Prompt</div>
            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  cleanOpen ? "rotate-180" : "rotate-0"
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
          <div className={cleanOpen ? "p-3" : "hidden"}>
            <textarea
              ref={taRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                requestAnimationFrame(autoSize);
              }}
              placeholder="Your prompt will appear here..."
              rows={1}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm font-mono text-neutral-200 resize-none min-h-[96px]"
            />
          </div>
        </div>

        <div className="mt-4 border border-neutral-800 rounded-md overflow-hidden">
          <div
            className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 flex items-center justify-between cursor-pointer select-none"
            onClick={() => setDetailsOpen((v) => !v)}
            title="Toggle detailed prompt"
          >
            <div className="text-xs font-medium text-accent-300">
              Detailed Prompt
            </div>
            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  detailsOpen ? "rotate-180" : "rotate-0"
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
          <div className={detailsOpen ? "p-3" : "hidden"}>
            {detailed ? (
              <div className="text-xs font-mono text-neutral-200 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2">
                {detailed.split("\n").map((line, idx) => {
                  if (line.startsWith("[GENRE]")) {
                    const name = line
                      .replace("[GENRE]", "")
                      .replace("[/GENRE]:", "")
                      .replace(":", "");
                    return (
                      <div key={idx}>
                        <span className="text-accent-300">{name}</span>:
                      </div>
                    );
                  }
                  return <div key={idx}>{line}</div>;
                })}
              </div>
            ) : (
              <div className="text-xs text-neutral-400">
                No detailed items. Use the genre generator or manual selectors.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
