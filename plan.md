# plan

## High-Level Plan

- Architecture: Add routing with three generators and a shared layout.
- Schema: Define a config-driven schema for formats, styles, and sections.
- Image: Propose 8–12 styles, core sections, and format matrix.
- Video: Propose 8–12 styles, core sections, and format matrix.
- UI: Reuse/refactor shared components and wire to schema.
- Output: Schema-driven prompt formatter and history.
- Rollout: Implement in small PRs with smoke tests.

## Architecture

- Routes: `/music`, `/image`, `/video` using `react-router-dom`.
- Layout: Shared shell with top nav and route-level pages.
- Structure:
  - `src/pages/`: `MusicPage.tsx`, `ImagePage.tsx`, `VideoPage.tsx`
  - `src/components/shared/`: `FormatPicker`, `StylePicker`, `SectionGrid`
  - `src/lib/schemas/`: `music.ts`, `image.ts`, `video.ts`
  - `src/lib/types.ts`: Shared TypeScript types for schema
  - promptFormatter.ts: Make schema-driven
  - Keep current styles and tailwind config shared
- State + History: Extend `usePromptHistory` to namespace by generator type.

## Schema (Shared Types)

- `GeneratorType`: `music | image | video`
- `FormatOption`: `{ id, label, aspectRatio, mediaType, defaults? }`
- `StyleOption`: `{ id, label, tags?, presets? }`
- `Field`: `{ id, label, type: 'select'|'multiselect'|'chips'|'text'|'slider'|'toggle', options?, placeholder?, min?, max?, step?, dependsOn? }`
- `Section`: `{ id, label, fields: Field[], showIf? }`
- `GeneratorSchema`: `{ id, label, formats: FormatOption[], styles: StyleOption[], sections: Section[], template: (values) => string, negativeTemplate? }`

- Prompt composition:
  - Order: Format → Type → Style → Sections → Post-processing → Negatives
  - Template tokens map: keep short, consistent tokens for AI friendliness.

## Image Generator

- Purpose: Fine-grained control for diverse deliverables (album art, concept art, web, marketing).
- Format (separate from style/sections):
  - Media Types: `Album Art (1:1)`, `Poster (2:3 | 3:4)`, `Web Hero (16:9 | 21:9)`, `Social Portrait (4:5 | 9:16)`, `Story/Reel (9:16)`, `Banner (3:1)`, `Square Post (1:1)`, `Thumbnail (16:9)`, `Icon (1:1)`
  - Aspect Ratios: `1:1`, `2:3`, `3:4`, `4:5`, `9:16`, `16:9`, `21:9`, `3:1`
- Styles (pick 10–12, expandable):
  - Photorealistic
  - Cinematic Film Still
  - Studio Portrait
  - Concept Art
  - Digital Painting
  - Watercolor
  - Vector/Flat Design
  - Isometric Illustration
  - Line Art/Ink
  - Cyberpunk/Neon
  - Vintage/Film Emulation
  - Surreal/Dreamlike
- Core Sections (fields within each):
  - Subject & Focus: main subject, secondary elements, action
  - Composition: wide/close-up, rule-of-thirds/centered, perspective (eye-level/low/high), depth of field
  - Camera/Optics: lens mm, aperture feel (shallow/deep), macro/tele
  - Lighting: type (softbox, golden hour, rim, volumetric), direction, intensity
  - Color Palette: palette names or hex, saturation, contrast
  - Materials & Textures: metal/wood/fabric/glass/skin/etc., surface qualities
  - Style Modifiers: painterly, graphic, gritty, minimal, ornate
  - Detail & Fidelity: `detail level` slider, realism vs stylization
  - Post-Processing: grain, vignette, bloom, chromatic aberration, film stock
  - Negative Prompts: avoid lists (e.g., low-res, artifacts, extra limbs)
  - References (optional): artist/era/inspiration
- Conditional Logic (examples):
  - If `Style = Vector/Flat`, hide `Camera/Optics`; emphasize `Color Palette` and `Style Modifiers`.
  - If `Media Type = Album Art`, lock aspect ratio to `1:1`, surface `Text-safe composition` toggle.
  - If `Style = Photorealistic`, elevate `Camera/Optics` and `Lighting` fields; enable `Skin Tone` when portrait detected.
- Auto-Prompt Presets:
  - Style preset injects defaults (e.g., Cinematic → 35mm lens feel, moody lighting).
  - Media Type preset nudges composition (e.g., Banner → negative space on sides).
- Example Image Template (conceptual):
  - “[SUBJECT]. [COMPOSITION]. [LIGHTING]. [COLOR]. [MATERIALS]. [STYLE MODIFIERS]. [STYLE] style. [POST FX]. Format: [MEDIA TYPE], AR [RATIO]. Avoid: [NEGATIVES].”

## Video Generator

