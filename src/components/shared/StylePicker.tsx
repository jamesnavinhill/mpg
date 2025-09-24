import React from "react";
import SimpleSelect, { SimpleOptionGroup } from "../ui/SimpleSelect";
import { StyleOption } from "../../lib/types";

export default function StylePicker({
  options,
  value,
  onChange,
}: {
  options: StyleOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const groups: SimpleOptionGroup[] = [
    {
      label: "Styles",
      options: options.map((s) => ({ value: s.id, label: s.label })),
    },
  ];
  return (
    <SimpleSelect
      value={value}
      onChange={onChange}
      placeholder="Select style"
      groups={groups}
      className="min-w-[14rem]"
    />
  );
}
