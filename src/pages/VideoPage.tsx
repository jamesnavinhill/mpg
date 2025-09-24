import React from "react";
import videoSchema from "../lib/schemas/video";
import FormatPicker from "../components/shared/FormatPicker";
import StylePicker from "../components/shared/StylePicker";
import { formatSchemaPrompt } from "../lib/promptFormatter";
import SectionGrid from "../components/shared/SectionGrid";
import { usePromptHistory } from "../components/prompt/usePromptHistory";
import GenericPromptOutput from "../components/shared/GenericPromptOutput";

export default function VideoPage() {
  const [formatId, setFormatId] = React.useState<string>(
    videoSchema.formats[0]?.id || ""
  );
  const [styleId, setStyleId] = React.useState<string>(
    videoSchema.styles[0]?.id || ""
  );
  const format = videoSchema.formats.find((f) => f.id === formatId);
  const style = videoSchema.styles.find((s) => s.id === styleId)?.label;

  const [values, setValues] = React.useState<Record<string, any>>({});
  const { add } = usePromptHistory("mpg_prompt_history_video_v1");

  const negatives: string[] = Array.isArray(values?.neg?.list)
    ? (values as any).neg.list
    : Array.isArray(values?.negatives?.list)
    ? (values as any).negatives.list
    : [];
  const prompt = formatSchemaPrompt("video", format, style, values, negatives);
  const detailed = React.useMemo(() => {
    const lines: string[] = [];
    Object.entries(values).forEach(([group, obj]) => {
      if (obj && typeof obj === "object") {
        lines.push(`${group}:`);
        Object.entries(obj as any).forEach(([k, v]) => {
          const text = Array.isArray(v) ? v.join(", ") : String(v ?? "");
          if (text) lines.push(`- ${k}: ${text}`);
        });
        lines.push("");
      }
    });
    return lines.join("\n").trim();
  }, [values]);
  React.useEffect(() => {
    if (!prompt) return;
    const t = setTimeout(() => {
      add({ text: prompt, selections: { formatId, styleId, values } });
    }, 500);
    return () => clearTimeout(t);
  }, [prompt, formatId, styleId, values, add]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Video Prompt Generator</h1>
      <div className="flex flex-wrap items-center gap-2">
        <FormatPicker
          options={videoSchema.formats}
          value={formatId}
          onChange={setFormatId}
        />
        <StylePicker
          options={videoSchema.styles}
          value={styleId}
          onChange={setStyleId}
        />
      </div>
      <SectionGrid
        sections={videoSchema.sections}
        values={values}
        onChange={setValues}
      />
      <GenericPromptOutput
        prompt={prompt}
        detailed={detailed}
        onSavePreset={(text) =>
          add({ text, selections: { formatId, styleId, values } })
        }
        onClearAll={() => setValues({})}
        title="Prompts"
      />
    </div>
  );
}
