import React from "react";
import GenrePicker from "./components/prompt/GenrePicker";
import ManualPanel from "./components/prompt/ManualPanel";
import PromptOutput from "./components/prompt/PromptOutput";
import {
  GENRES,
  GenreKey,
  SectionId,
  SECTIONS,
  getOptions,
} from "./lib/promptConfig";
import { MatrixSelections } from "./components/prompt/UnifiedSectionGrid";
import { usePromptHistory } from "./components/prompt/usePromptHistory";
import { formatSelectionsAsSongPrompt } from "./lib/promptFormatter";

export function App() {
  const [selected, setSelected] = React.useState<Set<GenreKey> | null>(
    () => new Set((Object.keys(GENRES) as GenreKey[]).slice(0, 3))
  );
  const [selections, setSelections] = React.useState<MatrixSelections>({});

  const { history, add, clear, rename } = usePromptHistory();
  const [activePresetId, setActivePresetId] = React.useState<string>("");
  const [editingName, setEditingName] = React.useState<string>("");
  const [presetOpen, setPresetOpen] = React.useState(false);
  const presetDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [presetPlaceAbove, setPresetPlaceAbove] = React.useState(false);

  const currentPrompt = React.useMemo(() => {
    return formatSelectionsAsSongPrompt(selections as any);
  }, [selections]);

  React.useEffect(() => {
    if (!currentPrompt) return;
    const t = setTimeout(() => {
      add({ text: currentPrompt, selections: selections as any });
    }, 600);
    return () => clearTimeout(t);
  }, [currentPrompt, selections, add]);

  const selectedList = React.useMemo<GenreKey[]>(() => {
    if (selected === null) return Object.keys(GENRES) as GenreKey[];
    return Array.from(selected);
  }, [selected]);

  const onCellChange = (
    sectionId: SectionId,
    rowIndex: number,
    genre: GenreKey,
    value: string
  ) => {
    const key = `${sectionId}-${rowIndex}`;
    if (!genre && !value) {
      setSelections((prev) => {
        const next = { ...prev } as MatrixSelections;
        delete (next as any)[key];
        return next;
      });
      return;
    }
    setSelections((prev) => ({
      ...prev,
      [key]: { genre, value },
    }));
  };

  const openPromptOutput = () => {
    try {
      const body = document.getElementById("prompt-output-body");
      const header = document.getElementById("prompt-output-header");
      if (body && body.classList.contains("hidden") && header) header.click();
      header?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {}
  };

  const rand = (n: number) => Math.floor(Math.random() * n);

  const canGenerateFromGenres = React.useMemo(() => true, [selected]);

  const generateFromGenres = () => {
    const sectionIds = SECTIONS.map((s) => s.id);
    const categoriesBySection = new Map(
      SECTIONS.map((s) => [s.id, s.categories])
    );
    let genreList: GenreKey[];
    if (selected === null) {
      genreList = Object.keys(GENRES) as GenreKey[];
    } else {
      genreList = Array.from(selected);
    }
    const shuffleArr = <T,>(arr: T[]) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    if (genreList.length > 1) genreList = shuffleArr(genreList);
    if (selected === null) genreList = shuffleArr(genreList);
    const next: MatrixSelections = {};
    sectionIds.forEach((sectionId, sectionIdx) => {
      let activeGenre: GenreKey;
      if (selected === null)
        activeGenre = genreList[sectionIdx % genreList.length];
      else if (genreList.length === 1) activeGenre = genreList[0];
      else activeGenre = genreList[sectionIdx % genreList.length];
      const cats = categoriesBySection.get(sectionId) || [];
      cats.forEach((cat, rowIndex) => {
        let opts = getOptions(sectionId, cat, activeGenre);
        if (!opts || opts.length === 0) {
          const anyWith = (Object.keys(GENRES) as GenreKey[])
            .map((g) => getOptions(sectionId, cat, g))
            .find((arr) => arr && arr.length > 0);
          opts = anyWith || [];
        }
        if (opts.length === 0) return;
        const choice = opts[rand(opts.length)];
        const key = `${sectionId}-${rowIndex}`;
        (next as any)[key] = { genre: activeGenre, value: choice };
      });
    });
    setSelections(next);
    openPromptOutput();
  };

  const formatTimestamp = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear() % 100).padStart(2, "0");
    const HH = String(d.getHours()).padStart(2, "0");
    const MM = String(d.getMinutes()).padStart(2, "0");
    return `${mm}-${dd}-${yy} ${HH}:${MM}`;
  };

  const defaultPresetName = React.useCallback(() => {
    const count = selected === null ? 0 : selected.size;
    const modeWord =
      count <= 0
        ? "Shuffle"
        : count === 1
        ? "Solo"
        : count <= 3
        ? "Hybrid"
        : "Manual";
    const genreText =
      selected === null
        ? "All"
        : Array.from(selected)
            .slice(0, 3)
            .map((g) => GENRES[g] || g)
            .join(", ") || "None";
    const ts = formatTimestamp(new Date());
    return `${modeWord}: ${genreText} — ${ts}`;
  }, [selected]);

  const derivePresetCore = React.useCallback(
    (h: {
      name?: string;
      selections?: any;
      createdAt?: string;
      text?: string;
    }) => {
      if (h.name && h.name.trim()) return h.name;
      const sels = h.selections as
        | Record<string, { genre?: GenreKey }>
        | undefined;
      const genreSet = new Set<GenreKey>();
      if (sels) {
        Object.values(sels).forEach((v: any) => {
          if (v?.genre) genreSet.add(v.genre as GenreKey);
        });
      }
      const count = genreSet.size;
      const modeWord =
        count <= 0
          ? "Shuffle"
          : count === 1
          ? "Solo"
          : count <= 3
          ? "Hybrid"
          : "Manual";
      const genreNames =
        Array.from(genreSet)
          .slice(0, 3)
          .map((g) => GENRES[g] || g)
          .join(", ") || (count === 0 ? "All" : "None");
      return `${modeWord}: ${genreNames}`;
    },
    []
  );

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = presetDropdownRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setPresetOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresetOpen(false);
    };
    const calcPlacement = () => {
      const el = presetDropdownRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;
      const preferBelow = spaceBelow >= 340 && spaceBelow > spaceAbove + 160;
      setPresetPlaceAbove(!preferBelow);
    };
    if (presetOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
      calcPlacement();
      window.addEventListener("resize", calcPlacement);
      window.addEventListener("scroll", calcPlacement, true);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", calcPlacement);
      window.removeEventListener("scroll", calcPlacement);
    };
  }, [presetOpen]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 md:space-y-5 lg:space-y-6">
        <div className="bg-neutral-950 rounded-lg border border-neutral-800">
          <div className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 rounded-t-lg flex items-center justify-between cursor-pointer select-none hover:bg-neutral-950/60 h-10">
            <div className="text-sm font-medium text-neutral-200">Genres</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelected(new Set<GenreKey>());
                  setSelections({});
                }}
                className="btn-black-sm hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
              >
                Clear
              </button>
              <button
                onClick={() => setSelected(null)}
                className="btn-black-sm hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
              >
                all
              </button>
              <button
                onClick={generateFromGenres}
                disabled={!canGenerateFromGenres}
                className={`px-2 py-1 text-xs rounded-md ${
                  canGenerateFromGenres
                    ? "bg-accent-600 hover:bg-accent-500 text-white"
                    : "bg-neutral-950 border border-white/10 text-neutral-500 cursor-not-allowed"
                }`}
                title="Reveal prompt from selected genres"
              >
                prompt
              </button>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <GenrePicker
              value={selected}
              onChange={setSelected}
              onGeneratePrompt={generateFromGenres}
              canGenerate={canGenerateFromGenres}
              showHeader={false}
            />
            {/* Presets bar */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="grid grid-cols-1 gap-3 items-start mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    ref={presetDropdownRef}
                    className="relative min-w-0 flex-1 sm:min-w-[20rem] lg:max-w-[36rem] xl:max-w-[40rem] 2xl:max-w-[44rem]"
                  >
                    <button
                      type="button"
                      onClick={() => setPresetOpen((v) => !v)}
                      className="w-full inline-flex items-center justify-between rounded-md bg-neutral-950 border border-neutral-800 hover:border-accent-600/50 text-neutral-200 text-[10px] sm:text-[11px] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-600/30"
                      aria-haspopup="listbox"
                      title="Select a preset"
                    >
                      <span className="truncate text-neutral-400">
                        Select a preset…
                      </span>
                      <svg
                        className="h-3.5 w-3.5 text-neutral-400 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                      </svg>
                    </button>
                    {presetOpen && (
                      <div
                        className={`absolute z-40 ${
                          presetPlaceAbove
                            ? "bottom-full mb-1"
                            : "top-full mt-1"
                        } left-0 right-0 w-full rounded-md border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm shadow-lg dropdown-panel`}
                      >
                        <div className="max-h-[26rem] overflow-y-auto no-scrollbar">
                          <div
                            role="listbox"
                            aria-label="Preset options"
                            className="divide-y divide-neutral-800"
                          >
                            {history.length === 0 && (
                              <div className="px-3 py-2 text-xs text-neutral-400">
                                No presets yet
                              </div>
                            )}
                            {history.map((h) => {
                              const ts = h.createdAt
                                ? formatTimestamp(new Date(h.createdAt))
                                : "";
                              const core = derivePresetCore(h as any);
                              const sel = activePresetId === h.id;
                              return (
                                <div
                                  key={h.id}
                                  role="option"
                                  {...(sel ? { "aria-selected": "true" } : {})}
                                  className={`w-full px-3 py-2 cursor-pointer text-neutral-200 ${
                                    sel
                                      ? "bg-accent-600/20 hover:bg-accent-600/25"
                                      : "hover:bg-accent-600/15"
                                  }`}
                                  onClick={() => {
                                    setPresetOpen(false);
                                    if ((h as any).selections)
                                      setSelections(
                                        (h as any).selections as any
                                      );
                                    setActivePresetId(h.id);
                                    setEditingName(core);
                                  }}
                                >
                                  <span className="inline-flex items-baseline gap-2">
                                    <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                                      {ts}
                                    </span>
                                    <span className="text-[11px] text-neutral-200 truncate">
                                      {core}
                                    </span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        if (!currentPrompt) return;
                        add({
                          text: currentPrompt,
                          selections: selections as any,
                          name: defaultPresetName(),
                        });
                      }}
                      title="Save this prompt as a preset"
                      className="btn-black-sm text-[11px] sm:text-xs hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => clear()}
                      className="btn-black-sm text-[11px] sm:text-xs hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {activePresetId && (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Preset name"
                      className="min-w-0 flex-1 sm:min-w-[20rem] lg:max-w-[36rem] xl:max-w-[40rem] 2xl:max-w-[44rem] rounded-md bg-neutral-950 border border-white/10 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/10 text-[10px] sm:text-[11px] px-2 py-1.5"
                    />
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        className="btn-black-sm text-[11px] sm:text-xs hover:border-accent-500 hover:text-accent-300 hover:scale-[1.02] active:scale-[0.99]"
                        onClick={() => {
                          if (!activePresetId) return;
                          rename(activePresetId, editingName.trim());
                        }}
                        title="Rename selected preset"
                      >
                        Rename
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <PromptOutput
          selections={selections}
          onApplyEdited={() => {}}
          defaultOpen={true}
          generating={false}
          externalText={currentPrompt || undefined}
          onSavePreset={(text) => {
            if (!text) return;
            add({ text, selections: selections as any });
          }}
          onClearAll={() => setSelections({})}
        />

        <ManualPanel
          selectedGenres={selectedList}
          selections={selections}
          onChange={onCellChange}
          onGeneratePrompt={openPromptOutput}
          canGeneratePrompt={true}
          defaultOpen={false}
          headerId="manual-panel-header"
          bodyId="manual-panel-body"
          onClearSelections={() => setSelections({})}
          onAutoFill={generateFromGenres}
        />
      </div>
    </div>
  );
}
