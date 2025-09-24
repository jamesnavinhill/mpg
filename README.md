# Music Prompt Generator (standalone)

- Dev server: `pnpm dev`
- Build: `pnpm build`
- Preview: `pnpm preview`

## Routes

- `/music` — Music Prompt Generator (existing)
- `/image` — Image Prompt Generator (formats, styles, sections)
- `/video` — Video Prompt Generator (formats, styles, timing)

## Notes

- Image/Video pages share schema-driven components (`FormatPicker`, `StylePicker`, `SectionGrid`).
- Prompts are generated via `formatSchemaPrompt`; history is saved separately per generator.

This is a standalone extraction of the Music Lab prompt UI for reuse in other apps. It has no auth or API calls. Styling matches the original Tailwind theme.
