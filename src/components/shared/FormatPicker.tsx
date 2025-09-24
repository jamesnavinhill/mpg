import React from "react";
import SimpleSelect, { SimpleOptionGroup } from "../ui/SimpleSelect";
import { FormatOption } from "../../lib/types";

export default function FormatPicker({
  options,
  value,
  onChange,
}: {
  options: FormatOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const groups: SimpleOptionGroup[] = [
    {
      label: "Formats",
      options: options.map((f) => ({ value: f.id, label: f.label })),
    },
  ];
  return (
    <SimpleSelect
      value={value}
      onChange={onChange}
      placeholder="Select format"
      groups={groups}
      className="min-w-[14rem]"
    />
  );
}
