"use client";
import React from "react";

export type SimpleOption = { value: string; label: string };
export type SimpleOptionGroup = { label: string; options: SimpleOption[] };

export default function SimpleSelect({
  value,
  onChange,
  placeholder,
  groups,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  groups: SimpleOptionGroup[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [placeAbove, setPlaceAbove] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };

    const calcPlacement = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;
      const preferBelow = spaceBelow >= 280 && spaceBelow > spaceAbove + 120;
      setPlaceAbove(!preferBelow);
    };

    calcPlacement();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("resize", calcPlacement);
    window.addEventListener("scroll", calcPlacement, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("resize", calcPlacement);
      window.removeEventListener("scroll", calcPlacement);
    };
  }, [open]);

  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );
  const selected = allOptions.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full inline-flex items-center justify-between rounded-md bg-neutral-950 border border-neutral-800 hover:border-accent-600/50 text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent-600/30`}
        aria-haspopup="listbox"
        title={placeholder}
      >
        <span
          className={`truncate ${
            selected ? "text-accent-300" : "text-neutral-400"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className="h-4 w-4 text-neutral-400 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute z-40 ${
            placeAbove ? "bottom-full mb-1" : "top-full mt-1"
          } left-0 right-0 w-full rounded-md border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm shadow-lg dropdown-panel`}
        >
          <div className="max-h-[26rem] overflow-y-auto no-scrollbar">
            <div
              role="listbox"
              aria-label="Options"
              className="divide-y divide-neutral-800"
            >
              {groups.map((g, gi) => (
                <div key={gi} className="py-1">
                  <div className="px-3 pb-1 text-[10px] font-medium text-white/90">
                    {g.label}
                  </div>
                  {g.options.length === 0 && (
                    <div className="px-3 py-1 text-xs text-neutral-500">
                      No options
                    </div>
                  )}
                  {g.options.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        {...(isSelected ? { "aria-selected": true } : {})}
                        className={`px-3 py-1.5 text-xs cursor-pointer text-neutral-200 transition-colors ${
                          isSelected
                            ? "bg-accent-600/20 hover:bg-accent-600/25"
                            : "hover:bg-accent-600/15"
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onChange(opt.value);
                          setOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
