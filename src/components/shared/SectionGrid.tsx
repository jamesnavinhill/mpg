import React from "react";
import { SectionDef, Field } from "../../lib/types";
import ChipsInput from "./ChipsInput";
import ComboSelect from "./ComboSelect";

type Values = Record<string, any>;

export default function SectionGrid({
  sections,
  values,
  onChange,
}: {
  sections: SectionDef[];
  values: Values;
  onChange: (next: Values) => void;
}) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(sections.map((s) => s.id))
  );
  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setField = (id: string, val: any) => {
    const next = { ...values } as any;
    setByPath(next, id, val);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {sections.map((sec) => {
        const open = openIds.has(sec.id);
        return (
          <div
            key={sec.id}
            className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(sec.id)}
              className="w-full px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 text-sm font-medium flex items-center justify-between hover:bg-neutral-950/60"
            >
              <span>{sec.label}</span>
              <svg
                className={`h-4 w-4 text-neutral-400 transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                viewBox="0 0 24 24"
                fill="none"
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
            </button>
            <div
              className={
                open
                  ? "p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                  : "hidden"
              }
            >
              {sec.fields.map((f) => (
                <FieldEditor
                  key={f.id}
                  field={f}
                  value={getByPath(values, f.id)}
                  onChange={(v) => setField(f.id, v)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) {
  const label = (
    <label
      className="block text-[11px] text-neutral-300 mb-1"
      htmlFor={field.id}
    >
      {field.label}
    </label>
  );
  if (field.type === "text") {
    return (
      <div>
        {label}
        <ComboSelect
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder}
          suggestions={field.options || []}
        />
      </div>
    );
  }
  if (field.type === "chips") {
    return (
      <div>
        {label}
        <ChipsInput
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          placeholder={field.placeholder}
          suggestions={field.options}
        />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div>
        {label}
        <ComboSelect
          value={value || ""}
          onChange={onChange}
          placeholder={field.placeholder || "Select or type…"}
          suggestions={field.options || []}
        />
      </div>
    );
  }
  if (field.type === "slider") {
    const min = field.min ?? 0;
    const max = field.max ?? 100;
    const step = field.step ?? 1;
    return (
      <div>
        {label}
        <input
          id={field.id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={
            typeof value === "number" ? value : Math.round((min + max) / 2)
          }
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full"
        />
      </div>
    );
  }
  if (field.type === "toggle") {
    return (
      <div className="flex items-center gap-2">
        <input
          id={field.id}
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={field.id} className="text-[11px] text-neutral-300">
          {field.label}
        </label>
      </div>
    );
  }
  return null;
}

function getByPath(obj: any, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setByPath(obj: any, path: string, val: any) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
}
