import React from "react";
import imageSchema from "../lib/schemas/image";
import FormatPicker from "../components/shared/FormatPicker";
import StylePicker from "../components/shared/StylePicker";
import { formatSchemaPrompt } from "../lib/promptFormatter";
import SectionGrid from "../components/shared/SectionGrid";
import { usePromptHistory } from "../components/prompt/usePromptHistory";

export default function ImagePage() {
  const [formatId, setFormatId] = React.useState<string>(
    imageSchema.formats[0]?.id || ""
  );
  const [styleId, setStyleId] = React.useState<string>(
    imageSchema.styles[0]?.id || ""
  );
  const format = imageSchema.formats.find((f) => f.id === formatId);
  const style = imageSchema.styles.find((s) => s.id === styleId)?.label;

  const [values, setValues] = React.useState<Record<string, any>>({});
  const { add } = usePromptHistory("mpg_prompt_history_image_v1");

  const prompt = formatSchemaPrompt("image", format, style, values, []);
  React.useEffect(() => {
    if (!prompt) return;
    const t = setTimeout(() => {
      add({ text: prompt, selections: { formatId, styleId, values } });
    }, 500);
    return () => clearTimeout(t);
  }, [prompt, formatId, styleId, values, add]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Image Prompt Generator</h1>
      <div className="flex flex-wrap items-center gap-2">
        <FormatPicker
          options={imageSchema.formats}
          value={formatId}
          onChange={setFormatId}
        />
        <StylePicker
          options={imageSchema.styles}
          value={styleId}
          onChange={setStyleId}
        />
      </div>
      <SectionGrid
        sections={imageSchema.sections}
        values={values}
        onChange={setValues}
      />
      <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-3">
        <div className="text-xs font-medium text-accent-300 mb-2">Prompt</div>
        <textarea
          aria-label="Image prompt output"
          readOnly
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm font-mono text-neutral-200 resize-none min-h-[96px]"
          value={prompt}
        />
      </div>
    </div>
  );
}