- Purpose: Similar control for short-form and horizontal videos with motion directives.
- Format:
  - Media Types: `Short Vertical (9:16)`, `Square Social (1:1)`, `Horizontal 1080p (16:9)`, `Horizontal 4K (16:9)`, `Title Card`, `Looping Background`, `Bumper/Intro`, `Product Promo`
  - Key Params: `Aspect Ratio`, `Resolution Preset`, `Duration (s)`, `FPS`, `Looping` toggle
- Styles (8–12):
  - Cinematic/Film
  - Music Video Aesthetic
  - Documentary/Run-and-gun
  - Commercial/Product
  - Explainer/Infographic
  - 2D Animation
  - 3D Animation
  - VHS/Retro/Analog
  - Cyberpunk/Neon
  - Surreal/Dreamlike
  - Minimal/Monochrome
- Core Sections:
  - Subject & Scene: main subject, setting, era, mood
  - Camera & Motion: moves (dolly, pan, tilt, handheld), speed, framing changes
  - Shot Design: shot list or beat synopsis; transitions (cut/dissolve/whip)
  - Lighting & Atmosphere: key/fill/rim, volumetrics, fog, time-of-day
  - Color Grade: LUT names, palette, contrast/film emulation
  - VFX & Styling: particles, glitches, overlays, typography moments
  - Timing & Rhythm: tempo, accent beats, loops, pacing
  - Audio Cues (optional): sync intent, on-beat transitions, lyric cues
  - Post-Processing: grain, bloom, chromatic aberration, distortion
  - Negative Prompts: artifact avoidance, style exclusions
- Conditional Logic:
  - If `Style = Explainer/Infographic`, surface `Typography moments` and `Graph motion`; de-emphasize realistic lighting.
  - If `Media Type = Short Vertical`, set AR `9:16`, elevate `Center-weighted composition`, advise `fast pacing`.
  - If `Looping = true`, enforce start/end frame similarity hints and seamless camera motion.
- Example Video Template (conceptual):
  - “[STYLE] [SUBJECT/SCENE], [CAMERA MOTION], [SHOT DESIGN], [LIGHTING], grade: [COLOR GRADE], VFX: [EFFECTS], pacing: [TEMPO], duration [S] @ [FPS], format [MEDIA TYPE], AR [RATIO], res [PRESET]. Avoid: [NEGATIVES].”

## Shared UX

- Top-level “Format” section before anything else.
- “Type” next: high-level deliverable intent (image: album art, concept art, product shot, web hero, infographic; video: short vertical, product promo, explainer, title card, bumper).
- “Style” third: 8–12 curated styles per generator.
- “Sections”: context-aware fields, collapsible groups, presets per style/type.
- “Auto Mode” toggle: prefills recommended fields; users can override.
- “Copy” buttons: prompt and negative prompt separately.

## Implementation Steps (Proposed)

1) Define architecture and routing — DONE

- Added `react-router-dom`, routes: `/music`, `/image`, `/video`.
- Shared `Layout` with nav in `src/pages/Layout.tsx`.
- `MusicPage` wraps existing `App`.
- Placeholder `ImagePage` / `VideoPage` scaffolded.

1) Design shared schema — DONE

- Added `src/lib/types.ts` with generator schema types.
- Seeded schemas: `src/lib/schemas/image.ts`, `src/lib/schemas/video.ts`.
- Extended formatter with `formatSchemaPrompt(kind, format, style, values, negatives)`.

1) Image generator details

- Lock styles, sections, and format options as above.
- Add a few presets (Album Art, Web Hero, Product Shot).

1) Video generator details

- Lock styles, sections, and format options as above.
- Add presets (Short Vertical Promo, Cinematic Montage, Explainer).

1) Scaffold UI components — DONE (initial)

- Added `components/shared/FormatPicker` and `components/shared/StylePicker` using `SimpleSelect`.
- Next: Schema-agnostic `SectionGrid` to replace/refactor `UnifiedSectionGrid`.

1) Implement ImagePage — IN PROGRESS

- Bound format/style pickers to `imageSchema`.
- Using `formatSchemaPrompt` to generate prompt from placeholder values.
- Next: Build section UI using schema and persist to history.

1) Implement VideoPage — IN PROGRESS

- Bound format/style pickers to `videoSchema`.
- Using `formatSchemaPrompt` with placeholder values.
- Next: Add motion/format fields and loop handling; persist to history.

1) Docs and examples

- README: routes, usage, example prompts for each style/type.

## Acceptance Criteria

- Three routes render: `/music`, `/image`, `/video`.
- Image/Video pages each offer:
  - Format (media type + aspect ratio) separate from styles/sections
  - 8–12 styles selectable with presets
  - Sections adapt to style/type (conditional fields)
  - Prompt/negative prompt outputs
  - History save/restore
- Shared components, minimal duplication, type-safe schemas.

If you’re aligned with the proposed styles/sections and format logic, I can:

- Add `react-router-dom`, scaffold pages, and refactor the shared components and schema types.
- Seed both schemas with the lists above and wire up the formatter.
