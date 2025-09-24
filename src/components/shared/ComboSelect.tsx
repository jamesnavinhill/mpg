import React from "react";
import { createPortal } from "react-dom";

export default function ComboSelect({
  value,
  onChange,
  suggestions = [],
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  suggestions?: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(value || "");
  const ref = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [placeAbove, setPlaceAbove] = React.useState(false);
  const [rect, setRect] = React.useState<{
    left: number;
    top: number;
    bottom: number;
    width: number;
  } | null>(null);
  React.useEffect(() => setText(value || ""), [value]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const wrap = ref.current;
      const panel = panelRef.current;
      const target = e.target as Node;
      if (wrap && wrap.contains(target)) return;
      if (panel && panel.contains(target)) return;
      setOpen(false);
    };

    const calcPlacement = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left, top: r.top, bottom: r.bottom, width: r.width });
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportH - r.bottom;
      const spaceAbove = r.top;
      const preferBelow = spaceBelow >= 240 && spaceBelow > spaceAbove + 120;
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
  const filtered = suggestions
    .filter((s) => s.toLowerCase().includes(text.toLowerCase()))
    .slice(0, 50);
  return (
    <div ref={ref} className="relative">
      <input
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => onChange(text)}
        className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200"
      />
      {open &&
        filtered.length > 0 &&
        rect &&
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
            className="z-[1000] rounded-md border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm shadow-lg max-h-64 overflow-auto"
          >
            {filtered.map((opt) => (
              <div
                key={opt}
                className="px-3 py-1.5 text-xs cursor-pointer text-neutral-200 hover:bg-accent-600/15"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setText(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
