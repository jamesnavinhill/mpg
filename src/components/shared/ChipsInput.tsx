import React from "react";
import { createPortal } from "react-dom";

export default function ChipsInput({
  value,
  onChange,
  placeholder,
  suggestions,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [text, setText] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [placeAbove, setPlaceAbove] = React.useState(false);
  const [rect, setRect] = React.useState<{
    left: number;
    top: number;
    bottom: number;
    width: number;
  } | null>(null);
  const add = (v: string) => {
    const t = v.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setOpen(false);
  };
  const remove = (i: number) => {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  };
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const wrap = wrapRef.current;
      const panel = panelRef.current;
      const target = e.target as Node;
      if (wrap && wrap.contains(target)) return;
      if (panel && panel.contains(target)) return;
      setOpen(false);
    };
    const calcPlacement = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left, top: r.top, bottom: r.bottom, width: r.width });
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportH - r.bottom;
      const spaceAbove = r.top;
      const preferBelow = spaceBelow >= 260 && spaceBelow > spaceAbove + 120;
      setPlaceAbove(!preferBelow);
    };
    calcPlacement();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("resize", calcPlacement);
    window.addEventListener("scroll", calcPlacement, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("resize", calcPlacement);
      window.removeEventListener("scroll", calcPlacement, true);
    };
  }, [open]);

  const filtered = React.useMemo(() => {
    const base = Array.isArray(suggestions) ? suggestions : [];
    const term = text.trim().toLowerCase();
    const notSelected = base.filter((s) => !value.includes(s));
    if (!term) return notSelected.slice(0, 50);
    return notSelected
      .filter((s) => s.toLowerCase().includes(term))
      .slice(0, 50);
  }, [suggestions, value, text]);
  return (
    <div
      ref={wrapRef}
      className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200"
    >
      <div className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span
            key={`${v}-${i}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-600/20 text-accent-200 border border-accent-600/40"
          >
            {v}
            <button
              aria-label={`Remove ${v}`}
              className="text-accent-300 hover:text-accent-100"
              onClick={() => remove(i)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          aria-label={placeholder || "Add item"}
          className="flex-1 min-w-[8rem] bg-transparent outline-none placeholder:text-neutral-500"
          placeholder={placeholder || "Add and press Enter"}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(text);
              setText("");
            }
            if (e.key === ",") {
              e.preventDefault();
              add(text.replace(/,$/, ""));
              setText("");
            }
            if (e.key === "Backspace" && text === "" && value.length > 0) {
              remove(value.length - 1);
            }
          }}
        />
      </div>
      {open &&
        rect &&
        Array.isArray(suggestions) &&
        suggestions.length > 0 &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              left: rect.left,
              width: rect.width,
              ...(placeAbove
                ? { bottom: window.innerHeight - rect.top + 8 }
                : { top: rect.bottom + 8 }),
            }}
            className="z-[1000] rounded-md border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm shadow-lg dropdown-panel"
          >
            <div className="max-h-[22rem] overflow-y-auto no-scrollbar">
              <div className="divide-y divide-neutral-800">
                <div className="py-1">
                  <div className="px-3 pb-1 text-[10px] font-medium text-white/90">
                    Suggestions
                  </div>
                  {filtered.length === 0 && (
                    <div className="px-3 py-1 text-xs text-neutral-500">
                      No matches
                    </div>
                  )}
                  {filtered.map((sug) => (
                    <div
                      key={sug}
                      role="option"
                      className="px-3 py-1.5 text-xs cursor-pointer text-neutral-200 hover:bg-accent-600/15"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        add(sug);
                        setText("");
                      }}
                    >
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
