import React from "react";

export default function GenericPromptOutput({
  prompt,
  detailed,
  defaultOpen = true,
  onSavePreset,
  onClearAll,
  title = "Prompts",
}: {
  prompt: string;
  detailed?: string;
  defaultOpen?: boolean;
  onSavePreset?: (text: string) => void;
  onClearAll?: () => void;
  title?: string;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [cleanOpen, setCleanOpen] = React.useState(true);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  const autoSize = React.useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(160, Math.min(ta.scrollHeight, 600))}px`;
  }, []);
  React.useEffect(() => void autoSize(), [prompt, autoSize]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {}
  };
  return (
    <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
      <div
        className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 rounded-t-lg flex items-center justify-between cursor-pointer select-none hover:bg-neutral-950/60"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="text-sm font-medium text-neutral-200">{title}</div>
        <div className="text-xs text-neutral-400">{open ? "▲" : "▼"}</div>
      </div>
      <div className={open ? "p-3" : "hidden"}>
        <div className="border border-neutral-800 rounded-md overflow-hidden">
          <div
            className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 flex items-center justify-between cursor-pointer select-none"
            onClick={() => setCleanOpen((v) => !v)}
          >
            <div className="text-xs font-medium text-accent-300">Prompt</div>
            <div className="text-xs text-neutral-400">
              {cleanOpen ? "▲" : "▼"}
            </div>
          </div>
          <div className={cleanOpen ? "p-3" : "hidden"}>
            <textarea
              aria-label="Generated prompt"
              ref={taRef}
              value={prompt}
              readOnly
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm font-mono text-neutral-200 resize-none min-h-[96px]"
            />
            <div className="mt-2 flex gap-2">
              {onSavePreset && (
                <button
                  className="btn-black-sm"
                  onClick={() => onSavePreset(prompt)}
                >
                  Save
                </button>
              )}
              {onClearAll && (
                <button className="btn-black-sm" onClick={onClearAll}>
                  Clear
                </button>
              )}
              <button className="btn-black-sm" onClick={copy}>
                Copy
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 border border-neutral-800 rounded-md overflow-hidden">
          <div
            className="group px-3 py-2 bg-neutral-950/50 border-b border-neutral-800 flex items-center justify-between cursor-pointer select-none"
            onClick={() => setDetailsOpen((v) => !v)}
          >
            <div className="text-xs font-medium text-accent-300">
              Detailed Prompt
            </div>
            <div className="text-xs text-neutral-400">
              {detailsOpen ? "▲" : "▼"}
            </div>
          </div>
          <div className={detailsOpen ? "p-3" : "hidden"}>
            {detailed ? (
              <div className="text-xs font-mono text-neutral-200 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 whitespace-pre-wrap">
                {detailed}
              </div>
            ) : (
              <div className="text-xs text-neutral-400">No details yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
