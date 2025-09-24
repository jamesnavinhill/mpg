export type GeneratorType = "music" | "image" | "video";

export type FormatOption = {
  id: string;
  label: string;
  aspectRatio: string; // e.g., 16:9
  mediaType: string; // e.g., Album Art, Short Vertical
  defaults?: Record<string, any>;
};

export type StyleOption = {
  id: string;
  label: string;
  tags?: string[];
  presets?: Record<string, any>;
};

export type FieldType =
  | "select"
  | "multiselect"
  | "chips"
  | "text"
  | "slider"
  | "toggle";

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  dependsOn?: { fieldId: string; equals?: string | boolean }[];
};

export type SectionDef = {
  id: string;
  label: string;
  fields: Field[];
  showIf?: { fieldId: string; equals?: string | boolean }[];
};

export type GeneratorSchema = {
  id: GeneratorType;
  label: string;
  formats: FormatOption[];
  styles: StyleOption[];
  sections: SectionDef[];
};
