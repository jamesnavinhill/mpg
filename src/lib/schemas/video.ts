import { GeneratorSchema } from "../types";

export const videoSchema: GeneratorSchema = {
  id: "video",
  label: "Video",
  formats: [
    {
      id: "short-vertical",
      label: "Short Vertical (9:16)",
      mediaType: "Short Vertical",
      aspectRatio: "9:16",
    },
    {
      id: "square",
      label: "Square Social (1:1)",
      mediaType: "Square Social",
      aspectRatio: "1:1",
    },
    {
      id: "h1080",
      label: "Horizontal 1080p (16:9)",
      mediaType: "Horizontal 1080p",
      aspectRatio: "16:9",
    },
    {
      id: "h4k",
      label: "Horizontal 4K (16:9)",
      mediaType: "Horizontal 4K",
      aspectRatio: "16:9",
    },
    {
      id: "title-card",
      label: "Title Card",
      mediaType: "Title Card",
      aspectRatio: "16:9",
    },
    {
      id: "loop-bg",
      label: "Looping Background",
      mediaType: "Looping Background",
      aspectRatio: "16:9",
    },
    {
      id: "bumper",
      label: "Bumper / Intro",
      mediaType: "Bumper/Intro",
      aspectRatio: "16:9",
    },
    {
      id: "product-promo",
      label: "Product Promo",
      mediaType: "Product Promo",
      aspectRatio: "16:9",
    },
  ],
  styles: [
    { id: "cinematic", label: "Cinematic / Film" },
    { id: "music-video", label: "Music Video Aesthetic" },
    { id: "documentary", label: "Documentary / Run-and-gun" },
    { id: "commercial", label: "Commercial / Product" },
    { id: "explainer", label: "Explainer / Infographic" },
    { id: "anim-2d", label: "2D Animation" },
    { id: "anim-3d", label: "3D Animation" },
    { id: "vhs", label: "VHS / Retro / Analog" },
    { id: "cyberpunk", label: "Cyberpunk / Neon" },
    { id: "surreal", label: "Surreal / Dreamlike" },
    { id: "minimal", label: "Minimal / Monochrome" },
  ],
  sections: [
    {
      id: "subject",
      label: "Subject & Scene",
      fields: [
        {
          id: "subject.main",
          label: "Main Subject",
          type: "text",
          placeholder: "e.g., product, character, landscape",
        },
        {
          id: "subject.setting",
          label: "Setting / Era",
          type: "text",
          placeholder: "e.g., neon city, 80s arcade, forest",
        },
        {
          id: "subject.mood",
          label: "Mood",
          type: "select",
          options: ["Energetic", "Moody", "Uplifting", "Dreamlike", "Gritty"],
        },
      ],
    },
    {
      id: "camera",
      label: "Camera & Motion",
      fields: [
        {
          id: "cam.move",
          label: "Movement",
          type: "select",
          options: ["Dolly", "Pan", "Tilt", "Handheld", "Static", "Drone"],
        },
        {
          id: "cam.speed",
          label: "Speed",
          type: "select",
          options: ["Slow", "Natural", "Fast"],
        },
        {
          id: "cam.framing",
          label: "Framing Changes",
          type: "select",
          options: ["Zooms", "Punch-ins", "Reframes", "None"],
        },
      ],
    },
    {
      id: "shot",
      label: "Shot Design",
      fields: [
        {
          id: "shot.plan",
          label: "Beat / Shot Plan",
          type: "text",
          placeholder: "e.g., 3-beat sequence, hero reveal, product macro",
        },
        {
          id: "shot.transitions",
          label: "Transitions",
          type: "chips",
          placeholder: "e.g., cuts, dissolves, whip pans",
        },
      ],
    },
    {
      id: "lighting",
      label: "Lighting & Atmosphere",
      fields: [
        {
          id: "light.type",
          label: "Type",
          type: "select",
          options: ["Key/Fill/Rim", "Volumetric", "Foggy", "Hard Sun", "Neon"],
        },
        {
          id: "light.time",
          label: "Time of Day",
          type: "select",
          options: ["Golden Hour", "Night", "Midday", "Overcast"],
        },
      ],
    },
    {
      id: "grade",
      label: "Color Grade",
      fields: [
        {
          id: "grade.lut",
          label: "LUT / Look",
          type: "text",
          placeholder: "e.g., teal & orange, Kodak 2383",
        },
        {
          id: "grade.contrast",
          label: "Contrast",
          type: "slider",
          min: 0,
          max: 100,
          step: 5,
        },
      ],
    },
    {
      id: "vfx",
      label: "VFX & Styling",
      fields: [
        {
          id: "vfx.fx",
          label: "Effects",
          type: "chips",
          placeholder: "e.g., particles, glitches, overlays, type moments",
        },
      ],
    },
    {
      id: "timing",
      label: "Timing & Rhythm",
      fields: [
        {
          id: "time.tempo",
          label: "Tempo / Pacing",
          type: "select",
          options: ["Fast", "Moderate", "Slow"],
        },
        { id: "time.loop", label: "Looping", type: "toggle" },
        {
          id: "time.duration",
          label: "Duration (s)",
          type: "slider",
          min: 1,
          max: 60,
          step: 1,
        },
        {
          id: "time.fps",
          label: "FPS",
          type: "select",
          options: ["24", "25", "30", "60"],
        },
      ],
    },
    {
      id: "post",
      label: "Post-Processing",
      fields: [
        {
          id: "post.fx",
          label: "FX",
          type: "chips",
          placeholder: "e.g., grain, bloom, chromatic aberration",
        },
      ],
    },
    {
      id: "negatives",
      label: "Negative Prompts",
      fields: [
        {
          id: "neg.list",
          label: "Avoid",
          type: "chips",
          placeholder: "e.g., artifacts, banding, jitter, stutter",
        },
      ],
    },
  ],
};

export default videoSchema;
