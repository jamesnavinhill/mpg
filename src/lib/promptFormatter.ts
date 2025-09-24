import { GENRES, SECTIONS, SectionId, GenreKey } from "./promptConfig";

export type SelectionCell = { genre?: GenreKey; value?: string };
export type SelectionMatrix = Record<string, SelectionCell>;

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

function getCategory(
  sectionId: SectionId,
  rowIndex: number
): string | undefined {
  const sec = SECTIONS.find((s) => s.id === sectionId);
  return sec?.categories[rowIndex];
}

function joinList(list: string[]): string {
  const items = uniq(list.map((s) => s.trim()).filter(Boolean));
  return items.join(", ");
}

function parseBpm(str: string): number | null {
  const s = str.toLowerCase();
  const range = s.match(/(\d{2,3})\s*-\s*(\d{2,3})\s*bpm/);
  if (range) {
    const a = parseInt(range[1], 10);
    const b = parseInt(range[2], 10);
    if (!isNaN(a) && !isNaN(b)) return Math.round((a + b) / 2);
  }
  const single = s.match(/(\d{2,3})\s*bpm/);
  if (single) {
    const n = parseInt(single[1], 10);
    if (!isNaN(n)) return n;
  }
  return null;
}

function formatKey(str: string): string {
  const m = str.match(/^(.*?)(\s+)(Major|Minor)$/i);
  if (m) {
    return `${m[1]}${m[2]}${m[3].toLowerCase()}`;
  }
  return str;
}

function pickFirstValid<T>(arr: (T | undefined)[]): T | undefined {
  for (const x of arr) if (x !== undefined) return x as T;
  return undefined;
}

export function formatSelectionsAsSongPrompt(
  selections: SelectionMatrix
): string {
  const entries = Object.entries(selections).filter(([, v]) => !!v?.value);
  if (entries.length === 0) return "";

  const byCategory: Record<string, string[]> = {};
  const genreKeys = new Set<GenreKey>();

  for (const [key, cell] of entries) {
    const [sectionId, rowStr] = key.split("-") as [SectionId, string];
    const row = parseInt(rowStr, 10) || 0;
    const category = getCategory(sectionId, row);
    if (!category) continue;
    if (!byCategory[category]) byCategory[category] = [];
    if (cell.value) byCategory[category].push(cell.value);
    if (cell.genre) genreKeys.add(cell.genre);
  }

  const selectedGenreLabels = Array.from(genreKeys).map((g) => GENRES[g]);
  let fusionLead = "";
  if (selectedGenreLabels.length >= 2) {
    const leadPair = selectedGenreLabels.slice(0, 3).join("/");
    fusionLead = `${leadPair} ${
      selectedGenreLabels.length === 2 ? "hybrid" : "fusion"
    }`;
  } else if (selectedGenreLabels.length === 1) {
    fusionLead = `${selectedGenreLabels[0]} vibe`;
  }

  const vibe = pickFirstValid([byCategory["Overall Vibe"]?.[0]]);
  const vibePrefix = vibe ? `${vibe} ` : "";

  const coreStyle = byCategory["Genre/Style"] || [];
  const tempoVals = byCategory["BPM/Tempo"] || [];
  const keyVals = byCategory["Key/Scale"] || [];
  const timeVals = byCategory["Time Signature"] || [];

  const bpm = pickFirstValid(tempoVals.map(parseBpm));
  const keyStr = pickFirstValid(keyVals.map(formatKey));
  const timeSig = pickFirstValid(timeVals);

  const rhythm = [
    ...(byCategory["Drum Kit Style"] || []),
    ...(byCategory["Kick Pattern"] || []),
    ...(byCategory["Snare/Clap Style"] || []),
    ...(byCategory["Hi-hat Pattern"] || []),
  ];

  const bass = [
    ...(byCategory["Bass Type"] || []),
    ...(byCategory["Bass Pattern/Style"] || []),
    ...(byCategory["Bass Tone/Character"] || []),
    ...(byCategory["Bass Accents"] || []),
  ];

  const melodic = [
    ...(byCategory["Lead Instrument"] || []),
    ...(byCategory["Chord Progression"] || []),
    ...(byCategory["Harmonic Movement"] || []),
    ...(byCategory["Secondary Melodic"] || []),
  ];

  const texture = [
    ...(byCategory["Ambient Elements"] || []),
    ...(byCategory["Sound Effects"] || []),
    ...(byCategory["Spatial Elements"] || []),
  ];

  const production = [
    ...(byCategory["Mix Style"] || []),
    ...(byCategory["Effects Processing"] || []),
    ...(byCategory["Era/Time Period"] || []),
  ];

  const lead = `${vibePrefix}${fusionLead || ""}`.trim();
  const descriptors: string[] = [];
  if (coreStyle.length) descriptors.push(joinList(coreStyle));
  if (melodic.length) descriptors.push(joinList(melodic));
  if (texture.length) descriptors.push(joinList(texture));
  if (rhythm.length) descriptors.push(joinList(rhythm));
  if (bass.length) descriptors.push(joinList(bass));
  if (production.length) descriptors.push(joinList(production));
  if (timeSig) descriptors.push(`${timeSig} timing`);

  let soundPrompt = `Sound Prompt: ${lead || ""}${
    descriptors.length ? ` with ${descriptors.join(", ")}` : ""
  }`.trim();
  const bpmKeyTail = [bpm ? `${bpm} bpm` : undefined, keyStr]
    .filter(Boolean)
    .join(", ");
  if (bpmKeyTail) soundPrompt += `, ${bpmKeyTail}`;

  const vocal = byCategory["Vocal/Lyrical"] || [];
  let lyricsLine = "";
  if (vocal.length) {
    const nonInstrumental = vocal.filter(
      (v) => v.toLowerCase() !== "instrumental (no vocals)".toLowerCase()
    );
    if (nonInstrumental.length > 0) {
      lyricsLine = `Lyrics (optional): ${joinList(nonInstrumental)}`;
    }
  }

  const lines = [soundPrompt];
  if (lyricsLine) lines.push(lyricsLine);
  return lines.join("\n");
}
