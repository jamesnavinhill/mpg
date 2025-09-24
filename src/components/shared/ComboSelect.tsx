import React from "react";

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
  React.useEffect(() => setText(value || ""), [value]);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
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
      {open && filtered.length > 0 && (
        <div className="absolute z-40 mt-1 left-0 right-0 rounded-md border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm shadow-lg max-h-64 overflow-auto">
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
        </div>
      )}
    </div>
  );
}
