"use client";
import React from "react";

type SavedPrompt = {
  id: string;
  text: string;
  createdAt: string;
  name?: string;
  selections?: Record<string, any>;
};

const KEY = "mpg_prompt_history_v2";

export function usePromptHistory(storageKey?: string) {
  const [history, setHistory] = React.useState<SavedPrompt[]>([]);
  const key = storageKey || KEY;

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHistory([]);
    }
  }, [key]);

  const saveAll = React.useCallback(
    (list: SavedPrompt[]) => {
      localStorage.setItem(key, JSON.stringify(list));
      setHistory(list);
    },
    [key]
  );

  const add = React.useCallback(
    (entry: Omit<SavedPrompt, "id" | "createdAt">) => {
      const e: SavedPrompt = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...entry,
      };
      const dedup = history.filter((p) => p.text !== e.text);
      const next = [e, ...dedup].slice(0, 30);
      saveAll(next);
    },
    [history, saveAll]
  );

  const rename = React.useCallback(
    (id: string, name: string) => {
      const next = history.map((h) => (h.id === id ? { ...h, name } : h));
      saveAll(next);
    },
    [history, saveAll]
  );

  const clear = React.useCallback(() => saveAll([]), [saveAll]);

  return { history, add, clear, rename };
}
