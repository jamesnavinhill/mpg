import React from "react";

export default function ChipsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = React.useState("");
  const add = (v: string) => {
    const t = v.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
  };
  const remove = (i: number) => {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  };
  return (
    <div className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200">
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
          onChange={(e) => setText(e.target.value)}
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
    </div>
  );
}
